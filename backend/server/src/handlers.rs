// src/handlers.rs
use actix_multipart::Multipart;
use actix_web::{get, post, web, Error, HttpResponse, Responder};
use futures::{StreamExt, TryStreamExt};
use log::{error, info};
use serde_json::json;
use std::fs;
use std::io::Write;
use std::path::Path;
use uuid::Uuid;
use zip::write::FileOptions;

use crate::models::{BatchDownloadRequest, ConversionResponse, ConversionSettings, ErrorResponse, HealthResponse};
use crate::utils::{generate_file_id, get_file_metadata, store_file_metadata, OUTPUT_DIR, UPLOAD_DIR};
use crate::vectorizer::convert_image_to_svg;

#[get("/api/health")]
pub async fn health_check() -> impl Responder {
    let response = HealthResponse {
        status: "ok".to_string(),
        message: "Server is running".to_string(),
    };
    
    HttpResponse::Ok().json(response)
}

#[post("/api/convert")]
pub async fn convert_image(mut payload: Multipart) -> Result<HttpResponse, Error> {
    // Generate a unique file ID
    let file_id = generate_file_id();
    
    // Default settings
    let mut settings = ConversionSettings::default();
    let mut file_name = String::new();
    let mut file_path = String::new();
    
    // Process multipart form data
    while let Ok(Some(mut field)) = payload.try_next().await {
        let content_disposition = field.content_disposition();
        let field_name = content_disposition.get_name().unwrap_or("");
        
        match field_name {
            "image" => {
                // Get original filename
                let original_name = content_disposition
                    .get_filename()
                    .unwrap_or("unknown.png")
                    .to_string();
                
                file_name = original_name.clone();
                
                // Create file path
                let file_id_str = file_id.clone();
                let extension = Path::new(&original_name)
                    .extension()
                    .and_then(|ext| ext.to_str())
                    .unwrap_or("png");
                
                file_path = format!("{}/{}.{}", UPLOAD_DIR, file_id_str, extension);
                
                // Create file
                let mut file = web::block(|| std::fs::File::create(&file_path))
                    .await
                    .unwrap();
                
                // Write file content
                while let Some(chunk) = field.next().await {
                    let data = chunk.unwrap();
                    file = web::block(move || file.write_all(&data).map(|_| file))
                        .await
                        .unwrap();
                }
            }
            "settings" => {
                // Parse settings JSON
                let mut settings_str = String::new();
                while let Some(chunk) = field.next().await {
                    let data = chunk.unwrap();
                    settings_str.push_str(std::str::from_utf8(&data).unwrap_or(""));
                }
                
                if !settings_str.is_empty() {
                    match serde_json::from_str::<ConversionSettings>(&settings_str) {
                        Ok(parsed_settings) => {
                            settings = parsed_settings;
                        }
                        Err(e) => {
                            error!("Failed to parse settings: {}", e);
                        }
                    }
                }
            }
            _ => {
                // Skip other fields
                while let Some(_) = field.next().await {}
            }
        }
    }
    
    // Check if we have a file
    if file_path.is_empty() {
        return Ok(HttpResponse::BadRequest().json(ErrorResponse {
            error: "No file uploaded".to_string(),
            details: None,
        }));
    }
    
    // Create output path
    let output_path = format!("{}/{}.svg", OUTPUT_DIR, file_id);
    
    // Store file metadata
    store_file_metadata(&file_id, &file_name, &file_path, &output_path);
    
    // Convert image to SVG
    match convert_image_to_svg(
        Path::new(&file_path),
        Path::new(&output_path),
        &settings,
    ) {
        Ok(svg_data) => {
            // Return success response
            let response = ConversionResponse {
                file_id: file_id.clone(),
                svg_data,
                message: "Conversion successful".to_string(),
            };
            
            Ok(HttpResponse::Ok().json(response))
        }
        Err(e) => {
            error!("Conversion error: {}", e);
            
            // Return error response
            Ok(HttpResponse::InternalServerError().json(ErrorResponse {
                error: "Conversion failed".to_string(),
                details: Some(e.to_string()),
            }))
        }
    }
}

#[get("/api/download/{file_id}")]
pub async fn download_svg(web::Path(file_id): web::Path<String>) -> impl Responder {
    // Get file metadata
    match get_file_metadata(&file_id) {
        Some(metadata) => {
            // Check if output file exists
            if !Path::new(&metadata.output_path).exists() {
                return HttpResponse::NotFound().json(ErrorResponse {
                    error: "File not found".to_string(),
                    details: None,
                });
            }
            
            // Read SVG data
            match fs::read(&metadata.output_path) {
                Ok(svg_data) => {
                    // Get original filename without extension
                    let original_name = Path::new(&metadata.original_name)
                        .file_stem()
                        .and_then(|stem| stem.to_str())
                        .unwrap_or("download");
                    
                    // Create download filename
                    let download_name = format!("{}.svg", original_name);
                    
                    // Return SVG file
                    HttpResponse::Ok()
                        .content_type("image/svg+xml")
                        .append_header(("Content-Disposition", format!("attachment; filename=\"{}\"", download_name)))
                        .body(svg_data)
                }
                Err(e) => {
                    error!("Failed to read SVG file: {}", e);
                    HttpResponse::InternalServerError().json(ErrorResponse {
                        error: "Failed to read file".to_string(),
                        details: Some(e.to_string()),
                    })
                }
            }
        }
        None => {
            HttpResponse::NotFound().json(ErrorResponse {
                error: "File not found".to_string(),
                details: None,
            })
        }
    }
}

#[post("/api/download-batch")]
pub async fn download_batch(req: web::Json<BatchDownloadRequest>) -> impl Responder {
    let file_ids = &req.file_ids;
    
    if file_ids.is_empty() {
        return HttpResponse::BadRequest().json(ErrorResponse {
            error: "No file IDs provided".to_string(),
            details: None,
        });
    }
    
    // Create a temporary file for the zip
    let temp_dir = tempfile::tempdir().unwrap();
    let zip_path = temp_dir.path().join("vectorised-images.zip");
    let zip_file = fs::File::create(&zip_path).unwrap();
    
    // Create zip writer
    let mut zip = zip::ZipWriter::new(zip_file);
    let options = FileOptions::default()
        .compression_method(zip::CompressionMethod::Deflated)
        .unix_permissions(0o644);
    
    let mut added_files = 0;
    
    // Add each SVG to the zip
    for file_id in file_ids {
        if let Some(metadata) = get_file_metadata(file_id) {
            let output_path = Path::new(&metadata.output_path);
            
            if output_path.exists() {
                // Get original filename without extension
                let original_name = Path::new(&metadata.original_name)
                    .file_stem()
                    .and_then(|stem| stem.to_str())
                    .unwrap_or("image");
                
                // Create filename for zip
                let zip_filename = format!("{}.svg", original_name);
                
                // Add file to zip
                match zip.start_file(zip_filename, options) {
                    Ok(_) => {
                        match fs::read(output_path) {
                            Ok(data) => {
                                if zip.write_all(&data).is_ok() {
                                    added_files += 1;
                                }
                            }
                            Err(e) => {
                                error!("Failed to read SVG file: {}", e);
                            }
                        }
                    }
                    Err(e) => {
                        error!("Failed to add file to zip: {}", e);
                    }
                }
            }
        }
    }
    
    // Finish zip file
    match zip.finish() {
        Ok(_) => {
            if added_files == 0 {
                return HttpResponse::NotFound().json(ErrorResponse {
                    error: "No files found".to_string(),
                    details: None,
                });
            }
            
            // Read zip file
            match fs::read(&zip_path) {
                Ok(zip_data) => {
                    // Return zip file
                    HttpResponse::Ok()
                        .content_type("application/zip")
                        .append_header(("Content-Disposition", "attachment; filename=\"vectorised-images.zip\""))
                        .body(zip_data)
                }
                Err(e) => {
                    error!("Failed to read zip file: {}", e);
                    HttpResponse::InternalServerError().json(ErrorResponse {
                        error: "Failed to create zip file".to_string(),
                        details: Some(e.to_string()),
                    })
                }
            }
        }
        Err(e) => {
            error!("Failed to create zip file: {}", e);
            HttpResponse::InternalServerError().json(ErrorResponse {
                error: "Failed to create zip file".to_string(),
                details: Some(e.to_string()),
            })
        }
    }
}

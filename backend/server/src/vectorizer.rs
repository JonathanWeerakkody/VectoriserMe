// src/vectorizer.rs
use crate::models::ConversionSettings;
use image::{DynamicImage, GenericImageView, ImageBuffer, Rgba};
use log::{error, info};
use std::path::Path;
use thiserror::Error;
use vtracer::{ColorMode, Config, ConverterConfig, PathSimplifyMode};

#[derive(Error, Debug)]
pub enum VectorizerError {
    #[error("Failed to load image: {0}")]
    ImageLoadError(String),
    
    #[error("Failed to process image: {0}")]
    ProcessingError(String),
    
    #[error("Failed to save SVG: {0}")]
    SaveError(String),
}

// Convert image to SVG using vtracer
pub fn convert_image_to_svg(
    input_path: &Path,
    output_path: &Path,
    settings: &ConversionSettings,
) -> Result<String, VectorizerError> {
    // Load the image
    let img = match image::open(input_path) {
        Ok(img) => img,
        Err(e) => {
            error!("Failed to load image: {}", e);
            return Err(VectorizerError::ImageLoadError(e.to_string()));
        }
    };
    
    // Apply pre-processing (brightness, contrast, gamma)
    let img = preprocess_image(img, settings);
    
    // Create vtracer config based on settings
    let config = create_vtracer_config(settings);
    
    // Convert image to SVG
    let svg_data = match convert_with_vtracer(&img, &config) {
        Ok(svg) => svg,
        Err(e) => {
            error!("Failed to convert image: {}", e);
            return Err(VectorizerError::ProcessingError(e.to_string()));
        }
    };
    
    // Save SVG to file
    if let Err(e) = std::fs::write(output_path, &svg_data) {
        error!("Failed to save SVG: {}", e);
        return Err(VectorizerError::SaveError(e.to_string()));
    }
    
    Ok(svg_data)
}

// Apply image pre-processing based on settings
fn preprocess_image(img: DynamicImage, settings: &ConversionSettings) -> DynamicImage {
    let mut img = img;
    
    // Apply brightness adjustment
    if let Some(brightness) = settings.brightness {
        if brightness != 0 {
            img = adjust_brightness(&img, brightness as f32 / 100.0);
        }
    }
    
    // Apply contrast adjustment
    if let Some(contrast) = settings.contrast {
        if contrast != 0 {
            img = adjust_contrast(&img, contrast as f32 / 100.0);
        }
    }
    
    // Apply gamma adjustment
    if let Some(gamma) = settings.gamma {
        if (gamma - 1.0).abs() > 0.01 {
            img = adjust_gamma(&img, gamma);
        }
    }
    
    img
}

// Create vtracer config from settings
fn create_vtracer_config(settings: &ConversionSettings) -> Config {
    let mut config = Config::default();
    
    // Set color mode based on output_mode
    if settings.output_mode == "bw" {
        config.color_mode = ColorMode::Binary;
        
        // Set threshold for B/W mode
        if let Some(threshold) = settings.threshold {
            // Note: vtracer doesn't have a direct binarization_threshold field
            // We'll use the hierarchical_threshold field as a workaround
            config.hierarchical_threshold = threshold as usize;
        }
    } else {
        config.color_mode = ColorMode::Color;
        
        // Set color count for Color mode
        if let Some(color_count) = settings.color_count {
            config.color_precision = color_count as usize;
        }
    }
    
    // Set path simplification
    if let Some(path_simplification) = settings.path_simplification {
        // Map 0-10 scale to vtracer's expected values
        let factor = path_simplification as f64 / 10.0;
        config.path_precision = (100.0 - (factor * 90.0)) as usize; // Higher precision = less simplification
    }
    
    // Set corner threshold
    if let Some(corner_threshold) = settings.corner_threshold {
        config.corner_threshold = corner_threshold as f64;
    }
    
    // Set curve mode
    if let Some(ref curve_mode) = settings.curve_mode {
        config.mode = match curve_mode.as_str() {
            "polygon" => PathSimplifyMode::Polygon,
            _ => PathSimplifyMode::Spline,
        };
    }
    
    // Set filter speckle (noise reduction)
    if let Some(noise_reduction) = settings.noise_reduction {
        // Map 0-10 scale to vtracer's expected values
        config.filter_speckle = noise_reduction as usize * 2;
    }
    
    config
}

// Convert image using vtracer
fn convert_with_vtracer(img: &DynamicImage, config: &Config) -> Result<String, String> {
    let (width, height) = img.dimensions();
    let rgba_img = img.to_rgba8();
    
    // Create converter with config
    let mut converter = match ConverterConfig::new(config.clone(), width as usize, height as usize) {
        Ok(converter) => converter,
        Err(e) => return Err(format!("Failed to create converter: {}", e)),
    };
    
    // Process image
    for y in 0..height {
        for x in 0..width {
            let pixel = rgba_img.get_pixel(x, y);
            converter.set_pixel(x as usize, y as usize, pixel[0], pixel[1], pixel[2], pixel[3]);
        }
    }
    
    // Convert to SVG
    match converter.convert() {
        Ok(svg) => Ok(svg),
        Err(e) => Err(format!("Conversion error: {}", e)),
    }
}

// Image processing utilities
fn adjust_brightness(img: &DynamicImage, factor: f32) -> DynamicImage {
    let (width, height) = img.dimensions();
    let mut output = ImageBuffer::new(width, height);
    
    for y in 0..height {
        for x in 0..width {
            let pixel = img.get_pixel(x, y);
            let adjusted = Rgba([
                ((pixel[0] as f32) + 255.0 * factor).clamp(0.0, 255.0) as u8,
                ((pixel[1] as f32) + 255.0 * factor).clamp(0.0, 255.0) as u8,
                ((pixel[2] as f32) + 255.0 * factor).clamp(0.0, 255.0) as u8,
                pixel[3],
            ]);
            output.put_pixel(x, y, adjusted);
        }
    }
    
    DynamicImage::ImageRgba8(output)
}

fn adjust_contrast(img: &DynamicImage, factor: f32) -> DynamicImage {
    let (width, height) = img.dimensions();
    let mut output = ImageBuffer::new(width, height);
    let factor = 1.0 + factor;
    
    for y in 0..height {
        for x in 0..width {
            let pixel = img.get_pixel(x, y);
            let adjusted = Rgba([
                (((pixel[0] as f32 - 128.0) * factor) + 128.0).clamp(0.0, 255.0) as u8,
                (((pixel[1] as f32 - 128.0) * factor) + 128.0).clamp(0.0, 255.0) as u8,
                (((pixel[2] as f32 - 128.0) * factor) + 128.0).clamp(0.0, 255.0) as u8,
                pixel[3],
            ]);
            output.put_pixel(x, y, adjusted);
        }
    }
    
    DynamicImage::ImageRgba8(output)
}

fn adjust_gamma(img: &DynamicImage, gamma: f32) -> DynamicImage {
    let (width, height) = img.dimensions();
    let mut output = ImageBuffer::new(width, height);
    let gamma_inv = 1.0 / gamma;
    
    for y in 0..height {
        for x in 0..width {
            let pixel = img.get_pixel(x, y);
            let adjusted = Rgba([
                ((pixel[0] as f32 / 255.0).powf(gamma_inv) * 255.0).clamp(0.0, 255.0) as u8,
                ((pixel[1] as f32 / 255.0).powf(gamma_inv) * 255.0).clamp(0.0, 255.0) as u8,
                ((pixel[2] as f32 / 255.0).powf(gamma_inv) * 255.0).clamp(0.0, 255.0) as u8,
                pixel[3],
            ]);
            output.put_pixel(x, y, adjusted);
        }
    }
    
    DynamicImage::ImageRgba8(output)
}

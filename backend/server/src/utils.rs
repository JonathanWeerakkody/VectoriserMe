// src/utils.rs
use crate::models::FileMetadata;
use chrono::{DateTime, Duration, Utc};
use log::{error, info};
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::sync::{Arc, Mutex};
use tokio::time;
use uuid::Uuid;

// Global storage for file metadata
lazy_static::lazy_static! {
    static ref FILE_STORE: Arc<Mutex<HashMap<String, FileMetadata>>> = Arc::new(Mutex::new(HashMap::new()));
}

// Directories
pub const UPLOAD_DIR: &str = "uploads";
pub const OUTPUT_DIR: &str = "output";

// Create necessary directories
pub fn create_directories() -> std::io::Result<()> {
    let upload_path = Path::new(UPLOAD_DIR);
    let output_path = Path::new(OUTPUT_DIR);
    
    if !upload_path.exists() {
        fs::create_dir_all(upload_path)?;
    }
    
    if !output_path.exists() {
        fs::create_dir_all(output_path)?;
    }
    
    Ok(())
}

// Generate a unique file ID
pub fn generate_file_id() -> String {
    Uuid::new_v4().to_string()
}

// Store file metadata
pub fn store_file_metadata(
    file_id: &str,
    original_name: &str,
    input_path: &str,
    output_path: &str,
) {
    let metadata = FileMetadata {
        original_name: original_name.to_string(),
        input_path: input_path.to_string(),
        output_path: output_path.to_string(),
        timestamp: Utc::now(),
    };
    
    let mut store = FILE_STORE.lock().unwrap();
    store.insert(file_id.to_string(), metadata);
}

// Get file metadata
pub fn get_file_metadata(file_id: &str) -> Option<FileMetadata> {
    let store = FILE_STORE.lock().unwrap();
    store.get(file_id).cloned()
}

// Start cleanup task
pub fn start_cleanup_task() {
    let file_store = FILE_STORE.clone();
    
    tokio::spawn(async move {
        let mut interval = time::interval(time::Duration::from_secs(3600)); // Run every hour
        
        loop {
            interval.tick().await;
            info!("Running scheduled cleanup...");
            
            let now = Utc::now();
            let one_hour = Duration::hours(1);
            let mut to_remove = Vec::new();
            
            // Find files older than one hour
            {
                let store = file_store.lock().unwrap();
                for (file_id, metadata) in store.iter() {
                    if now - metadata.timestamp > one_hour {
                        to_remove.push(file_id.clone());
                    }
                }
            }
            
            // Remove files
            let mut store = file_store.lock().unwrap();
            for file_id in to_remove {
                if let Some(metadata) = store.get(&file_id) {
                    // Delete input file
                    if Path::new(&metadata.input_path).exists() {
                        if let Err(e) = fs::remove_file(&metadata.input_path) {
                            error!("Failed to delete input file {}: {}", metadata.input_path, e);
                        }
                    }
                    
                    // Delete output file
                    if Path::new(&metadata.output_path).exists() {
                        if let Err(e) = fs::remove_file(&metadata.output_path) {
                            error!("Failed to delete output file {}: {}", metadata.output_path, e);
                        }
                    }
                    
                    // Remove from store
                    store.remove(&file_id);
                    info!("Cleaned up files for {}", file_id);
                }
            }
        }
    });
}

// src/models.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ConversionSettings {
    // Output mode: "bw" or "color"
    pub output_mode: String,
    
    // B/W mode settings
    pub threshold: Option<u8>,
    
    // Color mode settings
    pub color_count: Option<u8>,
    
    // Common settings
    pub smoothing: Option<u8>,
    pub path_simplification: Option<u8>,
    pub noise_reduction: Option<u8>,
    pub background_transparency: Option<bool>,
    
    // Advanced settings
    pub brightness: Option<i8>,
    pub contrast: Option<i8>,
    pub gamma: Option<f32>,
    pub corner_threshold: Option<u8>,
    pub curve_mode: Option<String>,
}

impl Default for ConversionSettings {
    fn default() -> Self {
        Self {
            output_mode: "bw".to_string(),
            threshold: Some(128),
            color_count: Some(8),
            smoothing: Some(5),
            path_simplification: Some(5),
            noise_reduction: Some(4),
            background_transparency: Some(false),
            brightness: Some(0),
            contrast: Some(0),
            gamma: Some(1.0),
            corner_threshold: Some(60),
            curve_mode: Some("spline".to_string()),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ConversionResponse {
    pub file_id: String,
    pub svg_data: String,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: String,
    pub details: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HealthResponse {
    pub status: String,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BatchDownloadRequest {
    pub file_ids: Vec<String>,
}

#[derive(Debug)]
pub struct FileMetadata {
    pub original_name: String,
    pub input_path: String,
    pub output_path: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

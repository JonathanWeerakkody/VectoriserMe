// src/main.rs
use actix_cors::Cors;
use actix_web::{middleware, App, HttpServer};
use dotenv::dotenv;
use log::info;
use std::env;

mod handlers;
mod models;
mod utils;
mod vectorizer;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load environment variables from .env file if present
    dotenv().ok();
    
    // Initialize logger
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
    // Get port from environment or use default
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let address = format!("0.0.0.0:{}", port);
    
    // Get frontend URL for CORS
    let frontend_url = env::var("FRONTEND_URL").unwrap_or_else(|_| "*".to_string());
    
    // Create upload and output directories
    utils::create_directories().expect("Failed to create directories");
    
    // Start cleanup task
    utils::start_cleanup_task();
    
    info!("Starting server at: {}", address);
    
    // Start HTTP server
    HttpServer::new(move || {
        // Configure CORS
        let cors = Cors::default()
            .allowed_origin(&frontend_url)
            .allowed_methods(vec!["GET", "POST", "OPTIONS"])
            .allowed_headers(vec!["Content-Type", "Authorization"])
            .max_age(3600);
        
        App::new()
            .wrap(middleware::Logger::default())
            .wrap(cors)
            .service(handlers::health_check)
            .service(handlers::convert_image)
            .service(handlers::download_svg)
            .service(handlers::download_batch)
    })
    .bind(address)?
    .run()
    .await
}

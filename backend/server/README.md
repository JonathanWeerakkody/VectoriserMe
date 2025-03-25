# Vectorise.Me Backend Server

This is the Rust backend server for Vectorise.Me, implementing the image vectorization functionality using the vtracer library.

## Structure

```
server/
├── src/
│   ├── main.rs       # Server entry point
│   ├── handlers.rs   # Request handlers
│   ├── models.rs     # Data models
│   ├── vectorizer.rs # Image vectorization logic
│   └── utils.rs      # Utility functions
├── Cargo.toml        # Rust dependencies
└── .env              # Environment variables
```

## API Endpoints

- `POST /api/convert`: Convert an image to SVG
- `GET /api/health`: Health check endpoint

## Dependencies

- actix-web: Web framework
- actix-multipart: Multipart form handling
- vtracer: Image vectorization library
- image: Image processing
- serde: Serialization/deserialization
- tokio: Async runtime
- env_logger: Logging
- dotenv: Environment variables

# Vectorise.Me Backend Server

This is the backend server for Vectorise.Me, a web application that converts images to vector graphics.

## Features

- Image to SVG conversion
- Multiple vectorization modes (B/W, Color)
- Advanced settings for fine-tuning conversion
- Temporary file storage with automatic cleanup

## Development

### Prerequisites

- Rust 1.85.1 or later
- Cargo 1.85.1 or later
- build-essential package

### Setup

1. Install Rust and Cargo:
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
```

2. Install build dependencies:
```
apt-get update && apt-get install -y build-essential pkg-config libssl-dev
```

3. Build the project:
```
cargo build --release
```

4. Run the server:
```
cargo run --release
```

## Deployment on Render.com

This backend is designed to be deployed on Render.com using the Web Service option.

### Render.com Configuration

- **Build Command**: 
```
apt-get update && apt-get install -y build-essential pkg-config libssl-dev && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && source "$HOME/.cargo/env" && cargo build --release
```

- **Start Command**: 
```
source "$HOME/.cargo/env" && cargo run --release
```

- **Environment Variables**:
  - `RUST_LOG`: info
  - `PORT`: 8080
  - `FRONTEND_URL`: [Your Vercel frontend URL]

## API Endpoints

- `POST /api/convert`: Convert an image to SVG
  - Request: multipart/form-data with image file and settings
  - Response: SVG data

- `GET /api/health`: Health check endpoint
  - Response: Status message

## File Storage

Uploaded files are stored temporarily and automatically deleted after one hour.

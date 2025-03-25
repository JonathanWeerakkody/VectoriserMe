# Dockerfile for Vectorise.Me Backend

FROM rust:1.85-slim-bullseye

WORKDIR /app

# Install dependencies
RUN apt-get update && \
    apt-get install -y build-essential pkg-config libssl-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the source code
COPY . .

# Fix workspace configuration issues
RUN if ! grep -q "server" Cargo.toml; then \
        sed -i '/members = \[/a \ \ \ \ "server",' Cargo.toml; \
    fi && \
    if grep -q './cmdapp' server/Cargo.toml; then \
        sed -i 's|path = "./cmdapp"|path = "../cmdapp"|g' server/Cargo.toml; \
    fi

# Build the application
RUN cd server && cargo build --release

# Set environment variables
ENV RUST_LOG=info
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Run the application
CMD ["sh", "-c", "cd server && cargo run --release"]

#!/bin/bash

# Start Docker Compose
echo "Starting Docker Compose..."
docker compose up --build -d
# Wait for LocalStack to be ready
echo "Waiting for LocalStack to initialize..."
sleep 10  # Ensure LocalStack is fully started

# Create S3 bucket
echo "Creating S3 bucket: prospects-files..."
aws --endpoint-url=http://localhost:4566 s3 mb s3://prospects-files

echo "✅ LocalStack is running with S3 bucket: prospects-files"

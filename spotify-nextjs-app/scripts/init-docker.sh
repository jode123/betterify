#!/bin/bash
set -e

echo "Creating Docker build context..."
mkdir -p docker/piped-proxy docker/piped-backend

# Install required npm packages
echo "Installing required packages..."
npm install express cors http-proxy-middleware

echo "Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "Starting services..."
docker-compose -f docker-compose.prod.yml up -d

echo "Waiting for services to start..."
sleep 15

echo "Checking service status..."
docker-compose -f docker-compose.prod.yml ps

echo "Checking logs..."
docker-compose -f docker-compose.prod.yml logs --tail 100

# Check if services are healthy
if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "Error: Services failed to start properly"
    exit 1
fi

echo "Services started successfully!"
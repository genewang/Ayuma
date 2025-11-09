#!/bin/bash
set -e

# Create necessary directories
mkdir -p data/chroma

# Set environment variables
export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1

# Stop and remove any existing containers
docker-compose down --remove-orphans

# Build and start the services
docker-compose up --build -d

echo ""
echo "========================================"
echo "Ayuma services are starting up..."
echo ""
echo "Frontend:    http://localhost"
echo "Backend API: http://localhost:8000"
echo "ChromaDB:    http://localhost:8001"
echo ""
echo "To view logs, run: docker-compose logs -f"
echo "To stop the services, run: docker-compose down"
echo "========================================"
echo ""

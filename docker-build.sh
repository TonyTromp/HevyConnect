#!/bin/bash
# Build script with BuildKit enabled and progress output

set -e

echo "🚀 Building with BuildKit enabled..."
echo ""

# Enable BuildKit
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build with progress output
if command -v docker-compose &> /dev/null; then
    echo "Using docker-compose..."
    docker-compose build --progress=plain
else
    echo "Using docker compose..."
    docker compose build --progress=plain
fi

echo ""
echo "✅ Build complete!"


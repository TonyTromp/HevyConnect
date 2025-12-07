#!/bin/bash
# Build script that clears cache and rebuilds fresh

set -e

echo "🧹 Clearing Docker build cache..."
docker builder prune -f

echo ""
echo "🚀 Building with BuildKit enabled (no cache)..."
echo ""

# Enable BuildKit
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build without cache
if command -v docker-compose &> /dev/null; then
    echo "Using docker-compose..."
    docker-compose build --no-cache --progress=plain
else
    echo "Using docker compose..."
    docker compose build --no-cache --progress=plain
fi

echo ""
echo "✅ Fresh build complete!"


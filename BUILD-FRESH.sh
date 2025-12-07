#!/bin/bash
# Script to build Docker image with completely fresh dependencies

set -e

echo "🧹 Cleaning Docker build cache..."
docker builder prune -f

echo "🔨 Building with --no-cache to ensure fresh installs..."
DOCKER_BUILDKIT=1 docker-compose build --no-cache --progress=plain

echo "✅ Build complete!"


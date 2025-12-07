#!/bin/bash
# Check Docker setup for optimal build performance

echo "🔍 Checking Docker setup..."
echo ""

# Check BuildKit
if [ "$DOCKER_BUILDKIT" = "1" ]; then
    echo "✅ BuildKit is enabled"
else
    echo "⚠️  BuildKit is NOT enabled"
    echo "   Run: export DOCKER_BUILDKIT=1"
fi

# Check Docker version
echo ""
echo "Docker version:"
docker --version

# Check Docker Compose version
if command -v docker-compose &> /dev/null; then
    echo "Docker Compose version:"
    docker-compose --version
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    echo "Docker Compose (plugin) version:"
    docker compose version
fi

# Check if Docker is running
echo ""
if docker info &> /dev/null; then
    echo "✅ Docker is running"
    
    # Check resources (if on Docker Desktop)
    echo ""
    echo "Docker system info:"
    docker info 2>/dev/null | grep -E "(CPUs|Total Memory|Operating System)" | head -5
else
    echo "❌ Docker is not running"
    exit 1
fi

echo ""
echo "💡 Tips:"
echo "   - Ensure Docker has at least 4GB RAM allocated"
echo "   - Enable BuildKit: export DOCKER_BUILDKIT=1"
echo "   - Use ./docker-build.sh for builds with BuildKit enabled"
echo ""


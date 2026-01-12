#!/bin/bash
# Enterprise AI Demo - Docker Compose Startup Script

set -e

echo "🚀 Starting Enterprise AI Demo with Docker Compose..."
echo ""
echo "This will build and start both Backend and Frontend services."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed."
    echo "Please install Docker from https://www.docker.com/get-started"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose is not available."
    echo "Please install Docker Compose v2+"
    exit 1
fi

# Check if .env exists, if not suggest creating one
if [ ! -f .env ]; then
    echo "ℹ️  No .env file found. Using default configuration (mock services)."
    echo "   To use real Azure OpenAI, copy .env.template to .env and configure it."
    echo ""
fi

# Start services
echo "🔨 Building and starting services..."
docker compose up --build -d

echo ""
echo "✅ Services started successfully!"
echo ""
echo "📍 Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5222"
echo "   Swagger:  http://localhost:5222/swagger"
echo ""
echo "📊 View logs:"
echo "   docker compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker compose down"
echo ""

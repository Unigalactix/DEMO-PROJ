.PHONY: help build-backend build-frontend build start stop restart logs clean dev prod test

# Default target
help:
	@echo "Enterprise AI Demo - Make Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start in development mode (docker-compose)"
	@echo "  make start        - Start services (alias for dev)"
	@echo "  make stop         - Stop all services"
	@echo "  make restart      - Restart all services"
	@echo "  make logs         - View logs from all services"
	@echo ""
	@echo "Production:"
	@echo "  make prod         - Start in production mode"
	@echo "  make prod-stop    - Stop production services"
	@echo ""
	@echo "Building:"
	@echo "  make build        - Build all Docker images"
	@echo "  make build-backend - Build backend image only"
	@echo "  make build-frontend - Build frontend image only"
	@echo ""
	@echo "Testing:"
	@echo "  make test         - Run all tests"
	@echo "  make test-backend - Run backend tests"
	@echo "  make test-frontend - Run frontend tests"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean        - Remove containers, networks, and volumes"
	@echo "  make clean-all    - Remove everything including images"
	@echo ""

# Development commands
dev:
	@echo "Starting in development mode..."
	docker compose up --build -d
	@echo ""
	@echo "Services started!"
	@echo "Frontend: http://localhost:5173"
	@echo "Backend:  http://localhost:5222"
	@echo ""

start: dev

stop:
	@echo "Stopping services..."
	docker compose down

restart: stop start

logs:
	docker compose logs -f

# Production commands
prod:
	@echo "Starting in production mode..."
	docker compose -f docker-compose.prod.yml up --build -d
	@echo ""
	@echo "Production services started!"
	@echo "Frontend: http://localhost"
	@echo "Backend:  http://localhost:8080"
	@echo ""

prod-stop:
	@echo "Stopping production services..."
	docker compose -f docker-compose.prod.yml down

# Build commands
build:
	@echo "Building all images..."
	docker compose build

build-backend:
	@echo "Building backend image..."
	docker build -t enterpriseai-backend:latest ./Backend

build-frontend:
	@echo "Building frontend image..."
	docker build -t enterpriseai-frontend:latest .

# Test commands
test: test-backend test-frontend

test-backend:
	@echo "Running backend tests..."
	cd Backend && dotnet test

test-frontend:
	@echo "Running frontend tests..."
	cd Frontend && npm test

# Cleanup commands
clean:
	@echo "Cleaning up containers and networks..."
	docker compose down -v

clean-all:
	@echo "Removing all containers, networks, and images..."
	docker compose down -v --rmi all

# Health check
health:
	@echo "Checking service health..."
	@echo "Backend:"
	@curl -s http://localhost:5222/health | jq . || echo "Backend not responding"
	@echo ""
	@echo "Frontend:"
	@curl -s http://localhost:5173/health || echo "Frontend not responding"
	@echo ""

# Show status
status:
	@echo "Service Status:"
	@docker compose ps

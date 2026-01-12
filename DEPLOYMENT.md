# Deployment Guide

This guide provides detailed instructions for deploying the Enterprise AI Full Stack Demo application in various environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development with Docker](#local-development-with-docker)
3. [Production Deployment](#production-deployment)
4. [Cloud Deployment Options](#cloud-deployment-options)
5. [Environment Configuration](#environment-configuration)
6. [Health Checks](#health-checks)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools
- **Docker** (v20.10+) and **Docker Compose** (v2.0+)
- **Git** for cloning the repository

### Optional (for manual builds)
- **Node.js** (v20+) for frontend development
- **.NET 8 SDK** for backend development

## Local Development with Docker

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Unigalactix/DEMO-PROJ.git
   cd DEMO-PROJ
   ```

2. **Start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5222
   - Swagger UI: http://localhost:5222/swagger (in development mode)

4. **Stop all services:**
   ```bash
   docker-compose down
   ```

### Development Mode

The default `docker-compose.yml` is configured for development:
- Uses mock AI services (no Azure OpenAI required)
- Hot-reload enabled where possible
- Debug ports exposed
- Development CORS policies

### Building Individual Services

**Backend only:**
```bash
cd Backend
docker build -t enterpriseai-backend:latest .
docker run -p 5222:8080 enterpriseai-backend:latest
```

**Frontend only:**
```bash
docker build -t enterpriseai-frontend:latest .
docker run -p 5173:8080 enterpriseai-frontend:latest
```

## Production Deployment

### Using docker-compose.prod.yml

1. **Create a `.env` file in the project root:**
   ```bash
   # Azure OpenAI Configuration
   AZURE_OPENAI_KEY=your-azure-openai-key
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
   AZURE_OPENAI_DEPLOYMENT=your-deployment-name
   
   # Database Configuration (optional)
   CONNECTION_STRING=Server=your-server;Database=your-db;...
   
   # API Base URL for frontend
   API_BASE_URL=https://api.yourdomain.com
   ```

2. **Deploy with production configuration:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

3. **Access the application:**
   - Frontend: http://localhost (port 80)
   - Backend API: http://localhost:8080

4. **View logs:**
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f
   ```

5. **Stop services:**
   ```bash
   docker-compose -f docker-compose.prod.yml down
   ```

### Production Considerations

- **Resource Limits:** The production compose file includes CPU and memory limits
- **Restart Policy:** Services are set to `restart: always`
- **Health Checks:** Both services have health checks configured
- **Security:** Services run as non-root users
- **Performance:** Optimized build stages with multi-stage Dockerfiles

## Cloud Deployment Options

### Azure Container Instances (ACI)

1. **Build and push images to Azure Container Registry:**
   ```bash
   # Login to ACR
   az acr login --name yourregistry
   
   # Build and push backend
   docker build -t yourregistry.azurecr.io/enterpriseai-backend:latest ./Backend
   docker push yourregistry.azurecr.io/enterpriseai-backend:latest
   
   # Build and push frontend
   docker build -t yourregistry.azurecr.io/enterpriseai-frontend:latest .
   docker push yourregistry.azurecr.io/enterpriseai-frontend:latest
   ```

2. **Deploy using Azure CLI:**
   ```bash
   az container create \
     --resource-group your-rg \
     --name enterpriseai-backend \
     --image yourregistry.azurecr.io/enterpriseai-backend:latest \
     --ports 8080 \
     --environment-variables \
       ASPNETCORE_ENVIRONMENT=Production \
       AzureOpenAI__Key=your-key \
       AzureOpenAI__Endpoint=your-endpoint
   ```

### Azure Web App (App Service)

The existing CI/CD pipeline (`ci.yml`) includes deployment to Azure Web App:
- Builds Docker images
- Pushes to Azure Container Registry
- Deploys to Azure Web App

Configure these GitHub secrets:
- `ACR_LOGIN_SERVER`
- `ACR_USERNAME`
- `ACR_PASSWORD`
- `AZURE_WEBAPP_APP_NAME`
- `AZURE_WEBAPP_PUBLISH_PROFILE`
- `AZURE_WEBAPP_SLOT_NAME`

### Kubernetes (AKS)

For Kubernetes deployment, you can use the Docker images with Kubernetes manifests:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: enterpriseai-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: enterpriseai-backend
  template:
    metadata:
      labels:
        app: enterpriseai-backend
    spec:
      containers:
      - name: backend
        image: yourregistry.azurecr.io/enterpriseai-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: ASPNETCORE_ENVIRONMENT
          value: "Production"
        - name: AzureOpenAI__Key
          valueFrom:
            secretKeyRef:
              name: azure-openai-secret
              key: api-key
```

### AWS ECS/Fargate

1. **Push images to Amazon ECR**
2. **Create ECS task definitions** using the Docker images
3. **Configure ECS services** with load balancing
4. **Set environment variables** in task definitions

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `ASPNETCORE_ENVIRONMENT` | Environment mode | No | Development |
| `ASPNETCORE_URLS` | Binding URLs | No | http://+:8080 |
| `AzureOpenAI__Key` | Azure OpenAI API key | No* | Uses mock |
| `AzureOpenAI__Endpoint` | Azure OpenAI endpoint | No* | Uses mock |
| `AzureOpenAI__DeploymentName` | Model deployment name | No* | Uses mock |
| `ConnectionStrings__Default` | Database connection | No | None |

*Required for production with real Azure OpenAI

### Frontend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL | Yes | http://localhost:5222 |
| `VITE_ENABLE_STREAMING` | Enable SSE streaming | No | true |

### Setting Environment Variables

**Development (docker-compose):**
- Edit `docker-compose.yml` environment section
- Or create a `.env` file in project root

**Production:**
- Use `.env` file with `docker-compose.prod.yml`
- Set environment variables in your cloud provider
- Use secrets management (Azure Key Vault, AWS Secrets Manager, etc.)

## Health Checks

Both services expose health check endpoints:

### Backend Health Check
```bash
curl http://localhost:5222/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-12T20:00:00.000Z"
}
```

### Frontend Health Check
```bash
curl http://localhost:5173/health
```

Response:
```
healthy
```

### Docker Health Checks

Health checks are configured in Docker:
- **Interval:** 30 seconds
- **Timeout:** 3 seconds
- **Retries:** 3
- **Start Period:** 5-10 seconds

View health status:
```bash
docker-compose ps
```

## Troubleshooting

### Common Issues

#### 1. Services won't start

**Check logs:**
```bash
docker-compose logs backend
docker-compose logs frontend
```

**Verify ports are available:**
```bash
# Check if ports are in use
lsof -i :5222  # Backend
lsof -i :5173  # Frontend
```

#### 2. Frontend can't connect to backend

**Verify network connectivity:**
```bash
docker network ls
docker network inspect demo-proj_enterpriseai-network
```

**Check CORS configuration:**
- Ensure backend CORS allows frontend origin
- Check browser console for CORS errors

**Update API URL:**
- Verify `VITE_API_BASE_URL` in frontend environment
- For Docker: use service name `http://backend:8080`

#### 3. Build failures

**Clear Docker cache:**
```bash
docker-compose build --no-cache
docker system prune -a
```

**Check Docker disk space:**
```bash
docker system df
```

#### 4. Container unhealthy status

**Check health endpoint manually:**
```bash
docker exec enterpriseai-backend curl http://localhost:8080/health
```

**Review health check configuration:**
- Increase timeout or interval
- Check if application takes longer to start

### Getting Help

For issues specific to this project:
1. Check existing [GitHub Issues](https://github.com/Unigalactix/DEMO-PROJ/issues)
2. Review application logs: `docker-compose logs`
3. Open a new issue with:
   - Error messages
   - Docker version
   - Steps to reproduce

## Security Best Practices

1. **Never commit secrets** - Use environment variables or secrets management
2. **Update base images regularly** - Check for security updates
3. **Run as non-root user** - Both containers use unprivileged users
4. **Use HTTPS in production** - Configure SSL/TLS termination
5. **Implement rate limiting** - Protect API endpoints
6. **Regular security scans** - Use `docker scan` or similar tools

## Performance Optimization

1. **Multi-stage builds** - Reduces final image size
2. **Layer caching** - Optimizes build times
3. **Resource limits** - Prevents resource exhaustion
4. **Compression** - Frontend served with gzip
5. **Static asset caching** - Long-lived cache headers

## Monitoring and Logging

Consider adding:
- **Application Insights** (Azure)
- **CloudWatch** (AWS)
- **Prometheus + Grafana** (Self-hosted)
- **ELK Stack** (Elasticsearch, Logstash, Kibana)

Export logs:
```bash
docker-compose logs > application.log
```

## Backup and Recovery

**Backup considerations:**
- Database backups (if using external DB)
- Configuration files
- SSL certificates
- Environment variables

**Disaster recovery:**
- Keep deployment scripts in version control
- Document manual deployment steps
- Test recovery procedures regularly

## Updates and Maintenance

**Update application:**
```bash
git pull
docker-compose down
docker-compose up --build -d
```

**Update base images:**
```bash
docker-compose pull
docker-compose up -d
```

**Clean up old images:**
```bash
docker image prune -a
```

## License

MIT - See LICENSE file for details

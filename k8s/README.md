# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying the Enterprise AI application to a Kubernetes cluster.

## Prerequisites

- A Kubernetes cluster (AKS, EKS, GKE, or local cluster like Minikube)
- `kubectl` CLI installed and configured
- Docker images built and pushed to a container registry
- (Optional) NGINX Ingress Controller for ingress support
- (Optional) cert-manager for automatic TLS certificates

## Quick Start

1. **Build and push Docker images:**

   ```bash
   # Build backend
   docker build -t yourregistry.azurecr.io/enterpriseai-backend:latest ./Backend
   docker push yourregistry.azurecr.io/enterpriseai-backend:latest
   
   # Build frontend
   docker build -t yourregistry.azurecr.io/enterpriseai-frontend:latest .
   docker push yourregistry.azurecr.io/enterpriseai-frontend:latest
   ```

2. **Update the deployment manifest:**

   Edit `deployment.yaml` and replace:
   - `yourregistry.azurecr.io` with your actual container registry
   - `your-azure-openai-key` with your Azure OpenAI API key
   - `https://your-resource.openai.azure.com/` with your endpoint
   - `your-deployment-name` with your model deployment name
   - `enterpriseai.yourdomain.com` with your actual domain

3. **Deploy to Kubernetes:**

   ```bash
   kubectl apply -f deployment.yaml
   ```

4. **Verify deployment:**

   ```bash
   # Check pods
   kubectl get pods -n enterpriseai
   
   # Check services
   kubectl get svc -n enterpriseai
   
   # Check ingress
   kubectl get ingress -n enterpriseai
   ```

5. **Access the application:**

   If using LoadBalancer:
   ```bash
   kubectl get svc frontend -n enterpriseai
   # Access via the EXTERNAL-IP
   ```

   If using Ingress:
   - Access via your configured domain (e.g., https://enterpriseai.yourdomain.com)

## Configuration

### Secrets Management

For production, use external secrets management:

**Azure Key Vault:**
```bash
# Install Azure Key Vault provider
kubectl apply -f https://raw.githubusercontent.com/Azure/secrets-store-csi-driver-provider-azure/master/deployment/provider-azure-installer.yaml

# Create SecretProviderClass
kubectl apply -f secret-provider.yaml
```

**AWS Secrets Manager:**
```bash
# Install External Secrets Operator
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets -n external-secrets --create-namespace
```

### Environment Variables

Backend environment variables are configured in:
- `ConfigMap`: Non-sensitive configuration
- `Secret`: Sensitive data (API keys, connection strings)

Update these as needed for your environment.

## Scaling

Scale the deployments:

```bash
# Scale backend
kubectl scale deployment backend -n enterpriseai --replicas=5

# Scale frontend
kubectl scale deployment frontend -n enterpriseai --replicas=3
```

Enable Horizontal Pod Autoscaling:

```bash
kubectl autoscale deployment backend -n enterpriseai --cpu-percent=70 --min=2 --max=10
kubectl autoscale deployment frontend -n enterpriseai --cpu-percent=70 --min=2 --max=10
```

## Monitoring

View logs:

```bash
# Backend logs
kubectl logs -f deployment/backend -n enterpriseai

# Frontend logs
kubectl logs -f deployment/frontend -n enterpriseai

# All logs
kubectl logs -f -l app=backend -n enterpriseai
kubectl logs -f -l app=frontend -n enterpriseai
```

## Troubleshooting

### Pods not starting

```bash
# Describe pod to see events
kubectl describe pod <pod-name> -n enterpriseai

# Check events
kubectl get events -n enterpriseai --sort-by='.lastTimestamp'
```

### Image pull errors

Ensure you have image pull secrets configured:

```bash
kubectl create secret docker-registry acr-secret \
  --namespace enterpriseai \
  --docker-server=yourregistry.azurecr.io \
  --docker-username=<username> \
  --docker-password=<password>
```

Then add to the deployment:
```yaml
spec:
  imagePullSecrets:
  - name: acr-secret
```

### Health check failures

```bash
# Check if health endpoint is accessible
kubectl port-forward deployment/backend 8080:8080 -n enterpriseai
curl http://localhost:8080/health
```

## Cleanup

Remove all resources:

```bash
kubectl delete namespace enterpriseai
```

Or remove individual components:

```bash
kubectl delete -f deployment.yaml
```

## Production Recommendations

1. **Use a managed Kubernetes service** (AKS, EKS, GKE)
2. **Implement proper secrets management** (Azure Key Vault, AWS Secrets Manager)
3. **Set up monitoring** (Prometheus, Grafana, Azure Monitor)
4. **Configure logging** (ELK Stack, Azure Log Analytics)
5. **Implement network policies** for pod-to-pod communication
6. **Use PodDisruptionBudgets** to ensure availability during updates
7. **Configure resource quotas** to prevent resource exhaustion
8. **Set up backup and disaster recovery** procedures
9. **Implement CI/CD pipelines** for automated deployments
10. **Regular security scanning** of container images

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/)
- [Amazon EKS](https://aws.amazon.com/eks/)
- [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine)

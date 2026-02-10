# Docker Documentation

This guide covers Docker deployment strategies for Festival Player, including production builds, development workflows, and cloud deployment options.

## Table of Contents

- [Overview](#overview)
- [Production Deployment](#production-deployment)
- [Development with Docker](#development-with-docker)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Cloud Deployment Examples](#cloud-deployment-examples)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

## Overview

Festival Player supports two distinct Docker approaches optimized for different use cases:

### Production Approach

Multi-stage Docker build that produces a minimal production image:

- **Size optimized**: Uses alpine base images and multi-stage builds
- **Security hardened**: Runs as non-root user, minimal dependencies
- **Self-contained**: Includes compiled server and built client assets
- **Production ready**: Built-in health checks and graceful shutdown

**Use for**: Production deployments, cloud platforms (Cloud Run, ECS), Kubernetes clusters

### Development Approach

Docker Compose setup that enables hot-reload development:

- **Server in Docker**: TypeScript compilation and Node.js server with auto-restart on file changes
- **Client local**: Vite development server runs on host for fast HMR (Hot Module Replacement)
- **Volume mounts**: Source code mounted into container for instant updates
- **Isolated dependencies**: Node modules in named Docker volume

**Use for**: Local development, debugging server in containerized environment, testing Docker compatibility

## Production Deployment

### Multi-Stage Build Architecture

The Dockerfile uses a three-stage build process to optimize the final image:

```dockerfile
# Stage 1: deps - Install all dependencies (dev + prod)
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
COPY client/package.json client/yarn.lock ./client/
RUN yarn install --frozen-lockfile

# Stage 2: build - Compile TypeScript and build React app
FROM node:18-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules
COPY . .
RUN yarn tsc && cd client && yarn build

# Stage 3: production - Minimal runtime image
FROM node:18-alpine AS production
RUN apk add --no-cache curl
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/client/build ./client/build
USER nodejs
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

**Benefits of this approach:**
- **Layer caching**: Dependencies installed separately, rarely invalidated
- **Smaller image**: Final stage only includes production dependencies
- **Build artifacts isolated**: Compiled code copied from build stage
- **No dev tooling**: TypeScript, build tools excluded from production

### Building the Production Image

Build using the convenience script:

```bash
./script/build --docker
```

**Advanced options:**

```bash
# Build with custom tag
./script/build --docker --tag v1.0.0

# Build with custom image name
./script/build --docker --image myapp --tag v1.0.0

# Show all build options
./script/build --help
```

**Manual build command:**

```bash
docker build -t festival-player:latest .
```

### Running the Production Container

**Prerequisites:**
1. Create environment file (`.env.docker` or `.env`):
   ```env
   SPOTIFY_ID=your_client_id
   SPOTIFY_SECRET=your_client_secret
   REDIRECT_URI=http://localhost:5000/callback
   PORT=5000
   ```

2. Obtain Spotify API credentials from https://developer.spotify.com/dashboard

**Run the container:**

```bash
docker run -p 5000:5000 --env-file .env.docker festival-player:latest
```

**With custom port:**

```bash
docker run -p 8080:8080 --env-file .env.docker -e PORT=8080 festival-player:latest
```

**With environment variables inline:**

```bash
docker run -p 5000:5000 \
  -e SPOTIFY_ID=your_id \
  -e SPOTIFY_SECRET=your_secret \
  -e REDIRECT_URI=http://localhost:5000/callback \
  festival-player:latest
```

**Access the application:**
- Open browser to http://localhost:5000

### Health Check Details

The production image includes a built-in health check:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1
```

**Health check parameters:**
- **interval**: Check every 30 seconds
- **timeout**: Fail check if it takes longer than 3 seconds
- **start-period**: Grace period of 5 seconds after container starts
- **retries**: Mark unhealthy after 3 consecutive failures

**Check health status:**

```bash
docker ps
docker inspect festival-player | jq '.[0].State.Health'
```

**API endpoint:**

```bash
curl http://localhost:5000/api/health
```

Expected response: `{"status": "ok"}`

### Image Size and Optimization

**Typical image sizes:**
- **Final production image**: ~180-200 MB
- **Build stage (not shipped)**: ~500-600 MB
- **Alpine base image**: ~40 MB

**Optimization techniques used:**
1. **Alpine Linux**: Minimal base image instead of full Debian
2. **Multi-stage build**: Build tools not included in final image
3. **Production dependencies only**: Dev dependencies excluded with `--production` flag
4. **Layer caching**: Package files copied before source to maximize cache hits
5. **Frozen lockfile**: Consistent dependency resolution with `--frozen-lockfile`
6. **Non-root user**: Security best practice, minimal privilege

**Further optimization ideas:**
- Use `.dockerignore` to exclude unnecessary files
- Consider `node:18-alpine` slim variants
- Enable BuildKit for parallel layer processing
- Use Docker layer caching in CI/CD pipelines

## Development with Docker

### Setup Steps

1. **Run bootstrap to install dependencies:**
   ```bash
   ./script/bootstrap
   ```

2. **Create Docker environment file:**
   ```bash
   cp script/.env.example .env.docker
   ```

3. **Edit `.env.docker` with your Spotify credentials:**
   ```env
   SPOTIFY_ID=your_spotify_client_id
   SPOTIFY_SECRET=your_spotify_client_secret
   REDIRECT_URI=http://localhost:5000/callback
   PORT=5000
   ```

### Starting Development Environment

**Start server in Docker:**

```bash
./script/start --docker
```

This command:
- Builds the Docker image from the `build` stage
- Starts the server container with source code mounted
- Enables auto-reload on TypeScript file changes
- Exposes server on http://localhost:5000

**Start client locally (in a separate terminal):**

```bash
cd client && yarn start
```

This starts the Vite development server on http://localhost:3000 with:
- Hot Module Replacement (HMR) for instant updates
- React Fast Refresh for component state preservation
- Full TypeScript type checking
- Optimized development build

### Development Workflow

**Typical development session:**

```bash
# Terminal 1: Start server in Docker with hot-reload
./script/start --docker

# Terminal 2: Start client locally with HMR
cd client && yarn start

# Terminal 3: Run tests as needed
./script/test --docker
```

**What happens when you make changes:**

1. **Server changes** (`.ts` files in `server/` or `server.ts`):
   - Nodemon detects file change
   - Recompiles TypeScript with `yarn tsc`
   - Restarts Node.js server
   - Server ready in 2-3 seconds

2. **Client changes** (`.tsx`, `.ts`, `.css` in `client/src/`):
   - Vite detects file change
   - Hot-reloads module in browser
   - State preserved with React Fast Refresh
   - Update visible in < 1 second

### Why This Hybrid Approach?

**Server in Docker:**
- Tests containerized environment
- Isolates Node.js dependencies
- Validates Dockerfile changes
- Matches production runtime

**Client local:**
- Vite HMR is extremely fast on native filesystem
- Docker volume mounts can have performance overhead on macOS/Windows
- Better integration with IDE tools and debuggers
- Faster TypeScript compilation and checking

### Testing in Docker

**Run server tests in Docker container:**

```bash
./script/test --docker
```

**Run all tests (client tests run locally):**

```bash
./script/test
```

**Docker test benefits:**
- Validates tests in containerized environment
- Ensures dependencies are correctly specified
- Tests production-like Node.js runtime
- Catches platform-specific issues

### Docker Compose Configuration

The `docker-compose.yml` file configures the development environment:

```yaml
version: '3.8'

services:
  server:
    build:
      context: .
      target: build  # Uses build stage, not production
    volumes:
      # Mount source for hot reload
      - ./server.ts:/app/server.ts
      - ./server:/app/server
      - ./tsconfig.json:/app/tsconfig.json
      - ./package.json:/app/package.json
      # Named volume prevents node_modules conflicts
      - node_modules:/app/node_modules
    ports:
      - "5000:5000"
    env_file:
      - .env.docker
    environment:
      - NODE_ENV=development
    command: >
      sh -c "yarn global add nodemon &&
             nodemon --watch server --watch server.ts
                     --exec 'yarn tsc && node dist/server.js'"

volumes:
  node_modules:
```

**Key features:**
- **Build stage target**: Includes dev dependencies and build tools
- **Volume mounts**: Source code changes reflected immediately
- **Named volume**: `node_modules` isolated to avoid host/container conflicts
- **Nodemon**: Auto-restarts server on file changes
- **Environment**: Development mode with debug logging

## Kubernetes Deployment

### Deployment Manifest

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: festival-player
  labels:
    app: festival-player
spec:
  replicas: 3
  selector:
    matchLabels:
      app: festival-player
  template:
    metadata:
      labels:
        app: festival-player
    spec:
      containers:
      - name: festival-player
        image: festival-player:v1.0.0
        ports:
        - containerPort: 5000
          name: http
        env:
        - name: PORT
          value: "5000"
        - name: SPOTIFY_ID
          valueFrom:
            secretKeyRef:
              name: spotify-credentials
              key: client-id
        - name: SPOTIFY_SECRET
          valueFrom:
            secretKeyRef:
              name: spotify-credentials
              key: client-secret
        - name: REDIRECT_URI
          valueFrom:
            configMapKeyRef:
              name: festival-player-config
              key: redirect-uri
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 10
          periodSeconds: 30
          timeoutSeconds: 3
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 10
          timeoutSeconds: 3
          failureThreshold: 2
        lifecycle:
          preStop:
            exec:
              command: ["/bin/sh", "-c", "sleep 5"]
---
apiVersion: v1
kind: Service
metadata:
  name: festival-player
spec:
  selector:
    app: festival-player
  ports:
  - port: 80
    targetPort: 5000
    protocol: TCP
    name: http
  type: ClusterIP
```

### ConfigMap for Configuration

Create `k8s/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: festival-player-config
data:
  redirect-uri: "https://your-domain.com/callback"
```

### Secret for Credentials

Create Spotify credentials secret:

```bash
kubectl create secret generic spotify-credentials \
  --from-literal=client-id='your_spotify_client_id' \
  --from-literal=client-secret='your_spotify_client_secret'
```

Or from file:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: spotify-credentials
type: Opaque
stringData:
  client-id: your_spotify_client_id
  client-secret: your_spotify_client_secret
```

### Ingress for External Access

Create `k8s/ingress.yaml`:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: festival-player
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - festival-player.your-domain.com
    secretName: festival-player-tls
  rules:
  - host: festival-player.your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: festival-player
            port:
              number: 80
```

### Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace festival-player

# Apply configurations
kubectl apply -f k8s/configmap.yaml -n festival-player
kubectl apply -f k8s/secret.yaml -n festival-player
kubectl apply -f k8s/deployment.yaml -n festival-player
kubectl apply -f k8s/ingress.yaml -n festival-player

# Check deployment status
kubectl get pods -n festival-player
kubectl get svc -n festival-player
kubectl get ingress -n festival-player

# View logs
kubectl logs -f deployment/festival-player -n festival-player

# Check health
kubectl exec -it deployment/festival-player -n festival-player -- curl http://localhost:5000/api/health
```

### Graceful Shutdown in Kubernetes

The application handles SIGTERM signals for graceful shutdown:

1. **Kubernetes sends SIGTERM** when terminating pod
2. **Application catches signal** and begins shutdown
3. **HTTP server closes** gracefully (existing requests complete)
4. **Process exits** with code 0
5. **Kubernetes removes pod** from service endpoints

**Shutdown timeout**: Kubernetes waits 30 seconds (default `terminationGracePeriodSeconds`) before sending SIGKILL.

**PreStop hook**: 5-second delay allows load balancers to update before shutting down.

## Cloud Deployment Examples

### Google Cloud Run

Google Cloud Run is ideal for containerized web applications with automatic scaling.

**Prerequisites:**
- Google Cloud account with billing enabled
- `gcloud` CLI installed and authenticated
- Docker image pushed to Google Container Registry (GCR) or Artifact Registry

**Build and push image:**

```bash
# Configure Docker for GCR
gcloud auth configure-docker

# Build image
./script/build --docker --tag gcr.io/YOUR_PROJECT_ID/festival-player:v1.0.0

# Push to GCR
docker push gcr.io/YOUR_PROJECT_ID/festival-player:v1.0.0
```

**Deploy to Cloud Run:**

```bash
gcloud run deploy festival-player \
  --image gcr.io/YOUR_PROJECT_ID/festival-player:v1.0.0 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 5000 \
  --set-env-vars PORT=5000 \
  --set-env-vars REDIRECT_URI=https://festival-player-xxxxx.run.app/callback
```

**Configure secrets in Cloud Run:**

```bash
# Create secrets in Secret Manager
echo -n "your_spotify_client_id" | gcloud secrets create spotify-client-id --data-file=-
echo -n "your_spotify_client_secret" | gcloud secrets create spotify-client-secret --data-file=-

# Deploy with secrets
gcloud run deploy festival-player \
  --image gcr.io/YOUR_PROJECT_ID/festival-player:v1.0.0 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 5000 \
  --update-secrets SPOTIFY_ID=spotify-client-id:latest \
  --update-secrets SPOTIFY_SECRET=spotify-client-secret:latest \
  --set-env-vars REDIRECT_URI=https://festival-player-xxxxx.run.app/callback
```

**Cloud Run features utilized:**
- **Auto-scaling**: Scales to zero when idle, up to 100+ instances under load
- **HTTPS by default**: Automatic SSL certificates
- **Health checks**: Uses built-in health check endpoint
- **Graceful shutdown**: Respects SIGTERM signal
- **Secret management**: Integrates with Google Secret Manager

**Update REDIRECT_URI in Spotify app:**
- Add Cloud Run URL to allowed redirect URIs: `https://your-service-xxxxx.run.app/callback`

### AWS ECS (Elastic Container Service)

Deploy to ECS with Fargate for serverless container orchestration.

**Prerequisites:**
- AWS account with appropriate IAM permissions
- ECR repository created
- VPC with public subnets (or private with NAT gateway)

**Build and push to ECR:**

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build image
./script/build --docker --tag YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/festival-player:v1.0.0

# Push to ECR
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/festival-player:v1.0.0
```

**Create ECS task definition** (`task-definition.json`):

```json
{
  "family": "festival-player",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "festival-player",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/festival-player:v1.0.0",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "PORT",
          "value": "5000"
        },
        {
          "name": "REDIRECT_URI",
          "value": "https://your-alb-domain.us-east-1.elb.amazonaws.com/callback"
        }
      ],
      "secrets": [
        {
          "name": "SPOTIFY_ID",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:spotify-credentials:client-id::"
        },
        {
          "name": "SPOTIFY_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:spotify-credentials:client-secret::"
        }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:5000/api/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 10
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/festival-player",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

**Deploy ECS service with Application Load Balancer:**

```bash
# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create ECS service
aws ecs create-service \
  --cluster your-cluster \
  --service-name festival-player \
  --task-definition festival-player \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=festival-player,containerPort=5000"
```

**AWS Secrets Manager for credentials:**

```bash
# Create secret
aws secretsmanager create-secret \
  --name spotify-credentials \
  --secret-string '{"client-id":"your_id","client-secret":"your_secret"}'
```

**Update REDIRECT_URI in Spotify app:**
- Add ALB DNS name to allowed redirect URIs: `https://your-alb.us-east-1.elb.amazonaws.com/callback`

### Environment Variable Configuration

**Best practices for managing environment variables in cloud deployments:**

1. **Use secrets management services:**
   - Google Cloud: Secret Manager
   - AWS: Secrets Manager or Parameter Store
   - Azure: Key Vault
   - Kubernetes: Secrets

2. **Never commit secrets to version control:**
   - Use `.gitignore` for `.env` files
   - Reference secrets by ARN/path in deployment configs

3. **Rotate credentials regularly:**
   - Update Spotify API credentials periodically
   - Use automation for rotation in production

4. **Environment-specific configurations:**
   - Development: `.env.docker` or `.env.development`
   - Staging: Cloud secrets with staging Spotify app
   - Production: Cloud secrets with production Spotify app

5. **REDIRECT_URI must match deployment URL:**
   - Local: `http://localhost:5000/callback`
   - Cloud Run: `https://your-service.run.app/callback`
   - Custom domain: `https://festival-player.your-domain.com/callback`

## Troubleshooting

### Common Issues

#### Port Already in Use

**Symptom:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Check if container is already running:**
   ```bash
   docker ps
   docker stop festival-player
   ```

2. **Find process using port:**
   ```bash
   lsof -i :5000
   kill -9 <PID>
   ```

3. **Use different port:**
   ```bash
   docker run -p 8080:5000 --env-file .env.docker festival-player
   ```

#### Environment File Not Found

**Symptom:**
```
Error: .env.docker file not found
```

**Solutions:**

1. **Create environment file:**
   ```bash
   cp script/.env.example .env.docker
   ```

2. **Edit with your credentials:**
   ```bash
   vim .env.docker
   ```

3. **Verify file exists:**
   ```bash
   ls -la .env.docker
   ```

#### Permission Denied in Container

**Symptom:**
```
Error: EACCES: permission denied, open '/app/dist/server.js'
```

**Solutions:**

1. **Rebuild image** (ownership should be fixed automatically):
   ```bash
   docker build --no-cache -t festival-player .
   ```

2. **Check file ownership in Dockerfile** (should have `--chown=nodejs:nodejs`):
   ```dockerfile
   COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
   ```

#### Spotify API Authentication Fails

**Symptom:**
```
401 Unauthorized from Spotify API
```

**Solutions:**

1. **Verify credentials in environment file:**
   ```bash
   docker run --rm --env-file .env.docker festival-player env | grep SPOTIFY
   ```

2. **Check REDIRECT_URI matches Spotify app settings:**
   - Visit https://developer.spotify.com/dashboard
   - Ensure redirect URI is in allowed list

3. **Regenerate Spotify credentials** if compromised

#### Health Check Failures

**Symptom:**
```
Health check failed: unhealthy
```

**Solutions:**

1. **Check if server is running:**
   ```bash
   docker logs festival-player
   ```

2. **Test health endpoint manually:**
   ```bash
   docker exec festival-player curl http://localhost:5000/api/health
   ```

3. **Verify PORT environment variable:**
   ```bash
   docker inspect festival-player | jq '.[0].Config.Env'
   ```

### Debugging Techniques

#### View Container Logs

```bash
# View logs
docker logs festival-player

# Follow logs in real-time
docker logs -f festival-player

# Last 100 lines
docker logs --tail 100 festival-player

# Logs with timestamps
docker logs -t festival-player
```

#### Execute Commands in Running Container

```bash
# Open shell in container
docker exec -it festival-player sh

# Check running processes
docker exec festival-player ps aux

# Test health endpoint
docker exec festival-player curl http://localhost:5000/api/health

# View environment variables
docker exec festival-player env
```

#### Inspect Container Configuration

```bash
# Full container details
docker inspect festival-player

# Network settings
docker inspect festival-player | jq '.[0].NetworkSettings'

# Environment variables
docker inspect festival-player | jq '.[0].Config.Env'

# Health check configuration
docker inspect festival-player | jq '.[0].State.Health'
```

#### Debug Docker Build Issues

```bash
# Build with verbose output
docker build --progress=plain -t festival-player .

# Build without cache
docker build --no-cache -t festival-player .

# Build specific stage only
docker build --target build -t festival-player-build .

# Inspect intermediate layers
docker history festival-player
```

#### Test Production Image Locally

```bash
# Run in detached mode
docker run -d --name festival-player -p 5000:5000 --env-file .env.docker festival-player

# Check health
curl http://localhost:5000/api/health

# View logs
docker logs -f festival-player

# Stop and remove
docker stop festival-player && docker rm festival-player
```

### Performance Considerations

#### Image Build Performance

**Use BuildKit for faster builds:**

```bash
DOCKER_BUILDKIT=1 docker build -t festival-player .
```

**Benefits:**
- Parallel layer building
- Improved caching
- Faster dependency resolution
- Better build output

#### Container Resource Limits

**Set resource limits to prevent memory issues:**

```bash
docker run -p 5000:5000 \
  --memory="256m" \
  --cpus="0.5" \
  --env-file .env.docker \
  festival-player
```

**Kubernetes resource limits:**
```yaml
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "256Mi"
    cpu: "500m"
```

#### Volume Mount Performance (macOS/Windows)

**Issue**: Docker volume mounts have performance overhead on macOS/Windows due to filesystem translation.

**Solutions:**

1. **Use named volumes** for node_modules (already implemented):
   ```yaml
   volumes:
     - node_modules:/app/node_modules
   ```

2. **Consider delegated/cached mount options**:
   ```yaml
   volumes:
     - ./server:/app/server:cached
   ```

3. **Run client locally** for fastest HMR (recommended approach)

#### Startup Time Optimization

**Current startup time**: ~3-5 seconds

**Optimizations applied:**
- Compiled JavaScript (no runtime TypeScript compilation)
- Production dependencies only
- Alpine base image (fast container start)
- Minimal layers in final image

**Monitor startup:**
```bash
time docker run -p 5000:5000 --env-file .env.docker festival-player
```

## Security Best Practices

### Non-Root User (Already Implemented)

The Dockerfile creates and uses a non-root user:

```dockerfile
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs
```

**Benefits:**
- Limits damage from container breakout
- Follows principle of least privilege
- Required by some Kubernetes security policies

### Secret Management

**Never include secrets in Docker images:**

```bash
# BAD - secrets in build args
docker build --build-arg SPOTIFY_SECRET=abc123 .

# GOOD - secrets passed at runtime
docker run --env-file .env.docker festival-player
```

**Use secret management services:**

- **Kubernetes**: Store secrets in Secrets, mount as environment variables
- **Cloud Run**: Use Secret Manager integration
- **ECS**: Use AWS Secrets Manager with task definitions
- **Docker Swarm**: Use Docker secrets

**Rotate credentials regularly:**
```bash
# Update Kubernetes secret
kubectl create secret generic spotify-credentials \
  --from-literal=client-id=new_id \
  --from-literal=client-secret=new_secret \
  --dry-run=client -o yaml | kubectl apply -f -

# Restart deployment to pick up new secret
kubectl rollout restart deployment/festival-player
```

### Image Scanning

**Scan for vulnerabilities using Docker Scout:**

```bash
docker scout cves festival-player:latest
```

**Scan with Trivy:**

```bash
trivy image festival-player:latest
```

**Automated scanning in CI/CD:**

```yaml
# GitHub Actions example
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: festival-player:${{ github.sha }}
    format: 'sarif'
    output: 'trivy-results.sarif'
```

### Network Policies

**Kubernetes network policy to restrict traffic:**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: festival-player-netpol
spec:
  podSelector:
    matchLabels:
      app: festival-player
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: ingress-nginx
    ports:
    - protocol: TCP
      port: 5000
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: TCP
      port: 53  # DNS
  - to:
    - podSelector: {}
    ports:
    - protocol: TCP
      port: 443  # Spotify API
```

**Benefits:**
- Restricts ingress to nginx ingress controller only
- Allows egress to DNS and Spotify API only
- Prevents lateral movement in cluster
- Defense in depth

### Minimal Base Image

**Using Alpine Linux reduces attack surface:**

- Smaller image = fewer packages = fewer vulnerabilities
- Alpine uses musl libc instead of glibc (smaller, simpler)
- Package manager (apk) has minimal default packages

**Current base**: `node:18-alpine` (~40 MB base)

**Alternatives to consider:**
- `gcr.io/distroless/nodejs` (even more minimal, no shell)
- `scratch` with compiled binary (Node.js not suitable for this)

### Read-Only Filesystem

**Run container with read-only root filesystem:**

```bash
docker run -p 5000:5000 \
  --read-only \
  --tmpfs /tmp \
  --env-file .env.docker \
  festival-player
```

**Kubernetes deployment:**
```yaml
securityContext:
  readOnlyRootFilesystem: true
volumeMounts:
- name: tmp
  mountPath: /tmp
volumes:
- name: tmp
  emptyDir: {}
```

**Benefits:**
- Prevents malware from writing to disk
- Immutable infrastructure principle
- Easier compliance and auditing

### Security Headers

**Add security headers in reverse proxy (nginx, ALB, etc.):**

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

**Or implement in Express middleware** (recommended for portability).

---

## Additional Resources

- **Dockerfile Best Practices**: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
- **Node.js Docker Guide**: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
- **Kubernetes Documentation**: https://kubernetes.io/docs/
- **Google Cloud Run**: https://cloud.google.com/run/docs
- **AWS ECS**: https://docs.aws.amazon.com/ecs/

## Support

For issues or questions:
- **GitHub Issues**: https://github.com/kgstaley/spotify_playlist_generator/issues
- **Project README**: `/Users/kerrychristinestaley/code/festival-player/README.md`

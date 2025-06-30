# Deployment Guide

## 🚀 Writigo Deployment Options

This guide covers deployment strategies for Writigo's distributed architecture.

## Deployment Architectures

### 1. Single-User Local Setup
Perfect for individual users or small teams:

```
┌─────────────────┐
│   User Machine  │
│                 │
│  ┌─────────────┐│
│  │   Editor    ││  
│  │ (Electron)  ││
│  └─────────────┘│
│  ┌─────────────┐│
│  │ File Watcher││
│  │  (Python)   ││
│  └─────────────┘│
│  ┌─────────────┐│
│  │ Local Files ││
│  │ (.md vault) ││
│  └─────────────┘│
└─────────────────┘
```

### 2. Team Collaboration Setup
For teams with shared infrastructure:

```
┌─────────────────┐    ┌─────────────────┐
│   User Client   │    │  Shared Server  │
│                 │    │                 │
│  ┌─────────────┐│    │ ┌─────────────┐ │
│  │   Editor    ││◄──►│ │     API     │ │
│  │ (Electron)  ││    │ │ (FastAPI)   │ │
│  └─────────────┘│    │ └─────────────┘ │
│  ┌─────────────┐│    │ ┌─────────────┐ │
│  │ Local Vault ││    │ │ Vector DB   │ │
│  └─────────────┘│    │ │(FAISS/Pine) │ │
└─────────────────┘    │ └─────────────┘ │
                       │ ┌─────────────┐ │
                       │ │ File Watcher│ │
                       │ │ Processing  │ │
                       │ └─────────────┘ │
                       └─────────────────┘
```

### 3. Enterprise Cloud Deployment
Scalable cloud infrastructure:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Client      │    │   Load Balancer │    │   API Cluster   │
│                 │    │                 │    │                 │
│  ┌─────────────┐│    │  ┌─────────────┐│    │ ┌─────────────┐ │
│  │   Editor    ││◄──►│  │   Nginx     ││◄──►│ │  FastAPI    │ │
│  │ (Electron)  ││    │  │             ││    │ │ (Pod 1-N)   │ │
│  └─────────────┘│    │  └─────────────┘│    │ └─────────────┘ │
│  ┌─────────────┐│    └─────────────────┘    │ ┌─────────────┐ │
│  │   Web UI    ││                           │ │  Worker     │ │
│  └─────────────┘│    ┌─────────────────┐    │ │ (Pod 1-N)   │ │
└─────────────────┘    │   Vector Store  │    │ └─────────────┘ │
                       │                 │    └─────────────────┘
                       │ ┌─────────────┐ │    ┌─────────────────┐
                       │ │ Pinecone/   │ │    │   PostgreSQL    │
                       │ │ Weaviate    │ │    │    Cluster     │
                       │ └─────────────┘ │    │                 │
                       └─────────────────┘    └─────────────────┘
```

## Local Development Deployment

### Quick Start
```bash
# Clone repository
git clone https://github.com/yourusername/writigo.git
cd writigo

# Install dependencies
npm install
pip install -r requirements.txt

# Start all services
npm run dev
```

### Manual Service Startup
```bash
# Terminal 1: Start API server
cd apps/api
uvicorn main:app --reload --port 8000

# Terminal 2: Start file watcher
cd services/watcher  
python -m watcher.main

# Terminal 3: Start Electron editor
cd apps/editor
npm run electron:dev

# Terminal 4: Start web UI (optional)
cd apps/web-ui
npm run dev
```

## Docker Deployment

### Development with Docker Compose
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  api:
    build: ./apps/api
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://writigo:password@db:5432/writigo
      - VECTOR_DB_URL=http://vectordb:8080
    volumes:
      - ./data:/app/data
    depends_on:
      - db
      - vectordb

  watcher:
    build: ./services/watcher
    volumes:
      - ./data:/app/data
    environment:
      - API_URL=http://api:8000
    depends_on:
      - api

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: writigo
      POSTGRES_USER: writigo
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  vectordb:
    image: weaviate/weaviate:latest
    ports:
      - "8080:8080"
    environment:
      QUERY_DEFAULTS_LIMIT: 25
      AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED: 'true'

volumes:
  postgres_data:
```

### Production Docker Setup
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with environment variables
export DATABASE_URL="your-production-db-url"
export VECTOR_DB_URL="your-vector-db-url"
export JWT_SECRET="your-jwt-secret"

docker-compose -f docker-compose.prod.yml up -d
```

## Cloud Provider Deployments

### AWS Deployment

#### ECS with Fargate
```yaml
# aws-task-definition.json
{
  "family": "writigo-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "writigo-api",
      "image": "your-account.dkr.ecr.region.amazonaws.com/writigo-api:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://..."
        }
      ]
    }
  ]
}
```

#### Infrastructure as Code (Terraform)
```hcl
# main.tf
resource "aws_ecs_cluster" "writigo" {
  name = "writigo-cluster"
}

resource "aws_ecs_service" "api" {
  name            = "writigo-api"
  cluster         = aws_ecs_cluster.writigo.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [aws_security_group.api.id]
    assign_public_ip = true
  }
}

resource "aws_rds_instance" "main" {
  identifier     = "writigo-db"
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.micro"
  allocated_storage = 20
  
  db_name  = "writigo"
  username = "writigo"
  password = var.db_password
}
```

### Google Cloud Platform

#### Cloud Run Deployment
```yaml
# cloudrun-api.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: writigo-api
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: "10"
    spec:
      containers:
      - image: gcr.io/your-project/writigo-api:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: writigo-secrets
              key: database-url
        resources:
          limits:
            cpu: "1"
            memory: "512Mi"
```

### Azure Container Instances

#### ARM Template
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.ContainerInstance/containerGroups",
      "apiVersion": "2021-03-01",
      "name": "writigo-api",
      "location": "[resourceGroup().location]",
      "properties": {
        "containers": [
          {
            "name": "writigo-api",
            "properties": {
              "image": "your-registry.azurecr.io/writigo-api:latest",
              "ports": [
                {
                  "port": 8000,
                  "protocol": "TCP"
                }
              ],
              "resources": {
                "requests": {
                  "cpu": 0.5,
                  "memoryInGB": 1
                }
              }
            }
          }
        ],
        "osType": "Linux",
        "ipAddress": {
          "type": "Public",
          "ports": [
            {
              "port": 8000,
              "protocol": "TCP"
            }
          ]
        }
      }
    }
  ]
}
```

## Monitoring & Observability

### Health Checks
```python
# apps/api/health.py
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "services": {
            "database": await check_database(),
            "vector_db": await check_vector_db(),
            "file_system": check_file_system()
        }
    }
```

### Logging Configuration
```python
# logging configuration
import logging
import structlog

logging.basicConfig(
    format="%(message)s",
    stream=sys.stdout,
    level=logging.INFO,
)

structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.dev.ConsoleRenderer()
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    logger_factory=structlog.stdlib.LoggerFactory(),
    context_class=dict,
    cache_logger_on_first_use=True,
)
```

### Metrics & Monitoring
```python
# Prometheus metrics
from prometheus_client import Counter, Histogram, generate_latest

REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')

@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path).inc()
    REQUEST_DURATION.observe(duration)
    
    return response
```

## Security Considerations

### Environment Variables
```bash
# Production environment variables
export DATABASE_URL="postgresql://user:pass@host:5432/writigo"
export VECTOR_DB_URL="https://your-pinecone-url"
export JWT_SECRET="your-secure-jwt-secret"
export OPENAI_API_KEY="your-openai-key"
export ENCRYPTION_KEY="your-encryption-key"
```

### SSL/TLS Configuration
```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name api.writigo.dev;
    
    ssl_certificate /etc/letsencrypt/live/api.writigo.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.writigo.dev/privkey.pem;
    
    location / {
        proxy_pass http://writigo-api:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Backup & Recovery

### Database Backups
```bash
# Automated PostgreSQL backup
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="writigo_backup_$DATE.sql"

pg_dump $DATABASE_URL > $BACKUP_FILE
aws s3 cp $BACKUP_FILE s3://writigo-backups/
```

### Vector Database Backups
```python
# Backup vector embeddings
async def backup_vector_db():
    embeddings = await vector_db.export_all()
    backup_data = {
        "timestamp": datetime.utcnow(),
        "embeddings": embeddings,
        "metadata": await get_metadata()
    }
    
    with open(f"vector_backup_{timestamp}.json", "w") as f:
        json.dump(backup_data, f)
```

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check if ports are in use
lsof -i :8000  # API port
lsof -i :3000  # Web UI port

# Kill processes using ports
sudo kill -9 $(lsof -t -i:8000)
```

#### Memory Issues
```bash
# Monitor memory usage
docker stats writigo-api
htop

# Adjust container memory limits
docker run --memory=2g writigo-api
```

#### Database Connection Issues
```bash
# Test database connectivity
psql $DATABASE_URL -c "SELECT 1;"

# Check database logs
docker logs writigo-db
```

### Performance Optimization

#### Vector Database Tuning
```python
# Optimize FAISS index
import faiss

# Use faster but less accurate index for development
index = faiss.IndexFlatIP(dimension)

# Use more accurate index for production
index = faiss.IndexIVFFlat(quantizer, dimension, nlist)
```

#### API Optimization
```python
# Enable response caching
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

@app.on_event("startup")
async def startup():
    redis = aioredis.from_url("redis://localhost")
    FastAPICache.init(RedisBackend(redis), prefix="writigo-cache")

@app.get("/search")
@cache(expire=300)  # Cache for 5 minutes
async def search_documents(query: str):
    return await perform_search(query)
```

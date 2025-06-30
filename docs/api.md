# API Documentation

RESTful API documentation for Writigo backend services.

## Base URL

```
Development: http://localhost:8000
Production: https://api.writigo.dev
```

## Authentication

All API requests require authentication using JWT tokens:

```bash
Authorization: Bearer <your-jwt-token>
```

### Get Access Token

```http
POST /auth/token
Content-Type: application/x-www-form-urlencoded

username=your-username&password=your-password
```

## Endpoints

### Documents

#### List Documents
```http
GET /api/v1/documents
```

**Parameters:**
- `vault_id` (optional) - Filter by vault ID
- `limit` (optional) - Number of results (default: 50)
- `offset` (optional) - Pagination offset

**Response:**
```json
{
  "documents": [
    {
      "id": "doc-123",
      "title": "My Document",
      "path": "/vault/my-document.md",
      "updated_at": "2025-06-30T16:00:00Z",
      "size": 1024
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

#### Get Document
```http
GET /api/v1/documents/{document_id}
```

**Response:**
```json
{
  "id": "doc-123",
  "title": "My Document",
  "content": "# My Document\n\nContent here...",
  "metadata": {
    "tags": ["note", "important"],
    "created_at": "2025-06-30T15:00:00Z",
    "updated_at": "2025-06-30T16:00:00Z"
  }
}
```

### Search

#### Semantic Search
```http
POST /api/v1/search
Content-Type: application/json

{
  "query": "How to setup authentication?",
  "limit": 10,
  "vault_ids": ["vault-1", "vault-2"]
}
```

**Response:**
```json
{
  "results": [
    {
      "chunk_id": "chunk-456",
      "document_id": "doc-123",
      "content": "Authentication setup involves...",
      "score": 0.95,
      "metadata": {
        "title": "Authentication Guide",
        "path": "/docs/auth.md"
      }
    }
  ],
  "query": "How to setup authentication?",
  "total_results": 1
}
```

### Chat (RAG)

#### Chat with Documents
```http
POST /api/v1/chat
Content-Type: application/json

{
  "message": "How do I configure the database?",
  "conversation_id": "conv-789",
  "vault_ids": ["vault-1"]
}
```

**Response:**
```json
{
  "response": "To configure the database, you need to...",
  "sources": [
    {
      "document_id": "doc-456",
      "title": "Database Configuration",
      "chunk": "Database configuration is done via...",
      "score": 0.89
    }
  ],
  "conversation_id": "conv-789"
}
```

### Vaults

#### List Vaults
```http
GET /api/v1/vaults
```

#### Create Vault
```http
POST /api/v1/vaults
Content-Type: application/json

{
  "name": "My Project Vault",
  "path": "/home/user/vaults/project",
  "description": "Documentation for my project"
}
```

### WebSocket Events

Connect to WebSocket for real-time updates:

```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

// Listen for document updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'document_updated') {
    // Handle document update
  }
};
```

#### Event Types

- `document_updated` - Document content changed
- `document_created` - New document added
- `document_deleted` - Document removed
- `search_index_updated` - Search index refreshed

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "DOCUMENT_NOT_FOUND",
    "message": "Document with ID 'doc-123' not found",
    "details": {}
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

API requests are rate limited:
- **Free tier**: 100 requests per minute
- **Pro tier**: 1000 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625097600
```

## SDKs

### JavaScript/TypeScript
```bash
npm install @writigo/api-client
```

```typescript
import { WritigoClient } from '@writigo/api-client';

const client = new WritigoClient({
  baseUrl: 'http://localhost:8000',
  apiKey: 'your-api-key'
});

const results = await client.search('my query');
```

### Python
```bash
pip install writigo-python
```

```python
from writigo import WritigoClient

client = WritigoClient(
    base_url='http://localhost:8000',
    api_key='your-api-key'
)

results = client.search('my query')
```

# Writigo API

FastAPI backend service for the Writigo documentation system.

## Features

- RESTful API for document management
- Vector database integration
- RAG (Retrieval-Augmented Generation) pipeline
- Authentication and authorization
- WebSocket support for real-time features

## Development

```bash
# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn main:app --reload

# Run tests
pytest
```

## API Endpoints

- `GET /api/v1/documents` - List documents
- `POST /api/v1/search` - Semantic search
- `POST /api/v1/chat` - RAG chat interface
- `WebSocket /ws` - Real-time collaboration

## Configuration

See `.env.example` for configuration options.

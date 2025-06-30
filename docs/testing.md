# Writigo Testing Guide

## 🧪 Testing Strategy for AI-Powered Documentation

This guide outlines testing practices specific to Writigo's architecture and requirements.

## Component-Specific Testing

### 📝 Editor App (Electron + React)

#### **Unit Tests**
- Markdown parser functionality
- Link detection and validation (`[[Note Title]]` syntax)
- File management operations
- Plugin system interfaces

#### **Integration Tests**
- Electron main/renderer communication
- File system operations with real files
- Yjs collaboration sync
- Search integration with backend

#### **E2E Tests**
- Complete document editing workflows
- Multi-window collaboration scenarios
- Plugin installation and usage
- File import/export operations

### 🔍 File Watcher Service (Python)

#### **Unit Tests**
- File change detection logic
- Content parsing and chunking
- Embedding generation pipeline
- Error handling and retries

#### **Integration Tests**
- Real file system monitoring
- Database persistence operations
- API communication with main service
- Batch processing workflows

### 🚀 API Service (FastAPI)

#### **Unit Tests**
- RAG query processing
- Authentication and authorization
- Vector similarity calculations
- Response formatting

#### **Integration Tests**
- Database operations (PostgreSQL/SQLite)
- Vector store interactions (FAISS/Pinecone)
- LLM API integration
- Search result ranking

### 🌐 Web UI (React)

#### **Unit Tests**
- Search result components
- User interface interactions
- State management (search filters, pagination)
- Document preview rendering

#### **Integration Tests**
- API communication
- Real-time search updates
- User authentication flows
- Responsive design validation

## 🏗️ Writigo Test Architecture

```
writigo/
├── apps/
│   ├── editor/
│   │   ├── src/__tests__/           # Unit tests for editor
│   │   └── tests/
│   │       ├── integration/         # Editor integration tests
│   │       └── e2e/                # Editor E2E scenarios
│   ├── api/
│   │   └── tests/
│   │       ├── unit/               # FastAPI unit tests
│   │       ├── integration/        # Database + API tests
│   │       └── conftest.py         # pytest configuration
│   └── web-ui/
│       ├── src/__tests__/          # React component tests
│       └── tests/e2e/              # Web UI E2E tests
├── services/
│   ├── watcher/
│   │   └── tests/
│   │       ├── unit/               # File watcher unit tests
│   │       └── integration/        # Real file system tests
│   └── ingestion/
│       └── tests/
│           ├── unit/               # Processing pipeline tests
│           └── integration/        # AI/ML integration tests
└── tests/
    ├── e2e/                        # Cross-system E2E tests
    ├── fixtures/                   # Shared test data
    └── utils/                      # Test utilities
```

## 🚀 Running Tests

### Quick Commands
```bash
# All tests across the monorepo
npm test

# Component-specific testing
npm run test:editor              # Electron editor tests
npm run test:api                 # FastAPI backend tests  
npm run test:web                 # React web UI tests
npm run test:watcher            # File watcher service tests
npm run test:ingestion          # Document processing tests

# Test types
npm run test:unit               # Fast unit tests only
npm run test:integration        # Integration tests
npm run test:e2e               # End-to-end scenarios

# Development workflow  
npm run test:watch             # Watch mode for active development
npm run test:coverage          # Generate coverage reports
```

### Python Services
```bash
# File watcher service
cd services/watcher
pytest tests/ -v

# Ingestion service  
cd services/ingestion
pytest tests/ -v --asyncio-mode=auto

# All Python services
python -m pytest services/ -v
```

## 🎯 Test Data Strategy

### Test Fixtures
```bash
tests/fixtures/
├── markdown/                   # Sample markdown documents
│   ├── basic-note.md
│   ├── linked-notes.md         # [[Note Title]] link examples
│   └── complex-document.md
├── embeddings/                 # Pre-generated embeddings for testing
├── vector-db/                  # Test vector database states
└── user-data/                  # Sample user configurations
```

### Mock Services
```typescript
// API mocking for frontend tests
export const handlers = [
  rest.post('/api/search', (req, res, ctx) => {
    return res(ctx.json({ results: mockSearchResults }))
  }),
  rest.get('/api/documents/:id', (req, res, ctx) => {
    return res(ctx.json(mockDocument))
  })
]
```

### Database Testing
```python
# pytest fixtures for database testing
@pytest.fixture
async def db_session():
    # Create test database
    yield session
    # Cleanup after test

@pytest.fixture  
def sample_documents():
    return [
        Document(title="Test Note", content="# Test\nSample content"),
        Document(title="Linked Note", content="See [[Test Note]]"),
    ]
```

## 📊 Coverage & Quality

### Coverage Targets
- **Editor (TypeScript)**: 85%+ unit test coverage
- **API (Python)**: 90%+ unit test coverage  
- **Services (Python)**: 85%+ unit test coverage
- **Integration**: Critical user paths covered
- **E2E**: Primary workflows validated

### Quality Gates
```bash
# Pre-commit validation
npm run test:unit                # Must pass
npm run test:lint               # Code quality checks
npm run test:security           # Security vulnerability scan
npm run test:coverage           # Coverage threshold check
```

## 🔧 Writigo-Specific Testing

### AI/ML Testing Challenges
```python
# Testing embedding generation
def test_document_embedding():
    doc = "Sample markdown content"
    embedding = generate_embedding(doc)
    
    assert len(embedding) == EMBEDDING_DIMENSION
    assert isinstance(embedding, np.ndarray)
    # Similarity tests with known documents
    
# Testing vector search
def test_semantic_search():
    query = "How to create markdown links?"
    results = search_documents(query, limit=5)
    
    assert len(results) <= 5
    assert all(r.score > 0.7 for r in results)  # Relevance threshold
```

### Collaboration Testing
```typescript
// Testing Yjs real-time collaboration
describe('Real-time collaboration', () => {
  it('should sync changes between multiple editors', async () => {
    const doc1 = new Y.Doc()
    const doc2 = new Y.Doc()
    
    // Simulate concurrent edits
    const text1 = doc1.getText('content')
    const text2 = doc2.getText('content')
    
    text1.insert(0, 'Hello ')
    text2.insert(0, 'World')
    
    // Sync documents
    Y.applyUpdate(doc2, Y.encodeStateAsUpdate(doc1))
    Y.applyUpdate(doc1, Y.encodeStateAsUpdate(doc2))
    
    expect(text1.toString()).toBe('Hello World')
    expect(text2.toString()).toBe('Hello World')
  })
})
```

### File System Testing
```python
# Testing file watcher with real files
def test_file_watcher_detects_changes(tmp_path):
    # Create test vault
    vault_dir = tmp_path / "test-vault"
    vault_dir.mkdir()
    
    # Initialize watcher
    watcher = FileWatcher(vault_dir)
    
    # Create test file
    test_file = vault_dir / "test.md"
    test_file.write_text("# Test Document")
    
    # Verify change detection
    assert watcher.has_changes()
    changes = watcher.get_changes()
    assert len(changes) == 1
    assert changes[0].path == test_file
```

### Unit Tests
- Test one thing at a time
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies

### Integration Tests
- Test component interactions
- Use real databases with cleanup
- Test error scenarios
- Verify side effects

### E2E Tests
- Test complete user workflows
- Use page object model
- Run against production-like environment
- Keep scenarios focused and fast

## Continuous Integration

Tests run automatically on:
- Every pull request
- Main branch pushes
- Nightly for full suite

## Performance Testing

- **Load testing** with k6
- **Benchmark tests** for critical algorithms
- **Memory profiling** for Python services

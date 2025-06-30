# Global Test Configuration

This file will contain global pytest configuration and fixtures when implementation begins.

## Purpose

- Shared test fixtures across all Python services
- Database setup and teardown
- Mock configurations
- Test utilities

## Usage

When implementing Python services, create `conftest.py` with:

```python
import pytest
from typing import AsyncGenerator
from httpx import AsyncClient

@pytest.fixture
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    # Test client implementation
    pass

@pytest.fixture
def sample_vault_structure(tmp_path):
    # Vault structure for testing
    pass
```

## Testing Services

Each service should have its own test directory:
- `services/watcher/tests/`
- `services/ingestion/tests/` 
- `apps/api/tests/`

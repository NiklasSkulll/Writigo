"""Pytest configuration and fixtures for all tests."""

import asyncio
import pytest
from typing import AsyncGenerator, Generator
from httpx import AsyncClient
from fastapi.testclient import TestClient

# Import your FastAPI app when it's created
# from apps.api.main import app


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def test_client() -> TestClient:
    """Create a test client for the FastAPI app."""
    # Uncomment when FastAPI app is created
    # return TestClient(app)
    pass


@pytest.fixture
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    """Create an async test client."""
    # Uncomment when FastAPI app is created
    # async with AsyncClient(app=app, base_url="http://test") as client:
    #     yield client
    pass


@pytest.fixture
def sample_markdown_content() -> str:
    """Sample markdown content for testing."""
    return """# Test Document

This is a test document with some content.

## Section 1

Some content here with **bold** and *italic* text.

## Section 2

- List item 1
- List item 2
- List item 3

### Subsection

More content with a [link](https://example.com).
"""


@pytest.fixture
def sample_vault_structure(tmp_path):
    """Create a sample vault structure for testing."""
    vault_dir = tmp_path / "test_vault"
    vault_dir.mkdir()
    
    # Create some test files
    (vault_dir / "note1.md").write_text("# Note 1\nContent of note 1")
    (vault_dir / "note2.md").write_text("# Note 2\nContent of note 2")
    
    # Create subdirectory
    subdir = vault_dir / "subdir"
    subdir.mkdir()
    (subdir / "note3.md").write_text("# Note 3\nContent of note 3")
    
    return vault_dir


@pytest.fixture
def mock_embeddings():
    """Mock embedding vectors for testing."""
    return [
        [0.1, 0.2, 0.3, 0.4, 0.5],  # 5-dimensional mock embedding
        [0.2, 0.3, 0.4, 0.5, 0.6],
        [0.3, 0.4, 0.5, 0.6, 0.7],
    ]

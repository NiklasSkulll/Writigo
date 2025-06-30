# Document Ingestion Service

Service for processing, chunking, and embedding documents for the vector database.

## Features

- Document chunking strategies
- Multiple embedding models
- Vector database integration
- Metadata extraction
- OCR for images

## Supported Formats

- Markdown (.md, .txt)
- PDF documents
- Images (PNG, JPG, SVG) with OCR

## Processing Pipeline

1. **Document Detection** - New/changed files from watcher
2. **Content Extraction** - Text extraction from various formats
3. **Chunking** - Split documents into semantic chunks
4. **Embedding** - Generate vector embeddings
5. **Storage** - Store in vector database with metadata

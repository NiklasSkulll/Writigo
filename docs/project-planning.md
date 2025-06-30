# AI-Supported Markdown Documentation System

## 1. Introduction

This document outlines the overall project structure, planning, and architecture for an AI-supported documentation system based on Markdown files. It covers objectives, key components, workflows, technology choices, security considerations, collaboration features, and a high-level development timeline.

---

## 2. Objectives

- **Local-first Markdown editor**: Provide users with a familiar, offline-capable “vault-based” Markdown editor model for creating and editing `.md` documents.
	- concise description of that “vault-based” Markdown editor model:
		- it’s a **local-first Markdown workspace** that stores every note as a plain-text file in a folder (“vault”) on your own drive; there’s no proprietary database or cloud lock-in - just standard `.md` files you can open with any editor.
		- on top of that, it treats **links between notes as first-class citizens**: you can insert `[[Note Title]]`-style connections, automatically generate back-links, and even visualize your entire knowledge graph to see how topics interrelate.
		- it’s built on a **plugin-friendly architecture**, so you can add features like live-preview, custom themes, kanban boards, diagram embedding, or real-time collaboration modules without touching the core app.
		- across platforms - Windows, Linux - it works entirely offline by default, while offering optional sync services (via Git or its own encrypted sync) when you want to share or back up your vault.
		- this pattern combines the simplicity and portability of plain-text Markdown with a rich linking and extension ecosystem - exactly the model your AI-powered system can build on.
- **Automated ingestion**: Watch for file changes and automatically capture new/updated documents.
- **Search & Retrieval**: Index content in a vector database and enable semantic search via a RAG (Retrieval-Augmented Generation) pipeline.
- **Multi-user collaboration**: Support real-time sync and versioning, enabling teams of 10–100 users to work together.
- **Privacy & Flexibility**: Operate entirely locally by default, with optional connection to public LLM APIs via API tokens.

---

## 3. High-Level Architecture

```plaintext
+-------------------+       +------------------+       +------------------+
|  User's Vault     |  <--  |  Markdown Editor |  -->  |  Local Git Repo  |
|  (.md files)      |       |                  |       |  (push/pull)     |
+-------------------+       +------------------+       +------------------+
         |                          |                        |
         v                          |                        |
+-------------------+              |                        |
|  Python Watcher   |--------------+                        |
|  (fs events)      |                                       |
+-------------------+                                       |
         |                                                  |
         v                                                  v
+-------------------+       +------------------+       +------------------+
| Chunking &        |       | Vector DB        |       | RAG API Layer    |
| Embeddings        |       | (FAISS / Pinecone)|       | (LLM & Retrieval)|
+-------------------+       +------------------+       +------------------+
         |                                                  |
         +--------------------------------------------------+
                            |
                            v
                  +-------------------------+
                  |  Client Search UI      |
                  |  (Web / Electron App)  |
                  +-------------------------+
```

---

## 4. Core Components

1. **Markdown Editor** (Electron + React)
    - Local vault management, file tree, backlinks, templates selector.
    - Plugin hook for real-time sync (Yjs/Automerge) and Git integration.
2. **Python Watcher Service**
    - Monitors vault directory using `watchdog`.
    - Debounces rapid changes and triggers ingestion pipeline.
3. **Ingestion Pipeline**
    - **Chunker**: Splits documents at headings or fixed token sizes.
    - **Embedder**: Computes embeddings (local model or API).
    - **Vector Store**: Stores embeddings + metadata (chunk ID, file path, ACL tags).
4. **RAG API Layer**
    - Authenticates users, enforces ACLs.
    - Handles search requests: retrieves top-k embeddings, builds prompt, invokes LLM.
    - Returns synthesized answers with source attributions.
5. **Client Search UI**
    - Web/Electron interface for queries, chat-like interaction.
    - Displays results, highlights source snippets, allows feedback (upvote/downvote).

---

## 5. Collaboration & Sync

- **Git Backend**: Optional plugin to push commits to a shared remote (GitLab/GitHub self-hosted).
- **Live Collaboration**: Yjs-based CRDT layer for real-time editing and conflict-free merges.
- **Access Control**: Per-user API tokens; file-level ACL metadata ensures search respects permissions.

---

## 6. Security & Privacy

- Default mode: Entirely local—no external API calls.
- Optional LLM API: User can configure API tokens (OpenAI, Anthropic) in settings.
- Embeddings and queries can be encrypted at rest.
- No telemetry unless explicitly opted-in.

---

## 7. Supported Content Types

- **Markdown (.md/.txt)**: Primary authoring format.
- **PDF**: Indexed via text extractor (e.g. `pdfminer`).
- **Images (png/jpg/svg)**: OCR for text; stored as attachments with metadata.

---

## 8. Tech Stack

|Layer|Technology|
|---|---|
|Editor UI|Electron, React, Tailwind CSS, Yjs|
|Watcher|Python (`watchdog`)|
|Chunking & Embedding|Python, LangChain, Hugging Face|
|Vector Store|Pinecone / Weaviate / FAISS + Redis|
|API Layer|FastAPI / Flask, JWT Auth|
|Database (Metadata)|PostgreSQL / SQLite|
|LLM (optional)|Local Llama/Mistral or OpenAI API|
|Deployment|Docker (local), optional Kubernetes|

---

## 9. Development Phases & Timeline

|Phase|Duration|Key Deliverables|
|---|---|---|
|**Phase 1**|2 weeks|Editor scaffold, local vault & file watcher|
|**Phase 2**|3 weeks|Chunking & embedding pipeline, test index|
|**Phase 3**|2 weeks|RAG API Layer + basic search UI|
|**Phase 4**|2 weeks|Collaboration (Git + Yjs), ACL enforcement|
|**Phase 5**|2 weeks|Multi-format support (PDF, images), OCR|
|**Phase 6**|1 week|Packaging, documentation, templates, QA|

---

## 10. Next Steps

- Set up project repository with monorepo structure (editor + API services).
- Define API contracts and data schemas.
- Prototype editor & watcher integration.
- Evaluate embedding model options (local vs. API).
- Sketch initial UI wireframes for search interface.

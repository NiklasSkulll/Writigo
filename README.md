```
  ██╗    ██╗██████╗ ██╗████████╗██╗ ██████╗  ██████╗ 
  ██║    ██║██╔══██╗██║╚══██╔══╝██║██╔════╝ ██╔═══██╗
  ██║ █╗ ██║██████╔╝██║   ██║   ██║██║  ███╗██║   ██║
  ██║███╗██║██╔══██╗██║   ██║   ██║██║   ██║██║   ██║
  ╚███╔███╔╝██║  ██║██║   ██║   ██║╚██████╔╝╚██████╔╝
   ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝ ╚═════╝  ╚═════╝ 
```

# Writigo

> AI-Supported Markdown Documentation System

Writigo is a local-first, AI-powered documentation system that combines the simplicity of Markdown with advanced search and collaboration features. Built on a vault-based architecture similar to Obsidian, it provides seamless integration with AI for enhanced document discovery and content generation.

## 🚀 Features

- **Local-First Vault System**: Store all your documents as plain `.md` files with no vendor lock-in
- **Intelligent Linking**: Create `[[Note Title]]` connections with automatic backlink generation
- **AI-Powered Search**: Semantic search using RAG (Retrieval-Augmented Generation) pipeline
- **Real-Time Collaboration**: Multi-user editing with conflict-free merges using Yjs CRDTs
- **Plugin Architecture**: Extensible system for custom themes, widgets, and functionality
- **Privacy-Focused**: Works entirely offline with optional LLM API integration
- **Git Integration**: Version control and team sync through Git repositories
- **Multi-Format Support**: Markdown, PDF, and image content with OCR capabilities

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Markdown      │◄──►│     Writigo     │◄──►│   Git Remote    │
│   Vault (.md)   │    │     Editor      │    │   Repository    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       │                       │
┌─────────────────┐              │                       │
│  File Watcher   │──────────────┤                       │
│   (Python)      │              │                       │
└─────────────────┘              │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Embedding &    │    │   Vector DB     │    │   RAG API       │
│  Chunking       │    │ (FAISS/Pinecone)│    │   Layer         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                └───────────────────────┤
                                                        ▼
                                            ┌─────────────────┐
                                            │  Search UI      │
                                            │ (Web/Electron)  │
                                            └─────────────────┘
```

## 📁 Project Structure

```
writigo/
├── apps/                          # Main applications
│   ├── editor/                    # Electron-based Markdown editor
│   ├── api/                       # FastAPI backend service
│   └── web-ui/                    # Web-based search interface
├── services/                      # Microservices
│   ├── watcher/                   # File system watcher (Python)
│   └── ingestion/                 # Document processing pipeline
├── packages/                      # Shared libraries
│   ├── shared/                    # Common utilities
│   └── types/                     # TypeScript type definitions
├── docs/                          # Documentation
├── scripts/                       # Build and deployment scripts
├── docker/                        # Container configurations
└── .github/                       # GitHub workflows and templates
```

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Editor UI** | Electron, React, Tailwind CSS, Yjs |
| **File Watcher** | Python (`watchdog`) |
| **Processing** | Python, LangChain, Hugging Face |
| **Vector Store** | Pinecone / Weaviate / FAISS + Redis |
| **API Layer** | FastAPI, JWT Authentication |
| **Database** | PostgreSQL / SQLite |
| **LLM** | Local Llama/Mistral or OpenAI API |
| **Deployment** | Docker, optional Kubernetes |

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.9+
- Git
- Docker (optional, for containers)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/writigo.git
   cd writigo
   ```

2. **Install dependencies**
   ```bash
   # Install Node.js dependencies
   npm install
   
   # Install Python dependencies
   pip install -r requirements.txt
   ```

3. **Start development environment**
   ```bash
   # Start all services
   npm run dev
   
   # Or start individual components
   npm run dev:editor    # Electron editor
   npm run dev:api       # Backend API
   npm run dev:watcher   # File watcher service
   ```

4. **Open Writigo**
   - The Electron editor will launch automatically
   - Web UI available at `http://localhost:3000`
   - API documentation at `http://localhost:8000/docs`

## 📚 Development Phases

- [ ] **Phase 1** (2 weeks): Editor scaffold, local vault & file watcher
- [ ] **Phase 2** (3 weeks): Chunking & embedding pipeline, test index
- [ ] **Phase 3** (2 weeks): RAG API Layer + basic search UI
- [ ] **Phase 4** (2 weeks): Collaboration (Git + Yjs), ACL enforcement
- [ ] **Phase 5** (2 weeks): Multi-format support (PDF, images), OCR
- [ ] **Phase 6** (1 week): Packaging, documentation, templates, QA

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

### Development Workflow

**⚠️ Note: `main` and `dev` branches are protected**

1. Fork the repository
2. Create a feature branch from `dev`: `git checkout dev && git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'feat(scope): add amazing feature'`
5. Push to your feature branch: `git push origin feature/amazing-feature`
6. Open a Pull Request to the `dev` branch

## 📖 Documentation

- [Architecture Overview](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Testing Guide](./docs/testing.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)
- [Version Control Guide](./docs/git-best-practices.md)
- [Branch Protection Setup](./docs/branch-protection.md)
- [Plugin Development](./docs/plugins.md)
- [Deployment Guide](./docs/deployment.md)
- [Project Planning](./docs/project-planning.md)

## 🔒 Security & Privacy

- **Local-First**: All data stored locally by default
- **Optional Cloud**: Connect to LLM APIs only when configured
- **Encryption**: Embeddings and queries encrypted at rest
- **No Telemetry**: Privacy-focused with opt-in analytics only

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Obsidian](https://obsidian.md/) for the vault-based approach
- Built with [Yjs](https://github.com/yjs/yjs) for real-time collaboration
- Powered by [LangChain](https://github.com/langchain-ai/langchain) for AI integration

## 📞 Support

- 📧 Email: support@writigo.dev
- 💬 Discord: [Join our community](https://discord.gg/writigo)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/writigo/issues)
- 📚 Docs: [Documentation Site](https://docs.writigo.dev)

---

<div align="center">
  <strong>Built with ❤️ for the developer community</strong>
</div>

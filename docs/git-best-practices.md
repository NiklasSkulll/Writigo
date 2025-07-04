# Writigo Version Control Guide

## 🎯 Project-Specific Git Workflow

### Repository Structure

Writigo follows a monorepo structure with specific version control practices for our AI-powered documentation system:

```
writigo/
├── apps/                    # Independent applications
├── services/               # Backend microservices  
├── packages/               # Shared libraries
├── docs/                   # Project documentation
└── scripts/               # Automation scripts
```

### Branch Strategy

#### **Protected Branches**
- `main` - Production-ready code, **protected** (no direct pushes)
- `dev` - Integration branch for features, **protected** (no direct pushes)

#### **Development Branches**
- `feature/*` - Feature development branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Critical production fixes

#### **Branch Naming Convention**
```bash
feature/editor-markdown-parser
feature/ai-embedding-pipeline
bugfix/file-watcher-memory-leak
hotfix/security-vulnerability-fix
```

#### **Writigo Development Workflow**
```bash
# 1. Create feature branch from dev
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name

# 2. Develop and commit
git add .
git commit -m "feat(editor): implement new feature"

# 3. Push feature branch
git push origin feature/your-feature-name

# 4. Create Pull Request: feature/your-feature -> dev
# 5. After review and merge, create PR: dev -> main
```

### Commit Standards

#### **Conventional Commits**
```bash
feat(editor): add markdown live preview
fix(watcher): resolve file deletion race condition  
docs(api): update RAG endpoint documentation
test(services): add integration tests for ingestion
chore(deps): update electron to v25.3.0
```

#### **Scope Guidelines**
- `editor` - Electron editor application
- `api` - FastAPI backend service
- `watcher` - File system watcher service
- `ingestion` - Document processing pipeline
- `shared` - Shared packages and utilities
- `docs` - Documentation updates

### 🔧 File Management Strategy

#### **User Data Protection** 
Never commit user-generated content:
```bash
vaults/                # User document vaults
user-data/             # User-generated content  
*.personal.md          # Personal notes
.writigo-user/         # User preferences
```

#### **AI/ML Assets**
Handle large model files appropriately:
```bash
embeddings/            # Generated embeddings (use Git LFS)
models/               # Downloaded AI models (external storage)
*.faiss               # Vector database files
checkpoints/          # Training checkpoints
wandb/                # Experiment tracking
```

#### **Build Artifacts**
Exclude generated files:
```bash
apps/*/dist/          # Application builds
services/*/build/     # Service builds  
packages/*/lib/       # Package outputs
coverage/             # Test coverage reports
```

### � Development Workflow

#### **Setting Up**
```bash
# Clone and setup
git clone https://github.com/yourusername/writigo.git
cd writigo
git checkout dev

# Create feature branch  
git checkout -b feature/your-feature-name

# Install dependencies
npm install
pip install -r requirements.txt
```

#### **Daily Workflow**
```bash
# Pull latest changes from dev
git checkout dev
git pull origin dev

# Sync your feature branch
git checkout feature/your-feature-name  
git rebase dev

# Make changes and commit
git add .
git commit -m "feat(editor): implement new feature"

# Push feature branch
git push origin feature/your-feature-name

# Create Pull Request to dev branch
```

#### **Pull Request Workflow**
```bash
# 1. Feature development
feature/my-feature -> dev (via Pull Request)

# 2. Integration testing on dev branch
# Run full test suite, integration tests

# 3. Release to production
dev -> main (via Pull Request)

# 4. Hotfixes (if needed)
hotfix/critical-fix -> main (via Pull Request)
hotfix/critical-fix -> dev (to keep branches in sync)
```

#### **Before Pull Request**
```bash
# Ensure tests pass
npm test
npm run test:e2e

# Check for ignored files that shouldn't be
git status --ignored

# Validate no secrets committed
git log --oneline -5
```

### 🚨 Security & Privacy

#### **Never Commit**
- API keys or tokens (OpenAI, Pinecone, etc.)
- User documents or personal notes
- Database credentials or connection strings
- Large model files (>100MB)
- Development certificates or keys

#### **Pre-commit Checks**
```bash
# Check for secrets
git diff --cached | grep -i "api_key\|secret\|password"

# Validate file sizes
git diff --cached --stat | grep -E "^\s*[^|]+\|\s*[0-9]+\s*\+{10,}"
```

### � CI/CD Integration

#### **Automated Validation**
Our GitHub Actions automatically:
- Run all test suites (Jest, Playwright, pytest)
- Check for security vulnerabilities
- Validate no large files committed
- Ensure proper commit message format

#### **Required Status Checks**
Before merging to `dev`:
- ✅ All tests pass
- ✅ No security issues detected  
- ✅ Documentation updated
- ✅ Code review approved

Before merging to `main`:
- ✅ All dev branch checks pass
- ✅ Integration tests on dev successful
- ✅ Release notes prepared
- ✅ Stakeholder approval

### 🛠️ Project Commands

#### **Quick Git Commands for Writigo**
```bash
# Start new feature
npm run git:feature-start <feature-name>

# Check repository health  
npm run git:health-check

# Prepare for PR
npm run git:prepare-pr

# Clean up branches
npm run git:cleanup
```

### 📁 Monorepo Considerations

#### **Path-Specific Changes**
```bash
# Only changes in editor app
git add apps/editor/
git commit -m "feat(editor): update markdown parser"

# Service-specific changes  
git add services/watcher/
git commit -m "fix(watcher): handle symlinks correctly"
```

#### **Workspace Dependencies**
When changing shared packages:
```bash
# Update shared package
git add packages/shared/
git commit -m "feat(shared): add new utility functions"

# Update dependent apps in same commit
git add apps/editor/ apps/web-ui/
git commit --amend -m "feat(shared): add utilities and update dependents"
```

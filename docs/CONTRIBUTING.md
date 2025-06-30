# Contributing to Writigo

Thank you for your interest in contributing to Writigo! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/writigo.git
   cd writigo
   ```

2. **Install Dependencies**
   ```bash
   # Node.js dependencies
   npm install
   
   # Python dependencies
   pip install -r requirements.txt
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Configure your development environment
   nano .env
   ```

## 🏗️ Project Structure

```
apps/
├── editor/          # Electron Markdown editor
├── api/             # FastAPI backend
└── web-ui/          # React search interface

services/
├── watcher/         # Python file watcher
└── ingestion/       # Document processing

packages/
├── shared/          # Common utilities
└── types/           # TypeScript definitions
```

## 🛠️ Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages

Follow conventional commits format:

```
type(scope): description

feat(editor): add markdown preview mode
fix(api): resolve authentication timeout
docs(readme): update installation guide
```

### Pull Request Process

**⚠️ Important: `main` and `dev` branches are protected - no direct pushes allowed**

1. **Create feature branch from `dev`**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```

2. **Develop with tests**
   - Make your changes with appropriate tests
   - Follow coding standards and conventions
   - Update documentation if needed

3. **Prepare for review**
   ```bash
   npm run git:prepare-pr  # Runs tests, linting, type-check
   git push origin feature/your-feature-name
   ```

4. **Submit Pull Request to `dev`**
   - Clear description of changes
   - Link related issues
   - Include screenshots/demos if applicable

5. **After merge to `dev`**
   - Integration testing occurs on `dev` branch
   - When ready, maintainers create PR from `dev` → `main`

### Branch Protection Rules

- **`main`**: Requires PR from `dev`, all checks must pass, admin approval
- **`dev`**: Requires PR from feature branches, all checks must pass, code review

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific app tests
npm run test:editor
npm run test:api
npm run test:services

# Python tests
pytest services/
```

### Test Requirements

- Unit tests for new functionality
- Integration tests for API endpoints
- E2E tests for critical user flows

## 📝 Code Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Maximum line length: 100 characters

### Python

- Follow PEP 8 style guide
- Use type hints
- Maximum line length: 88 characters (Black formatter)
- Use docstrings for all functions

### Documentation

- Update README for significant changes
- Add JSDoc comments for public APIs
- Include examples in documentation

## 🚫 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow GitHub community guidelines

## 📋 Issue Guidelines

### Bug Reports

Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
- Screenshots if applicable

### Feature Requests

Include:
- Clear description of the problem
- Proposed solution
- Alternative solutions considered
- Additional context

## 🏷️ Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed

## 💡 Development Tips

- Use `npm run dev` for hot-reload development
- Check the console for TypeScript errors
- Use browser dev tools for debugging
- Test on multiple platforms when possible

## 🤝 Getting Help

- Join our Discord community
- Check existing issues and discussions
- Ask questions in pull request reviews
- Tag maintainers for urgent issues

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

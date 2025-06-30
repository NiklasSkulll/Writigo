# Branch Protection Setup

This document describes how to configure branch protection rules for the Writigo repository.

## 🛡️ Branch Protection Configuration

### GitHub Repository Settings

Navigate to **Settings → Branches** in your GitHub repository and add the following protection rules:

#### Protection Rule for `main` Branch

```yaml
Branch name pattern: main
Settings:
  ✅ Restrict pushes that create files larger than 100MB
  ✅ Require a pull request before merging
    ✅ Require approvals: 1 (minimum)
    ✅ Dismiss stale PR approvals when new commits are pushed
    ✅ Require review from code owners
    ✅ Restrict reviews to users with write access
  ✅ Require status checks to pass before merging
    ✅ Require branches to be up to date before merging
    Required status checks:
      - test (CI/CD Pipeline)
      - build (if applicable)
  ✅ Require conversation resolution before merging
  ✅ Require signed commits (recommended)
  ✅ Include administrators (apply rules to admins too)
  ✅ Restrict pushes that create files larger than 100MB
```

#### Protection Rule for `dev` Branch

```yaml
Branch name pattern: dev
Settings:
  ✅ Restrict pushes that create files larger than 100MB
  ✅ Require a pull request before merging
    ✅ Require approvals: 1 (minimum)
    ✅ Dismiss stale PR approvals when new commits are pushed
  ✅ Require status checks to pass before merging
    ✅ Require branches to be up to date before merging
    Required status checks:
      - test (CI/CD Pipeline)
  ✅ Require conversation resolution before merging
  ✅ Include administrators
```

## 🔄 Workflow Enforcement

### Automated Checks

Our CI/CD pipeline automatically runs:
- Unit tests (Jest + pytest)
- Integration tests
- Linting (ESLint + Black + isort)
- Type checking (TypeScript + mypy)
- Security scans

### Manual Review Requirements

#### For `dev` branch merges:
- [ ] Code review by team member
- [ ] All automated checks pass
- [ ] Documentation updated (if needed)
- [ ] Tests added for new functionality

#### For `main` branch merges:
- [ ] All dev branch requirements met
- [ ] Integration testing completed on dev
- [ ] Release notes prepared
- [ ] Admin/maintainer approval

## 🚨 Emergency Procedures

### Hotfix Process

For critical production issues:

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue-description

# 2. Make minimal fix
# ... implement fix ...

# 3. Test thoroughly
npm run test
npm run git:prepare-pr

# 4. Create PR to main (emergency approval)
git push origin hotfix/critical-issue-description

# 5. After merge, sync with dev
git checkout dev
git pull origin main  # Fast-forward or merge main into dev
```

### Branch Protection Override

In extreme emergencies, administrators can:
1. Temporarily disable branch protection
2. Make direct commits
3. Re-enable protection immediately
4. Document the override in incident reports

## 📋 Compliance Checklist

Before enabling branch protection:

- [ ] CI/CD pipeline is working correctly
- [ ] All team members understand the workflow
- [ ] Emergency procedures are documented
- [ ] Code owners file is configured (`.github/CODEOWNERS`)
- [ ] Status checks are properly configured

### CODEOWNERS Configuration

Create `.github/CODEOWNERS`:

```
# Global ownership
* @writigo-maintainers

# Frontend components
apps/editor/ @frontend-team
apps/web-ui/ @frontend-team

# Backend services
apps/api/ @backend-team
services/ @backend-team

# Documentation
docs/ @documentation-team
*.md @documentation-team

# Infrastructure
.github/ @devops-team
docker/ @devops-team
scripts/ @devops-team
```

## 🔧 Local Development Setup

### Git Hooks (Optional)

Add pre-commit hooks to enforce standards locally:

```bash
# Install pre-commit
pip install pre-commit

# Setup hooks
pre-commit install
```

Create `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-json
      - id: check-yaml
      
  - repo: https://github.com/psf/black
    rev: 23.7.0
    hooks:
      - id: black
        language_version: python3
        
  - repo: https://github.com/pycqa/isort
    rev: 5.12.0
    hooks:
      - id: isort
```

This ensures code quality before commits reach the remote repository.

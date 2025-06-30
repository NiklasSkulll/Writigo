#!/usr/bin/env node

/**
 * Git Health Check Utility
 * Validates repository state and checks for common issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    return null;
  }
}

function checkGitStatus() {
  console.log('🔍 Checking Git repository status...\n');
  
  const checks = [];

  // Check if we're in a git repository
  const isGitRepo = runCommand('git rev-parse --is-inside-work-tree');
  if (!isGitRepo) {
    console.error('❌ Not in a Git repository');
    return false;
  }
  checks.push({ name: 'Git repository', status: 'pass' });

  // Check current branch
  const currentBranch = runCommand('git branch --show-current');
  console.log(`📍 Current branch: ${currentBranch}`);
  checks.push({ name: 'Current branch', status: 'info', value: currentBranch });

  // Check for uncommitted changes
  const status = runCommand('git status --porcelain');
  if (status) {
    console.log('⚠️  Uncommitted changes detected:');
    console.log(status);
    checks.push({ name: 'Uncommitted changes', status: 'warning' });
  } else {
    console.log('✅ Working directory clean');
    checks.push({ name: 'Working directory', status: 'pass' });
  }

  // Check for untracked files that might be sensitive
  const untrackedFiles = runCommand('git ls-files --others --exclude-standard');
  if (untrackedFiles) {
    const sensitivePatterns = ['.env', 'secrets', 'password', 'key', 'token'];
    const sensitiveFiles = untrackedFiles.split('\n').filter(file => 
      sensitivePatterns.some(pattern => file.toLowerCase().includes(pattern))
    );
    
    if (sensitiveFiles.length > 0) {
      console.log('🚨 Potentially sensitive untracked files:');
      sensitiveFiles.forEach(file => console.log(`   ${file}`));
      checks.push({ name: 'Sensitive files', status: 'error' });
    }
  }

  // Check for large files
  const largeFiles = runCommand('git ls-files | xargs ls -la | awk \'$5 > 10485760 {print $9, $5}\'');
  if (largeFiles) {
    console.log('⚠️  Large files detected (>10MB):');
    console.log(largeFiles);
    checks.push({ name: 'Large files', status: 'warning' });
  }

  // Check if current branch is up to date with remote
  const remoteCommit = runCommand(`git rev-parse origin/${currentBranch}`);
  const localCommit = runCommand('git rev-parse HEAD');
  
  if (remoteCommit && remoteCommit !== localCommit) {
    console.log('⚠️  Local branch is out of sync with remote');
    checks.push({ name: 'Remote sync', status: 'warning' });
  } else if (remoteCommit) {
    console.log('✅ Branch is up to date with remote');
    checks.push({ name: 'Remote sync', status: 'pass' });
  }

  // Check .gitignore patterns
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    const requiredPatterns = ['node_modules/', '.env', 'vaults/', 'user-data/'];
    const missingPatterns = requiredPatterns.filter(pattern => 
      !gitignoreContent.includes(pattern)
    );
    
    if (missingPatterns.length > 0) {
      console.log('⚠️  Missing .gitignore patterns:');
      missingPatterns.forEach(pattern => console.log(`   ${pattern}`));
      checks.push({ name: 'Gitignore patterns', status: 'warning' });
    } else {
      console.log('✅ .gitignore patterns look good');
      checks.push({ name: 'Gitignore patterns', status: 'pass' });
    }
  }

  // Summary
  console.log('\n📊 Health Check Summary:');
  const passed = checks.filter(c => c.status === 'pass').length;
  const warnings = checks.filter(c => c.status === 'warning').length;
  const errors = checks.filter(c => c.status === 'error').length;
  
  console.log(`✅ Passed: ${passed}`);
  if (warnings > 0) console.log(`⚠️  Warnings: ${warnings}`);
  if (errors > 0) console.log(`❌ Errors: ${errors}`);
  
  return errors === 0;
}

// Run the health check
const isHealthy = checkGitStatus();
process.exit(isHealthy ? 0 : 1);

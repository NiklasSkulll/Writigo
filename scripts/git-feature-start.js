#!/usr/bin/env node

/**
 * Git Feature Start Utility
 * Creates a new feature branch following Writigo conventions
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createFeatureBranch() {
  try {
    // Get feature name from command line or prompt
    const featureName = process.argv[2];
    
    if (!featureName) {
      console.log('Usage: npm run git:feature-start <feature-name>');
      console.log('Example: npm run git:feature-start editor-markdown-parser');
      process.exit(1);
    }

    // Validate feature name format
    if (!/^[a-z0-9-]+$/.test(featureName)) {
      console.error('❌ Feature name must be lowercase with hyphens only');
      console.error('Example: editor-markdown-parser, api-search-endpoint');
      process.exit(1);
    }

    // Ensure we're on dev branch
    console.log('🔄 Checking out dev branch...');
    execSync('git checkout dev', { stdio: 'inherit' });

    // Pull latest changes
    console.log('📥 Pulling latest changes...');
    execSync('git pull origin dev', { stdio: 'inherit' });

    // Create feature branch
    const branchName = `feature/${featureName}`;
    console.log(`🌟 Creating feature branch: ${branchName}`);
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });

    console.log(`✅ Successfully created feature branch: ${branchName}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Make your changes');
    console.log('2. Commit with conventional format: feat(scope): description');
    console.log('3. Run: npm run git:prepare-pr');
    console.log('4. Push: git push origin feature/your-feature-name');
    console.log('5. Create Pull Request to dev branch');
    console.log('6. After merge to dev, create PR from dev to main');

  } catch (error) {
    console.error('❌ Error creating feature branch:', error.message);
    process.exit(1);
  }
}

createFeatureBranch().finally(() => rl.close());

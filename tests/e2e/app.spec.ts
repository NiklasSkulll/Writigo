import { test, expect } from '@playwright/test';

test.describe('Writigo Application', () => {
  test('should load the main application', async ({ page }) => {
    await page.goto('/');
    
    // Check if the main application loads
    await expect(page).toHaveTitle(/Writigo/);
  });

  test('should be able to create a new document', async ({ page }) => {
    await page.goto('/');
    
    // Click new document button
    await page.click('[data-testid="new-document"]');
    
    // Type in the editor
    await page.fill('[data-testid="markdown-editor"]', '# Hello World\n\nThis is a test document.');
    
    // Save the document
    await page.click('[data-testid="save-document"]');
    
    // Verify document was saved
    await expect(page.locator('[data-testid="document-title"]')).toHaveText('Hello World');
  });

  test('should support markdown preview', async ({ page }) => {
    await page.goto('/');
    
    // Create a document with markdown
    await page.click('[data-testid="new-document"]');
    await page.fill('[data-testid="markdown-editor"]', '# Test\n\n**Bold text**');
    
    // Toggle preview mode
    await page.click('[data-testid="preview-toggle"]');
    
    // Check if markdown is rendered
    await expect(page.locator('[data-testid="markdown-preview"] h1')).toHaveText('Test');
    await expect(page.locator('[data-testid="markdown-preview"] strong')).toHaveText('Bold text');
  });

  test('should support file tree navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check if file tree is visible
    await expect(page.locator('[data-testid="file-tree"]')).toBeVisible();
    
    // Expand a folder
    await page.click('[data-testid="folder-toggle"]:first-child');
    
    // Click on a file
    await page.click('[data-testid="file-item"]:first-child');
    
    // Verify file content loads
    await expect(page.locator('[data-testid="markdown-editor"]')).not.toBeEmpty();
  });
});

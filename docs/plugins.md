# Plugin Development Guide

## 🔌 Writigo Plugin System

Writigo's plugin architecture allows you to extend functionality across all components of the system.

## Plugin Types

### 1. Editor Plugins
Extend the Electron editor with custom functionality:

```typescript
// src/plugins/my-plugin/index.ts
import { EditorPlugin } from '@writigo/types'

export default class MyPlugin implements EditorPlugin {
  name = 'my-plugin'
  version = '1.0.0'
  
  activate(editor: EditorContext) {
    // Plugin initialization
    editor.registerCommand('my-command', this.handleCommand)
  }
  
  deactivate() {
    // Cleanup when plugin is disabled
  }
  
  private handleCommand = (args: any) => {
    // Command implementation
  }
}
```

### 2. Processing Plugins
Extend document processing pipeline:

```python
# services/ingestion/plugins/my_processor.py
from writigo.plugins import ProcessorPlugin

class MyProcessor(ProcessorPlugin):
    name = "my-processor"
    supported_formats = [".myformat"]
    
    def process(self, content: str, metadata: dict) -> ProcessedDocument:
        # Process custom file format
        return ProcessedDocument(
            content=processed_content,
            chunks=chunks,
            metadata=enhanced_metadata
        )
```

### 3. Search Plugins
Custom search and retrieval logic:

```python
# apps/api/plugins/my_search.py
from writigo.plugins import SearchPlugin

class MySearch(SearchPlugin):
    name = "my-search"
    
    async def search(self, query: str, context: SearchContext) -> SearchResults:
        # Custom search implementation
        return SearchResults(results=results, metadata=metadata)
```

## Plugin Development Workflow

### 1. Setup Development Environment
```bash
# Create plugin directory
mkdir -p plugins/my-plugin
cd plugins/my-plugin

# Initialize plugin
npm init @writigo/plugin
# or
python -m writigo.cli create-plugin my-plugin
```

### 2. Implement Plugin Interface
```typescript
// For TypeScript plugins
export interface WritigoPlugin {
  name: string
  version: string
  description?: string
  author?: string
  dependencies?: string[]
  
  activate(context: PluginContext): void | Promise<void>
  deactivate(): void | Promise<void>
}
```

### 3. Register Plugin
```json
// plugin.json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My awesome plugin",
  "main": "dist/index.js",
  "writigo": {
    "compatibility": "^1.0.0",
    "type": "editor",
    "permissions": ["filesystem", "api"]
  }
}
```

### 4. Testing Plugins
```typescript
// __tests__/plugin.test.ts
import { createMockEditor } from '@writigo/testing'
import MyPlugin from '../src/index'

describe('MyPlugin', () => {
  it('should activate successfully', async () => {
    const editor = createMockEditor()
    const plugin = new MyPlugin()
    
    await plugin.activate(editor)
    
    expect(editor.commands.has('my-command')).toBe(true)
  })
})
```

## Plugin API Reference

### Editor Context
```typescript
interface EditorContext {
  // Document management
  getCurrentDocument(): Document | null
  openDocument(path: string): Promise<Document>
  saveDocument(doc: Document): Promise<void>
  
  // UI extensions
  registerCommand(id: string, handler: CommandHandler): void
  addMenuItem(menu: MenuItem): void
  addStatusBarItem(item: StatusBarItem): void
  
  // Events
  onDocumentChange(handler: (doc: Document) => void): void
  onSelectionChange(handler: (selection: Selection) => void): void
}
```

### Processing Context
```python
class ProcessingContext:
    def get_config(self, key: str) -> Any:
        """Get plugin configuration value"""
        
    def log(self, message: str, level: str = "info"):
        """Plugin logging"""
        
    def emit_event(self, event: str, data: dict):
        """Emit custom events"""
```

## Publishing Plugins

### 1. Package Plugin
```bash
# TypeScript plugins
npm run build
npm pack

# Python plugins  
python setup.py sdist bdist_wheel
```

### 2. Submit to Plugin Registry
```bash
# Submit to Writigo plugin registry
writigo plugin publish ./my-plugin
```

### 3. Plugin Manifest
```yaml
# .writigo/plugin.yml
name: my-plugin
version: 1.0.0
description: "My awesome plugin"
author: "Your Name"
license: "MIT"
homepage: "https://github.com/username/my-plugin"
keywords: ["markdown", "productivity"]
compatibility: ">=1.0.0"
```

## Best Practices

### Security
- Request minimal permissions required
- Validate all user inputs
- Use secure communication channels
- Follow principle of least privilege

### Performance
- Lazy load heavy dependencies
- Use efficient algorithms for text processing
- Cache expensive operations
- Avoid blocking the main thread

### User Experience
- Provide clear error messages
- Include comprehensive documentation
- Support keyboard shortcuts
- Follow Writigo's design guidelines

## Example Plugins

### Table of Contents Generator
```typescript
export default class TOCPlugin implements EditorPlugin {
  activate(editor: EditorContext) {
    editor.registerCommand('generate-toc', () => {
      const doc = editor.getCurrentDocument()
      if (!doc) return
      
      const headings = this.extractHeadings(doc.content)
      const toc = this.generateTOC(headings)
      
      editor.insertText(toc)
    })
  }
  
  private extractHeadings(content: string): Heading[] {
    // Extract markdown headings
  }
  
  private generateTOC(headings: Heading[]): string {
    // Generate table of contents
  }
}
```

### Custom File Processor
```python
class PDFProcessor(ProcessorPlugin):
    def can_process(self, file_path: str) -> bool:
        return file_path.endswith('.pdf')
    
    def process(self, file_path: str) -> ProcessedDocument:
        # Extract text from PDF
        text = self.extract_pdf_text(file_path)
        
        # Create semantic chunks
        chunks = self.create_chunks(text)
        
        return ProcessedDocument(
            content=text,
            chunks=chunks,
            metadata={'format': 'pdf', 'pages': len(pages)}
        )
```

## Debugging Plugins

### Development Tools
```bash
# Enable debug mode
export WRITIGO_DEBUG=true

# Plugin-specific logging
export WRITIGO_PLUGIN_DEBUG=my-plugin

# Run with debugging
npm run dev:debug
```

### Plugin Inspector
Access plugin development tools:
- Plugin Console: `Ctrl+Shift+P` → "Plugin Console"
- Plugin Inspector: `View` → `Plugin Inspector`
- Error Logs: `Help` → `Show Plugin Logs`

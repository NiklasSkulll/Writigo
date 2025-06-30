# File Watcher Service

Python service that monitors file system changes in vault directories.

## Features

- Watch multiple vault directories
- Debounced file change detection
- Integration with ingestion pipeline
- Support for multiple file formats

## Usage

```bash
python main.py --vault-path /path/to/vault
```

## Configuration

Set environment variables in `.env`:
- `VAULT_PATH`: Default vault directory
- `WATCH_EXTENSIONS`: File extensions to monitor
- `DEBOUNCE_SECONDS`: Debounce delay for rapid changes

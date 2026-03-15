# AGENTS.md - Tauri + Vue + TypeScript Desktop App

This document provides guidelines for AI coding agents working in this repository.

## Technology Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Backend**: Rust (via Tauri 2)
- **Package manager**: pnpm

## Build, Lint, and Test Commands

### Development
```bash
pnpm tauri dev          # Start full dev environment (Vite + Tauri)
pnpm dev                 # Start only Vite dev server (port 1420)
```

### Build
```bash
pnpm tauri build         # Build full desktop application
pnpm build               # Build frontend only (type check + Vite build)
pnpm preview             # Preview built frontend
```

### Type Checking
```bash
pnpm build               # Runs vue-tsc --noEmit for type checking
```

### Testing
- No test framework currently configured
- No linting configured

## Code Style Guidelines

### Imports (TypeScript/Vue)
- Use ES modules (import/export)
- Group imports: external first, then internal
- Use type-only imports for types: `import type { SomeType } from 'module'`

### TypeScript
- Strict mode enabled (strict: true)
- No unused locals (noUnusedLocals: true)
- No unused parameters (noUnusedParameters: true)
- No implicit returns (noImplicitReturns: true)
- No fallthrough in switch (noFallthroughCasesInSwitch: true)

### Naming Conventions
- **Vue components**: PascalCase (App.vue)
- **TypeScript files**: camelCase or PascalCase
- **Functions**: camelCase
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Rust**: Follow Rust conventions (snake_case for functions/variables, PascalCase for types)

### Vue Single-File Components (SFCs)
- Use `<script setup>` syntax
- Component files should be PascalCase
- Props and emits should be TypeScript-typed

### Rust Code
- Edition 2021
- Tauri commands marked with `#[tauri::command]`
- Use `serde` for serialization with `#[derive(Serialize, Deserialize)]`
- Follow standard Rust formatting (rustfmt)

### Error Handling
- Rust: Use Result type for fallible operations
- TypeScript: Use try/catch for async operations
- Tauri commands should propagate errors properly

## Project Structure

```
├── src/                    # Frontend source
│   ├── main.ts            # Vue app entry point
│   ├── App.vue            # Main Vue component
│   ├── assets/            # Static assets
│   └── vite-env.d.ts      # Vite type definitions
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── lib.rs         # Tauri commands and app setup
│   │   └── main.rs        # Rust entry point
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
├── package.json           # Frontend dependencies
├── tsconfig.json          # TypeScript config
└── vite.config.ts         # Vite config
```

## Tauri-Specific Guidelines

- Frontend runs on port 1420 in dev mode
- HMR on port 1421 if TAURI_DEV_HOST is set
- Use `@tauri-apps/api` for Tauri-specific functionality
- Rust commands are invoked via `invoke('command_name', payload)`
- Frontend output goes to `../dist` relative to src-tauri

## Key Files to Reference

- `src/App.vue`: Example of Tauri command invocation
- `src-tauri/src/lib.rs`: Example Tauri command implementation
- `vite.config.ts`: Vite + Tauri dev server configuration
- `tsconfig.json`: TypeScript strict mode settings

## IDE Setup (from README)

- VS Code + Volar + Tauri + rust-analyzer
- Enable Volar's Take Over mode for full .vue type support

## No Existing AI Rules

No .cursorrules, .copilot*, or similar AI configuration files found.

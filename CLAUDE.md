# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Technology Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Backend**: Rust (via Tauri 2)
- **Package manager**: pnpm

## Common Commands

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

### Testing & Linting
- No test framework currently configured
- No linting configured

## High-Level Architecture

This is a Tauri 2 desktop application with a standard two-layer architecture:

1. **Frontend Layer**: Vue 3 single-page application running in a system webview
   - Entry point: `src/main.ts`
   - Main component: `src/App.vue`
   - Built with Vite to `dist/` directory

2. **Backend Layer**: Rust binary that manages the system window
   - Entry point: `src-tauri/src/main.rs`
   - Tauri commands: `src-tauri/src/lib.rs`
   - Dependencies: `src-tauri/Cargo.toml`

3. **IPC Communication**: Frontend invokes Rust commands via Tauri's `invoke()` API
   - Commands are marked with `#[tauri::command]` attribute in Rust
   - Type-safe JSON serialization via Serde

## Project Structure

```
├── src/                    # Frontend Vue application
│   ├── main.ts            # Vue app entry point
│   ├── App.vue            # Main Vue component with Tauri integration
│   ├── assets/            # Static assets
│   └── vite-env.d.ts      # Vite/TypeScript type definitions
├── src-tauri/             # Rust backend and Tauri configuration
│   ├── src/
│   │   ├── lib.rs         # Tauri command implementations
│   │   └── main.rs        # Rust application entry point
│   ├── capabilities/      # Tauri permission profiles
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri application configuration
├── package.json           # Frontend dependencies and scripts
├── tsconfig.json          # TypeScript strict configuration
└── vite.config.ts         # Vite build configuration
```

## Key Conventions

- **Vue components**: Use `<script setup>` syntax with TypeScript
- **TypeScript**: Strict mode enabled with all strict type-checking rules
- **Rust**: Follow standard Rust conventions, Edition 2021
- **Tauri commands**: Defined in `src-tauri/src/lib.rs` with `#[tauri::command]`
- **Dev server port**: 1420

## Key Files to Reference

- `src/App.vue`: Example of Tauri command invocation pattern
- `src-tauri/src/lib.rs`: Example Tauri command implementation
- `AGENTS.md`: Additional detailed guidelines for AI coding assistants

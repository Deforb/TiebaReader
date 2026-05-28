# TiebaReader AI Agent Instructions

This project is a multi-page cross-platform desktop application built with **Electron**, **Vue 3** (Composition API), **Vite**, and **TypeScript**. 

## 1. Project Architecture

- **Main Process (`src/main/`)**:
  - Contains Electron's background logic.
  - Implements a strict layered architecture (`dao`, `services`, `pojo`, `dto`, `vo`) combined with Dependency Injection using `inversify`.
  - Local database is powered by `better-sqlite3`. When adding or changing SQLite schema/dependencies, ensure native rebuilds are handled.
  - Inter-Process Communication (IPC) logic is centralized in `src/main/ipcMain/` and passed through `src/main/preload/`.
- **Render Process (`src/render/`)**:
  - Contains Vite-driven front-end multi-page logic.
  - Two main entry points: First is the main application window (`src/render/App.vue`), second is the standalone thread window (`src/render/thread/App.vue`).
  - Uses `element-plus` for UI components. Highly customized component blocks are located in `src/render/components/`.

## 2. Dev & Build Commands

Always use standard predefined scripts in `package.json` for running or building the app:

- `npm run dev` - Start development servers concurrently for both the render process (Vite) and the main process (Electron + TS).
- `npm run rebuild` - Run this command to rebuild native ABI dependencies (like `better-sqlite3`) for Electron after `npm install`.
- `npm run build` - Full production build for both processes.
- `npm run release:win` (or `:mac`, `:linux`) - Package the application via `electron-builder`.

## 3. Development Guidelines

- **TypeScript Restrictions**: Ensure strong typing. Do not use `any` unless absolutely necessary.
- **Dependency Injection**: When adding new Services or DAOs in the main process, always bind them in the DI container (`src/main/container/`) via `inversify`.
- **Vue 3 Conventions**: For rendering tasks, use script setup `<script setup>` syntax and Composition API.
- **Reference Docs**: 
  - Consult [docs/learn.md](docs/learn.md) for related tech tips and patterns.
  - Consult [docs/tieba.md](docs/tieba.md) for custom scraped tieba-related domain knowledge.

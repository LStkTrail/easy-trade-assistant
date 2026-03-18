# Tauri 介绍

## 什么是 Tauri？

Tauri 是一个用于构建小巧、快速的二进制程序的框架，支持所有主流桌面平台。开发者可以集成任何能编译为 HTML、JavaScript 和 CSS 的前端框架来构建用户界面，并在需要时利用 Rust 处理后端逻辑。

## 核心特性

### 1. 轻量级
- **小巧的体积**：不捆绑完整的浏览器引擎，使用系统原生 WebView
- **快速启动**：基于 Rust 的高效运行时
- **低内存占用**：相比 Electron 等方案显著减少资源消耗

### 2. 安全性
- **细粒度权限控制**：通过 capability 系统精确控制 API 访问
- **CSP（内容安全策略）**：内置安全防护
- **进程隔离**：前端与后端分离架构

### 3. 灵活性
- **任意前端框架**：支持 React、Vue、Svelte、Angular 等
- **Rust 后端**：利用 Rust 的性能和安全性
- **跨平台**：支持 Windows、macOS、Linux

### 4. 可扩展性
- **插件系统**：通过插件扩展功能
- **自定义命令**：轻松创建前后端通信接口
- **原生能力**：访问系统 API 和原生功能

## 架构概览

```
┌─────────────────────────────────────────┐
│         Frontend (Web UI)               │
│  HTML / CSS / JavaScript / TypeScript   │
│  React / Vue / Svelte / etc.            │
└────────────────────┬────────────────────┘
                     │ IPC
                     ▼
┌─────────────────────────────────────────┐
│         Tauri Core (Rust)               │
│  ┌──────────┐  ┌──────────────────┐   │
│  │ Commands │  │   Plugin System  │   │
│  └──────────┘  └──────────────────┘   │
│  ┌──────────────────────────────────┐  │
│  │    Window / Webview Management    │  │
│  └──────────────────────────────────┘  │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│      System WebView + Native APIs       │
│  Windows (WebView2)                     │
│  macOS (WKWebView)                      │
│  Linux (WebKitGTK)                      │
└─────────────────────────────────────────┘
```

## 技术栈

### 前端
- **@tauri-apps/api**：TypeScript 库，提供与后端通信的 API
- **@tauri-apps/cli**：Node.js 封装的 CLI 工具

### 后端
- **tauri**：核心库
- **tauri-runtime**：运行时抽象层
- **tauri-runtime-wry**：WRY 运行时实现
- **tauri-macros**：过程宏
- **tauri-utils**：工具库
- **tauri-build**：构建工具

### 外部依赖
- **TAO**：跨平台窗口创建库（winit 的分支）
- **WRY**：跨平台 WebView 渲染库

## 版本信息

本文档基于 Tauri 2.x 版本：

| 包名 | 版本 |
|------|------|
| @tauri-apps/api | 2.10.1 |
| @tauri-apps/cli | 2.10.1 |
| tauri | 2.10.3 |
| tauri-build | 2.5.6 |
| tauri-runtime | 2.10.1 |
| tauri-utils | 2.8.3 |

## 为什么选择 Tauri？

### 相比 Electron
- **更小的安装包**：通常 < 10MB，而 Electron 通常 > 100MB
- **更低的内存占用**：节省 50% 以上的内存
- **更好的性能**：Rust 后端提供更高效的执行

### 安全性考虑
- **默认安全**：需要显式启用权限
- **Capability 系统**：精细控制 API 访问
- **审计友好**：清晰的权限边界

## 学习资源

- 本文档：基于实际代码的完整指南
- 代码示例：查看仓库中的 `examples/` 目录
- API 参考：详细的类型定义和文档注释

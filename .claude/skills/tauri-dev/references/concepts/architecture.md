# 架构概述

本文档详细说明 Tauri 的内部架构，基于实际代码实现。

## 整体架构

Tauri 采用分层架构设计，将前端 Web 技术与 Rust 后端完美结合。

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │
│  │  React   │  │   Vue    │  │  Any Web Framework   │ │
│  └──────────┘  └──────────┘  └──────────────────────┘ │
│  ┌──────────────────────────────────────────────────┐  │
│  │          @tauri-apps/api (TypeScript)            │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────┘
                             │ IPC (Webview IPC)
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   Tauri Core (Rust)                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │              tauri (Core Library)                   │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │ │
│  │  │  IPC     │  │ Commands │  │  Window  │        │ │
│  │  └──────────┘  └──────────┘  └──────────┘        │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │ │
│  │  │  State   │  │  Events  │  │ Plugins  │        │ │
│  │  └──────────┘  └──────────┘  └──────────┘        │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │              tauri-runtime (Abstraction)           │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │  Runtime Traits:                               │ │ │
│  │  │  - Runtime                                     │ │ │
│  │  │  - WindowDispatch                              │ │ │
│  │  │  - WebviewDispatch                             │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │         tauri-runtime-wry (Implementation)         │ │
│  └────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 System Layer                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Windows   │  │    macOS    │  │    Linux    │   │
│  │  WebView2   │  │  WKWebView  │  │ WebKitGTK   │   │
│  └─────────────┘  └─────────────┘  └─────────────┘   │
│  ┌────────────────────────────────────────────────────┐ │
│  │                    TAO (Windowing)                  │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 核心 Crates

### 1. tauri (核心库)

**位置**: `crates/tauri/`

这是 Tauri 的主库，负责：
- 应用初始化和生命周期管理
- IPC 消息路由
- 命令注册和调用
- 窗口和 Webview 管理
- 插件系统
- 状态管理

**关键文件**:
- `src/lib.rs` - 主库导出和核心类型
- `src/app.rs` - 应用管理器
- `src/manager/mod.rs` - 窗口和 Webview 管理
- `src/ipc/mod.rs` - IPC 处理
- `src/plugin.rs` - 插件系统

### 2. tauri-runtime (运行时抽象)

**位置**: `crates/tauri-runtime/`

定义了核心运行时 trait，抽象了平台特定细节：

**关键 Trait**:
- `Runtime` - 窗口和 Webview 运行时的主接口
- `WindowDispatch` - 线程安全的窗口 API 句柄
- `WebviewDispatch` - 线程安全的 Webview API 句柄

### 3. tauri-runtime-wry (WRY 实现)

**位置**: `crates/tauri-runtime-wry/`

使用 WRY 库实现的平台特定运行时：
- Windows: WebView2
- macOS: WKWebView
- Linux: WebKitGTK

### 4. tauri-macros (过程宏)

**位置**: `crates/tauri-macros/`

提供关键的过程宏：

**主要宏**:
- `#[tauri::command]` - 将函数标记为 Tauri 命令
- `generate_handler!` - 从命令函数生成 IPC 处理器
- `tauri_build_context!` - 构建时配置上下文

### 5. tauri-utils (工具库)

**位置**: `crates/tauri-utils/`

共享工具函数：
- 配置解析 (JSON, JSON5, TOML)
- 平台检测
- 资产管理
- HTML 操作和 CSP 处理
- MIME 类型检测

### 6. tauri-codegen (代码生成)

**位置**: `crates/tauri-codegen/`

处理编译时代码生成：
- 嵌入和压缩应用资源
- 从 `tauri.conf.json` 生成配置结构体
- 处理图标和静态资源

### 7. tauri-build (Cargo 集成)

**位置**: `crates/tauri-build/`

提供 Cargo 构建集成：
- 设置 Tauri 项目的构建脚本
- 处理 cargo 元数据和环境变量
- 基于 tauri.conf.json 配置构建特性

### 8. tauri-cli (命令行工具)

**位置**: `crates/tauri-cli/`

官方 CLI 工具，提供：
- 项目创建和初始化
- 构建和运行命令
- 打包和分发应用
- 开发服务器集成和热重载
- 插件管理和 schema 生成

### 9. tauri-bundler (应用打包)

**位置**: `crates/tauri-bundler/`

将 Tauri 应用打包为目标平台格式：
- 创建平台特定的安装程序和包
- 处理代码签名和公证
- 优化二进制大小和性能

### 10. tauri-plugin (插件系统)

**位置**: `crates/tauri-plugin/`

定义插件系统架构：
- Plugin trait 定义
- 插件生命周期管理
- 命令和 API 扩展注册
- 插件状态管理

## JavaScript/TypeScript 包

### @tauri-apps/api

**位置**: `packages/api/src/`

TypeScript 前端 API 库，提供 WebView 到后端通信的接口。

**主要模块**:
- `core.ts` - 核心功能 (invoke, transformCallback)
- `window.ts` - 窗口控制
- `webview.ts` - Webview API
- `event.ts` - 事件系统
- `app.ts` - 应用生命周期
- `path.ts` - 文件系统路径工具
- `menu.ts` - 菜单 API
- `tray.ts` - 系统托盘 API

### @tauri-apps/cli

**位置**: `packages/cli/`

Node.js 封装的 Rust CLI，使用 napi-rs。

## 应用启动流程

基于代码分析，Tauri 应用的启动流程如下：

```
1. tauri::Builder::default()
   ↓
2. 配置 Builder (注册命令、插件等)
   ↓
3. .run(tauri::generate_context!())
   ↓
4. tauri-codegen 处理 tauri.conf.json
   ↓
5. 初始化 Runtime (tauri-runtime-wry)
   ↓
6. 创建主窗口和 Webview
   ↓
7. 加载前端资源
   ↓
8. IPC 通道建立
   ↓
9. 应用就绪
```

## IPC 通信流程

```
前端 (TypeScript)
    ↓ invoke('command_name', args)
    ↓ 序列化 JSON
Webview IPC
    ↓
Rust 后端
    ↓ 路由到对应命令
    ↓ 反序列化参数
    ↓ 执行命令函数
    ↓ 序列化结果
    ↓
Webview IPC
    ↓
前端 (TypeScript)
    ↓ Promise.resolve(result)
```

## 关键设计模式

### 1. Builder 模式

`tauri::Builder` 使用 Builder 模式配置应用：

```rust
tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![...])
    .plugin(...)
    .setup(|app| { ... })
    .run(...)
```

### 2. 命令模式

通过 `#[tauri::command]` 宏将普通 Rust 函数转换为 IPC 可调用命令。

### 3. 状态管理

使用 `State<T>` 和 `Manager::manage()` 进行应用状态管理。

### 4. 事件驱动

全局事件系统支持跨上下文通信。

### 5. 插件系统

通过 Plugin trait 扩展 Tauri 功能。

## 外部依赖

### TAO

跨平台窗口创建库，winit 的分支，由 Tauri Apps 维护。

**职责**:
- 跨平台窗口管理
- 事件处理
- 高 DPI 支持

### WRY

跨平台 WebView 渲染库，由 Tauri Apps 维护。

**职责**:
- 抽象平台特定 WebView API
- Webview 与原生代码通信
- 自定义协议和 URI 方案支持

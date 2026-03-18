# Tauri 2.x 完整开发指南

基于实际代码实现的权威开发参考文档

---

## 📚 文档概览

本文档基于 Tauri 2.x 代码库编写，提供准确、完整的开发指引。

### 版本信息

| 包名 | 版本 |
|------|------|
| @tauri-apps/api | 2.10.1 |
| @tauri-apps/cli | 2.10.1 |
| tauri | 2.10.3 |
| tauri-build | 2.5.6 |
| tauri-runtime | 2.10.1 |

---

## 📖 本文档使用教程

### 1. 初次阅读：按顺序学习

如果你是第一次接触 Tauri，建议按以下顺序阅读：

```
第 1 步：了解 Tauri
├─ [介绍](./introduction.md) → 了解 Tauri 是什么，核心特性

第 2 步：配置环境
├─ [环境配置](./setup.md) → 安装 Rust、Node.js、pnpm 等

第 3 步：创建第一个应用
├─ [快速开始](./quick-start.md) → 从零开始创建 Tauri 应用

第 4 步：理解核心概念
├─ [架构概述](./concepts/architecture.md) → 理解整体架构
├─ [应用生命周期](./concepts/app-lifecycle.md) → 应用启动到关闭
├─ [IPC 通信](./concepts/ipc.md) → 前后端通信
├─ [状态管理](./concepts/state.md) → 数据共享
└─ [事件系统](./concepts/events.md) → 事件处理

第 5 步：深入开发
├─ Rust 后端
│  ├─ [命令](./rust/commands.md) → 定义命令
│  ├─ [状态管理](./rust/state.md) → 状态管理
│  ├─ [窗口操作](./rust/window.md) → 窗口控制
│  ├─ [菜单系统](./rust/menu.md) → 菜单开发
│  └─ [系统托盘](./rust/tray.md) → 托盘功能
├─ 前端 API
│  └─ [API 概述](./frontend/api.md) → 前端 API 使用
├─ 配置
│  ├─ [配置文件](./config/tauri-conf.md) → tauri.conf.json
│  └─ [权限系统](./config/permissions.md) → Capabilities
└─ 插件
   └─ [插件概述](./plugins/overview.md) → 插件开发

第 6 步：完整示例
└─ [完整示例应用](./full-example.md) → 整合所有功能
```

### 2. 问题解决：按需查阅

遇到具体问题时，使用以下快速导航：

| 你的问题 | 推荐文档 |
|---------|---------|
| 如何配置开发环境？ | [环境配置](./setup.md) |
| 如何创建 Tauri 项目？ | [快速开始](./quick-start.md) |
| Tauri 是如何工作的？ | [架构概述](./concepts/architecture.md) |
| 前端如何调用 Rust？ | [IPC 通信](./concepts/ipc.md) |
| 如何定义 Rust 命令？ | [命令 (Commands)](./rust/commands.md) |
| 如何共享状态？ | [状态管理](./concepts/state.md) |
| 如何发送和接收事件？ | [事件系统](./concepts/events.md) |
| 如何操作窗口？ | [窗口与 Webview](./concepts/window-webview.md) |
| 如何配置应用？ | [配置文件](./config/tauri-conf.md) |
| 权限报错怎么办？ | [权限系统](./config/permissions.md) |
| 想要完整示例？ | [完整示例应用](./full-example.md) |

### 3. 参考查阅：按主题索引

#### 按功能模块

**入门**
- [介绍](./introduction.md) - Tauri 概述和特性
- [快速开始](./quick-start.md) - 第一个应用
- [环境配置](./setup.md) - 开发环境配置

**核心概念**
- [架构概述](./concepts/architecture.md) - 整体架构
- [应用生命周期](./concepts/app-lifecycle.md) - 生命周期
- [窗口与 Webview](./concepts/window-webview.md) - 窗口管理
- [IPC 通信](./concepts/ipc.md) - 前后端通信
- [状态管理](./concepts/state.md) - 状态管理
- [事件系统](./concepts/events.md) - 事件系统

**Rust 后端**
- [命令 (Commands)](./rust/commands.md) - 命令定义
- [状态管理](./rust/state.md) - 状态管理
- [窗口操作](./rust/window.md) - 窗口 API
- [菜单系统](./rust/menu.md) - 菜单开发
- [系统托盘](./rust/tray.md) - 托盘开发

**前端开发**
- [API 概述](./frontend/api.md) - 前端 API

**配置**
- [配置文件](./config/tauri-conf.md) - tauri.conf.json
- [权限系统](./config/permissions.md) - Capabilities

**插件**
- [插件概述](./plugins/overview.md) - 插件系统

**完整示例**
- [完整示例应用](./full-example.md) - 待办事项应用

### 4. 代码示例：如何使用本文档

#### 示例 1：创建第一个命令

阅读路径：
1. [快速开始](./quick-start.md) - 了解基本结构
2. [命令 (Commands)](./rust/commands.md) - 详细学习命令

```rust
// 从 commands.md 复制的示例
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}
```

#### 示例 2：添加系统托盘

阅读路径：
1. [系统托盘](./rust/tray.md) - 托盘开发指南
2. [完整示例应用](./full-example.md) - 查看完整实现

#### 示例 3：权限配置

阅读路径：
1. [权限系统](./config/permissions.md) - 理解 capabilities
2. [配置文件](./config/tauri-conf.md) - 配置文件说明

### 5. 文档结构

```
docs-guide/
├── README.md                    # 本文档（使用指南）
├── SUMMARY.md                   # 完整目录
├── introduction.md              # 介绍
├── quick-start.md               # 快速开始
├── setup.md                     # 环境配置
├── full-example.md              # 完整示例
│
├── concepts/                    # 核心概念
│   ├── architecture.md          # 架构概述
│   ├── app-lifecycle.md         # 应用生命周期
│   ├── window-webview.md        # 窗口与 Webview
│   ├── ipc.md                   # IPC 通信
│   ├── state.md                 # 状态管理
│   └── events.md                # 事件系统
│
├── rust/                        # Rust 后端开发
│   ├── commands.md              # 命令
│   ├── state.md                 # 状态管理
│   ├── window.md                # 窗口操作
│   ├── menu.md                  # 菜单系统
│   └── tray.md                  # 系统托盘
│
├── frontend/                    # 前端 API 开发
│   └── api.md                   # API 概述
│
├── config/                      # 配置与构建
│   ├── tauri-conf.md            # 配置文件
│   └── permissions.md           # 权限系统
│
└── plugins/                     # 插件开发
    └── overview.md              # 插件概述
```

---

## 🚀 入门指南

新用户从这里开始：

1. **[介绍](./introduction.md)** - 了解 Tauri 是什么，核心特性和架构
2. **[环境配置](./setup.md)** - 配置开发环境的详细步骤
3. **[快速开始](./quick-start.md)** - 创建你的第一个 Tauri 应用

---

## 📖 核心概念

深入理解 Tauri 的工作原理：

- **[架构概述](./concepts/architecture.md)** - 整体架构和核心 Crates 详解
- **[应用生命周期](./concepts/app-lifecycle.md)** - 从启动到关闭的完整流程
- **[窗口与 Webview](./concepts/window-webview.md)** - 窗口管理和操作
- **[IPC 通信](./concepts/ipc.md)** - 前后端通信机制
- **[状态管理](./concepts/state.md)** - Rust 后端状态管理
- **[事件系统](./concepts/events.md)** - 跨上下文事件通信

---

## 🦀 Rust 后端开发

学习如何编写 Rust 后端：

- **[命令 (Commands)](./rust/commands.md)** - 定义和使用 Tauri 命令
- **[状态管理](./rust/state.md)** - 应用状态的管理和共享
- **[窗口操作](./rust/window.md)** - 窗口 API 完整指南
- **[菜单系统](./rust/menu.md)** - 菜单创建和管理
- **[系统托盘](./rust/tray.md)** - 系统托盘开发

---

## 🌐 前端 API 开发

使用 TypeScript 前端 API：

- **[API 概述](./frontend/api.md)** - 前端 API 的完整介绍

---

## ⚙️ 配置与构建

配置和打包你的应用：

- **[配置文件](./config/tauri-conf.md)** - tauri.conf.json 完整配置指南
- **[权限系统](./config/permissions.md)** - Capability 系统详解

---

## 🔌 插件开发

- **[插件概述](./plugins/overview.md)** - 插件系统介绍和开发指南

---

## 📋 完整示例

- **[完整示例应用](./full-example.md)** - 整合所有功能的待办事项应用

---

## 🎯 快速导航

### 我想...

| 目标 | 文档 |
|------|------|
| 快速开始 | [快速开始](./quick-start.md) |
| 了解架构 | [架构概述](./concepts/architecture.md) |
| 学习 IPC | [IPC 通信](./concepts/ipc.md) |
| 写 Rust 命令 | [命令](./rust/commands.md) |
| 配置应用 | [配置文件](./config/tauri-conf.md) |
| 设置权限 | [权限系统](./config/permissions.md) |
| 查看完整示例 | [完整示例应用](./full-example.md) |

---

## 💡 文档特点

### 基于实际代码

本文档所有内容均基于对 Tauri 2.x 实际代码的分析，确保准确性和时效性。

### 完整示例

每个主题都包含完整的、可运行的代码示例。

### 最佳实践

提供基于实际开发经验的最佳实践建议。

---

## 🔗 相关资源

- **Tauri 官方网站**: https://tauri.app
- **GitHub 仓库**: https://github.com/tauri-apps/tauri
- **官方文档**: https://v2.tauri.app (注意：可能包含过时内容)

---

## 📝 贡献

如果你发现文档有误或有改进建议，欢迎提交 Issue 或 PR！

---

## ⚠️ 注意

本文档基于 Tauri 2.x 版本编写。如果你使用的是其他版本，部分内容可能不适用。

---

**开始你的 Tauri 之旅 → [介绍](./introduction.md)**

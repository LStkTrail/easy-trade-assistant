# Tauri 开发技能 (Tauri Dev Skill)

基于 Tauri 2.10.x 实际代码的权威开发参考 Skill。

---

## Skill Metadata

| 字段 | 值 |
|------|-----|
| **Name** | Tauri 开发技能 |
| **ID** | tauri-dev |
| **Version** | 2.10.1 |
| **Author** | Tauri Dev Guide |
| **Categories** | framework, rust, typescript, desktop |

---

## Overview

本 Skill 提供完整的 Tauri 2.x 开发指南，基于对 Tauri 代码库的实际分析。

### Tauri 版本信息

| 包名 | 版本 |
|------|------|
| @tauri-apps/api | 2.10.1 |
| @tauri-apps/cli | 2.10.1 |
| tauri | 2.10.3 |
| tauri-build | 2.5.6 |
| tauri-runtime | 2.10.1 |

---

## Usage

### When to Use

使用本 Skill 当你需要：

- ✅ 创建新的 Tauri 应用
- ✅ 编写 Rust 后端命令
- ✅ 配置 Tauri 应用
- ✅ 实现窗口、菜单、托盘功能
- ✅ 理解 IPC 通信机制
- ✅ 管理应用状态
- ✅ 配置权限系统
- ✅ 开发 Tauri 插件
- ✅ 调试 Tauri 应用问题

### How to Use

#### Method 1: Direct Use

在对话中说：
```
使用 Tauri 开发技能，帮我 [你的需求]
```

#### Method 2: Reference Specific Documentation

```
使用 Tauri 开发技能，参考 references/[文档路径]，帮我 [需求]
```

#### Method 3: Use Prompt Templates

参考 `assets/prompts.md` 中的提示模板，根据你的需求修改使用。

---

## Learning Paths

### Beginner Path

```
1. Getting Started
   ├─ introduction.md → Learn what Tauri is
   ├─ setup.md → Configure development environment
   └─ quick-start.md → Create first app

2. Core Concepts
   ├─ architecture.md → Understand overall architecture
   ├─ app-lifecycle.md → Startup to shutdown
   ├─ ipc.md → Frontend-backend communication
   └─ events.md → Event handling

3. Deep Dive
   ├─ commands.md → Backend development
   ├─ state.md → Data sharing
   ├─ window.md → Window management
   ├─ frontend-api.md → Frontend development
   └─ configuration.md → App configuration
```

### Problem-Solving Path

| Your Problem | Recommended Doc |
|--------------|-----------------|
| How to configure environment? | `setup.md` |
| How to create a project? | `quick-start.md` |
| How to call Rust from frontend? | `ipc.md` |
| How to define commands? | `commands.md` |
| Permission errors? | `permissions.md` |
| Window operations? | `window-webview.md` |
| Menu development? | `menu.md` |
| System tray? | `tray.md` |
| Full example? | `full-example.md` |

---

## Contents

### References Directory

Complete documentation located in `references/`:

#### Getting Started (3)
- **introduction.md** - Tauri overview and features
- **setup.md** - Environment setup (Windows/macOS/Linux)
- **quick-start.md** - Quick start tutorial

#### Core Concepts (6)
- **concepts/architecture.md** - Architecture overview
- **concepts/app-lifecycle.md** - Application lifecycle
- **concepts/window-webview.md** - Window and Webview
- **concepts/ipc.md** - IPC communication
- **concepts/state.md** - State management
- **concepts/events.md** - Event system

#### Rust Backend (5)
- **rust/commands.md** - Command definitions
- **rust/state.md** - State management
- **rust/window.md** - Window API
- **rust/menu.md** - Menu system
- **rust/tray.md** - System tray

#### Frontend API (1)
- **frontend/api.md** - Frontend API overview

#### Configuration (2)
- **config/tauri-conf.md** - Configuration file
- **config/permissions.md** - Capability system

#### Plugins (1)
- **plugins/overview.md** - Plugin overview

#### Full Example (1)
- **full-example.md** - Complete todo app example

#### Navigation (3)
- **README.md** - Documentation usage guide
- **SUMMARY.md** - Documentation table of contents
- **00-文档索引.md** - Documentation index

### Assets Directory

- **prompts.md** - Prompt template library (30+ templates)

---

## Quick Reference Cards

### Rust Command Cheat Sheet

```rust
// Basic command
#[command]
fn greet(name: &str) -> String { }

// With state
#[command]
fn with_state(state: State<MyState>) { }

// With window
#[command]
fn with_window(window: Window) { }

// With AppHandle
#[command]
fn with_app(app: AppHandle) { }

// Async
#[command]
async fn async_cmd() -> String { }

// Return Result
#[command]
fn might_fail() -> Result<String, String> { }
```

### Frontend API Cheat Sheet

```typescript
// Invoke command
import { invoke } from '@tauri-apps/api/core'
await invoke('command', { arg: 'value' })

// Window
import { getCurrentWindow } from '@tauri-apps/api/window'
const window = getCurrentWindow()
await window.setTitle('Title')
await window.setSize({ width: 800, height: 600 })

// Events
import { listen, emit } from '@tauri-apps/api/event'
await emit('event', payload)
const unlisten = await listen('event', handler)

// Paths
import { homeDir, join } from '@tauri-apps/api/path'
const home = await homeDir()
const path = await join('path', 'to', 'file')
```

---

## Examples

### Example 1: Create Rust Command

When you need to create a Rust command, use this pattern:

```rust
use tauri::command;
use serde::{Serialize, Deserialize};

#[derive(Deserialize)]
struct Input {
    name: String,
    value: i32,
}

#[derive(Serialize)]
struct Output {
    success: bool,
    message: String,
}

#[command]
fn my_command(input: Input) -> Result<Output, String> {
    // Process logic
    Ok(Output {
        success: true,
        message: format!("Hello, {}!", input.name),
    })
}

// Register in main.rs
tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![my_command])
    .run(...)
```

### Example 2: Frontend Call

```typescript
import { invoke } from '@tauri-apps/api/core'

interface Input {
  name: string
  value: number
}

interface Output {
  success: boolean
  message: string
}

async function callMyCommand() {
  try {
    const result = await invoke<Output>('my_command', {
      input: {
        name: 'World',
        value: 42
      }
    })
    console.log(result.message)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### Example 3: Permission Configuration

Create `src-tauri/permissions/default.toml`:

```toml
$schema = "../schemas/capability.schema.json"
identifier = "default"
description = "Default permissions"

[permissions.core:default]
allow = [
  { name = "my_command" },
  { name = "another_command" }
]

[permissions.core:window]
allow = ["show", "hide", "set-title"]
```

---

## Notes

1. **Version Match**: This documentation is based on Tauri 2.10.x, other versions may differ
2. **Permission Configuration**: Always configure capabilities properly, avoid using `allow = ["all"]`
3. **Error Handling**: Use Result in Rust commands, try-catch in frontend
4. **Thread Safety**: Use Mutex/RwLock to protect shared state

---

## Related Resources

- **Complete Documentation**: See `references/README.md`
- **Quick Start**: See `references/quick-start.md`
- **Prompt Templates**: See `assets/prompts.md`
- **Tauri Official Site**: https://tauri.app
- **GitHub Repository**: https://github.com/tauri-apps/tauri

---

**Skill is completely self-contained! Copy the entire tauri-dev directory to other projects.**

---

**Get Started → Say "Use Tauri development skill" or see assets/prompts.md!**

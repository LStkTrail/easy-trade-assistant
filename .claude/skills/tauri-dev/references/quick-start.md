# 快速开始

## 前置要求

在开始之前，确保你的系统已安装以下工具：

### 系统依赖

#### Windows
- Microsoft Visual Studio C++ Build Tools
- WebView2（Windows 11 已预装）

#### macOS
- Xcode Command Line Tools
```bash
xcode-select --install
```

#### Linux
- Debian/Ubuntu:
```bash
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

- Fedora:
```bash
sudo dnf install webkit2gtk4.1-devel gtk3-devel libayatana-appindicator-gtk3-devel openssl-devel librsvg2-devel
```

### 开发工具

- **Rust**：1.77.2 或更高版本
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

- **Node.js**：LTS 版本（推荐）
- **pnpm**：包管理器
```bash
npm install -g pnpm
```

## 创建新项目

### 使用 CLI 创建

```bash
# 安装 Tauri CLI
npm install -g @tauri-apps/cli

# 创建新项目
tauri init
```

### 或者使用模板

```bash
# 使用 create-tauri-app
npm create tauri-app@latest
# 或
pnpm create tauri-app
# 或
yarn create tauri-app
```

### 项目结构

创建后的项目结构如下：

```
my-tauri-app/
├── src/                  # 前端源代码
│   ├── index.html
│   ├── main.ts
│   └── style.css
├── src-tauri/           # Rust 后端
│   ├── src/
│   │   └── main.rs      # Rust 入口文件
│   ├── Cargo.toml       # Rust 依赖配置
│   ├── build.rs         # 构建脚本
│   ├── tauri.conf.json  # Tauri 配置文件
│   └── icons/           # 应用图标
├── package.json         # Node.js 依赖配置
└── tsconfig.json        # TypeScript 配置
```

## 开发运行

### 启动开发服务器

```bash
# 安装依赖
pnpm install

# 启动开发模式
pnpm tauri dev
```

这将：
1. 启动前端开发服务器
2. 编译 Rust 后端
3. 打开应用窗口

### 常用命令

```bash
# 仅构建前端
pnpm build

# 构建 Tauri 应用（调试模式）
pnpm tauri build --debug

# 构建 Tauri 应用（发布模式）
pnpm tauri build

# 检查 Rust 代码
cd src-tauri && cargo check
```

## 第一个命令

让我们创建一个简单的 Rust 命令并在前端调用它。

### 步骤 1：定义 Rust 命令

编辑 `src-tauri/src/main.rs`：

```rust
// 引入必要的宏
use tauri::command;

// 定义一个命令
#[command]
fn greet(name: &str) -> String {
    format!("Hello, {}! 你好，欢迎使用 Tauri！", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // 注册命令
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 步骤 2：在前端调用

编辑 `src/main.ts`：

```typescript
import { invoke } from '@tauri-apps/api/core'

// 调用 Rust 命令
async function greet() {
  const name = 'Tauri 开发者'
  const result = await invoke<string>('greet', { name })
  console.log(result)
  document.body.textContent = result
}

greet()
```

### 步骤 3：配置权限

编辑 `src-tauri/permissions/default.toml`：

```toml
[permissions]
# 允许调用 greet 命令
allow = ["core:default"]
```

或者创建一个自定义权限文件：

```toml
# src-tauri/permissions/my-capability.toml
$schema = "../schemas/capability.schema.json"
identifier = "my-capability"
description = "My custom capability"

[permissions.core:default]
allow = [{ name = "greet" }]
```

然后在 `tauri.conf.json` 中引用：

```json
{
  "app": {
    "capabilities": ["my-capability"]
  }
}
```

## 窗口操作示例

让我们添加一些窗口操作：

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 设置标题
await window.setTitle('我的 Tauri 应用')

// 最小化
await window.minimize()

// 最大化
await window.maximize()

// 全屏
await window.setFullscreen(true)

// 监听窗口事件
await window.listen('tauri://resize', ({ payload }) => {
  console.log('窗口大小变化:', payload)
})
```

## 事件系统

### 发送事件

```typescript
import { emit } from '@tauri-apps/api/event'

// 发送事件
await emit('custom-event', { data: 'Hello from frontend!' })
```

### 监听事件

```typescript
import { listen } from '@tauri-apps/api/event'

// 监听事件
const unlisten = await listen<string>('custom-event', (event) => {
  console.log('收到事件:', event.payload)
})

// 取消监听
unlisten()
```

## 下一步

现在你已经创建了第一个 Tauri 应用！接下来可以：

1. 学习 [核心概念](./concepts/architecture.md)
2. 探索 [Rust 后端开发](./rust/commands.md)
3. 了解 [前端 API](./frontend/api.md)
4. 查看 [配置文件](./config/tauri-conf.md)

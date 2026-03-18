# 插件概述

本文档介绍 Tauri 的插件系统。

## 什么是插件？

插件是一种扩展 Tauri 功能的方式，允许你：
- 封装重复使用的功能
- 提供自定义命令和 API
- 与系统原生功能集成
- 管理自己的状态和生命周期

## 核心概念

### Plugin Trait

所有 Tauri 插件都必须实现 `Plugin` trait：

```rust
use tauri::{plugin::{Plugin, Result as PluginResult}, AppHandle, Runtime};

struct MyPlugin<R: Runtime> {
    // 插件状态
}

impl<R: Runtime> Plugin<R> for MyPlugin<R> {
    fn name(&self) -> &'static str {
        "my-plugin"
    }

    fn initialize(
        &mut self,
        app: &AppHandle<R>,
        config: serde_json::Value,
    ) -> PluginResult<()> {
        // 初始化插件
        Ok(())
    }

    fn initialization_script(&self) -> Option<String> {
        // 可选：返回初始化脚本
        None
    }

    fn setup(&mut self, app: &AppHandle<R>) -> PluginResult<()> {
        // 可选：设置阶段
        Ok(())
    }

    fn on_webview_ready(&mut self, webview: &tauri::Webview<R>) {
        // 可选：Webview 准备好时调用
    }

    fn on_event(&mut self, app: &AppHandle<R>, event: &tauri::RunEvent) {
        // 可选：应用事件
    }
}
```

## 官方插件

Tauri 提供了一系列官方插件：

| 插件 | 功能 |
|------|------|
| `tauri-plugin-shell` | 执行 shell 命令、打开文件/URL |
| `tauri-plugin-fs` | 文件系统操作 |
| `tauri-plugin-dialog` | 原生对话框 |
| `tauri-plugin-notification` | 系统通知 |
| `tauri-plugin-clipboard` | 剪贴板操作 |
| `tauri-plugin-global-shortcut` | 全局快捷键 |
| `tauri-plugin-updater` | 应用更新 |
| `tauri-plugin-store` | 持久化存储 |
| `tauri-plugin-window-state` | 窗口状态保存/恢复 |
| `tauri-plugin-process` | 进程管理 |
| `tauri-plugin-opener` | 打开文件和 URL |
| `tauri-plugin-positioner` | 窗口定位 |

## 使用官方插件

### 安装插件

在 `Cargo.toml` 中添加：

```toml
[dependencies]
tauri-plugin-shell = "2.0"
tauri-plugin-dialog = "2.0"
tauri-plugin-notification = "2.0"
```

### 注册插件

在 `main.rs` 中：

```rust
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 前端使用

```typescript
import { Command } from '@tauri-apps/plugin-shell'
import { open } from '@tauri-apps/plugin-dialog'
import { sendNotification } from '@tauri-apps/plugin-notification'

// 执行命令
await Command.create('echo', ['Hello World']).execute()

// 打开文件对话框
const selected = await open({
  multiple: false,
  filters: [{
    name: 'Text',
    extensions: ['txt']
  }]
})

// 发送通知
await sendNotification({
  title: 'Hello',
  body: 'This is a notification'
})
```

## 插件权限

使用插件时需要配置相应的权限：

```toml
# permissions/default.toml
[permissions.shell:allow-execute]
allow = [
  { command = "echo" },
  { command = "ls" }
]

[permissions.dialog:open]
allow = ["all"]

[permissions.notification:allow]
allow = ["all"]
```

## 创建自定义插件

### 插件项目结构

```
my-plugin/
├── Cargo.toml
├── src/
│   └── lib.rs
└── guest-js/
    ├── index.ts
    └── package.json
```

### Cargo.toml

```toml
[package]
name = "tauri-plugin-my-plugin"
version = "0.1.0"
edition = "2021"

[dependencies]
tauri = { version = "2.0", features = ["tray-icon"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

### lib.rs

```rust
use tauri::{
    plugin::{Builder, TauriPlugin},
    Runtime,
};

mod commands;

// 插件入口
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("my-plugin")
        .invoke_handler(tauri::generate_handler![
            commands::do_something,
            commands::get_status,
        ])
        .setup(|app| {
            // 初始化插件
            println!("My plugin initialized!");
            Ok(())
        })
        .on_webview_ready(|webview| {
            println!("Webview ready: {}", webview.label());
        })
        .build()
}
```

### commands.rs

```rust
use serde::{Deserialize, Serialize};
use tauri::State;
use std::sync::Mutex;

// 插件状态
pub struct PluginState {
    count: Mutex<i32>,
}

#[tauri::command]
pub fn do_something(state: State<PluginState>, input: String) -> String {
    let mut count = state.count.lock().unwrap();
    *count += 1;
    format!("Processed: {} (count: {})", input, count)
}

#[tauri::command]
pub fn get_status(state: State<PluginState>) -> i32 {
    *state.count.lock().unwrap()
}
```

### 前端 API (guest-js/index.ts)

```typescript
import { invoke } from '@tauri-apps/api/core'

export async function doSomething(input: string): Promise<string> {
  return await invoke<string>('plugin:my-plugin|do_something', { input })
}

export async function getStatus(): Promise<number> {
  return await invoke<number>('plugin:my-plugin|get_status')
}
```

## 使用自定义插件

### 在 Tauri 应用中使用

1. 添加依赖到 `Cargo.toml`:

```toml
[dependencies]
tauri-plugin-my-plugin = { path = "../my-plugin" }
```

2. 在 `main.rs` 中注册:

```rust
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_my_plugin::init())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

3. 前端使用:

```typescript
import { doSomething, getStatus } from 'tauri-plugin-my-plugin'

const result = await doSomething('test')
console.log(result)

const status = await getStatus()
console.log(status)
```

## 插件配置

### 从 tauri.conf.json 读取配置

```rust
use serde::Deserialize;
use tauri::plugin::{Builder, TauriPlugin, Result};

#[derive(Debug, Deserialize)]
struct PluginConfig {
    api_key: String,
    endpoint: String,
    #[serde(default = "default_timeout")]
    timeout: u64,
}

fn default_timeout() -> u64 {
    30
}

pub fn init<R: tauri::Runtime>() -> TauriPlugin<R> {
    Builder::new("my-plugin")
        .setup(|app| {
            let config: PluginConfig = app.config()
                .plugins
                .0
                .get("my-plugin")
                .and_then(|config| serde_json::from_value(config.clone()).ok())
                .unwrap_or_else(|| PluginConfig {
                    api_key: "".to_string(),
                    endpoint: "https://api.example.com".to_string(),
                    timeout: 30,
                });

            println!("Config: {:?}", config);
            Ok(())
        })
        .build()
}
```

在 `tauri.conf.json` 中配置:

```json
{
  "plugins": {
    "my-plugin": {
      "api_key": "secret-key",
      "endpoint": "https://api.example.com",
      "timeout": 60
    }
  }
}
```

## 完整插件示例

让我们创建一个简单的 HTTP 请求插件：

### src/lib.rs

```rust
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{plugin::{Builder, TauriPlugin}, Runtime, State};

#[derive(Clone)]
struct HttpState {
    client: Client,
}

#[derive(Debug, Serialize, Deserialize)]
struct HttpResponse {
    status: u16,
    headers: Vec<(String, String)>,
    body: String,
}

#[tauri::command]
async fn http_get(
    state: State<'_, HttpState>,
    url: String,
) -> Result<HttpResponse, String> {
    let response = state.client
        .get(&url)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let status = response.status().as_u16();

    let headers = response.headers()
        .iter()
        .filter_map(|(k, v)| {
            Some((
                k.to_string(),
                v.to_str().ok()?.to_string()
            ))
        })
        .collect();

    let body = response.text()
        .await
        .map_err(|e| e.to_string())?;

    Ok(HttpResponse { status, headers, body })
}

#[tauri::command]
async fn http_post(
    state: State<'_, HttpState>,
    url: String,
    body: String,
) -> Result<HttpResponse, String> {
    let response = state.client
        .post(&url)
        .body(body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    // 类似 http_get 的处理...
    Ok(HttpResponse {
        status: response.status().as_u16(),
        headers: vec![],
        body: response.text().await.unwrap_or_default(),
    })
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("http")
        .invoke_handler(tauri::generate_handler![http_get, http_post])
        .setup(|app| {
            app.manage(HttpState {
                client: Client::new(),
            });
            Ok(())
        })
        .build()
}
```

### guest-js/index.ts

```typescript
import { invoke } from '@tauri-apps/api/core'

export interface HttpResponse {
  status: number
  headers: Array<[string, string]>
  body: string
}

export async function get(url: string): Promise<HttpResponse> {
  return await invoke<HttpResponse>('plugin:http|http_get', { url })
}

export async function post(url: string, body: string): Promise<HttpResponse> {
  return await invoke<HttpResponse>('plugin:http|http_post', { url, body })
}
```

### 使用插件

```rust
// main.rs
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

```typescript
// 前端
import { get, post } from 'tauri-plugin-http'

// GET 请求
const response = await get('https://api.example.com/data')
console.log(response.status, response.body)

// POST 请求
const data = await post('https://api.example.com/submit', JSON.stringify({ foo: 'bar' }))
```

## 最佳实践

1. **命名规范** - 插件名使用 kebab-case，命令使用 snake_case
2. **错误处理** - 提供有意义的错误信息
3. **类型安全** - 为前端 API 提供完整的 TypeScript 类型
4. **权限控制** - 为插件功能实现适当的权限检查
5. **文档** - 为插件提供清晰的使用文档
6. **测试** - 为插件编写单元测试和集成测试

# IPC 通信

IPC（Inter-Process Communication，进程间通信）是 Tauri 中前端与后端通信的核心机制。

## 概述

Tauri 的 IPC 系统允许前端（WebView 中的 JavaScript/TypeScript）与后端（Rust）之间进行安全、类型安全的通信。

## 通信模型

```
┌──────────────┐         IPC         ┌──────────────┐
│   Frontend   │ ──────────────────▶ │   Backend    │
│ (WebView)    │   invoke(command)   │   (Rust)     │
│              │ ◀────────────────── │              │
└──────────────┘   Promise.resolve   └──────────────┘
```

## 核心概念

### 1. 命令 (Commands)

命令是 Rust 端定义的函数，可以被前端调用。

**定义命令**:
```rust
use tauri::command;

#[command]
fn my_command(name: String) -> String {
    format!("Hello, {}!", name)
}
```

**注册命令**:
```rust
tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![my_command])
    .run(tauri::generate_context!())
```

### 2. invoke 函数

前端使用 `invoke` 函数调用 Rust 命令：

```typescript
import { invoke } from '@tauri-apps/api/core'

const result = await invoke<string>('my_command', { name: 'World' })
console.log(result) // "Hello, World!"
```

## 详细用法

### 参数传递

#### 基本类型

```rust
#[command]
fn basic_types(
    string_arg: String,
    int_arg: i32,
    float_arg: f64,
    bool_arg: bool,
) {
    // 支持所有基本类型
}
```

#### 可选参数

```rust
#[command]
fn optional_arg(name: Option<String>) -> String {
    match name {
        Some(n) => format!("Hello, {}!", n),
        None => "Hello!".to_string(),
    }
}
```

前端调用时可以不传该参数：
```typescript
await invoke('optional_arg') // 不传参数
await invoke('optional_arg', { name: 'World' }) // 传参数
```

#### 结构体参数

使用 `serde` 序列化结构体：

```rust
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct User {
    name: String,
    age: u32,
}

#[command]
fn create_user(user: User) -> String {
    format!("Created user: {} (age {})", user.name, user.age)
}
```

前端调用：
```typescript
await invoke('create_user', {
    user: { name: 'Alice', age: 25 }
})
```

### 返回值

#### 基本返回值

```rust
#[command]
fn get_string() -> String {
    "Hello".to_string()
}

#[command]
fn get_number() -> i32 {
    42
}
```

#### 结构体返回值

```rust
#[derive(Serialize)]
struct User {
    name: String,
    age: u32,
}

#[command]
fn get_user() -> User {
    User {
        name: "Alice".to_string(),
        age: 25,
    }
}
```

前端接收：
```typescript
interface User {
  name: string
  age: number
}

const user = await invoke<User>('get_user')
```

#### Result 返回值

```rust
#[command]
fn might_fail() -> Result<String, String> {
    if true {
        Ok("Success".to_string())
    } else {
        Err("Something went wrong".to_string())
    }
}
```

前端处理错误：
```typescript
try {
  const result = await invoke('might_fail')
} catch (error) {
  console.error('Error:', error)
}
```

#### 自定义错误类型

```rust
use thiserror::Error;

#[derive(Error, Debug)]
enum MyError {
    #[error("Invalid input: {0}")]
    InvalidInput(String),
    #[error("Database error")]
    DatabaseError,
}

// 必须实现 Serialize
impl Serialize for MyError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[command]
fn custom_error() -> Result<String, MyError> {
    Err(MyError::InvalidInput("bad input".to_string()))
}
```

### 异步命令

```rust
#[command]
async fn async_command() -> String {
    // 异步操作
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    "Done".to_string()
}

// 返回 Future
#[command]
fn returns_future() -> impl futures::Future<Output = String> {
    async {
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        "Done".to_string()
    }
}
```

### 访问 AppHandle

```rust
use tauri::AppHandle;

#[command]
fn with_app_handle(app: AppHandle) {
    // 使用 AppHandle
    app.emit("event", ()).unwrap();
}
```

### 访问 Window

```rust
use tauri::Window;

#[command]
fn with_window(window: Window) {
    window.set_title("New Title").unwrap();
}
```

### 访问 State

```rust
use tauri::State;
use std::sync::Mutex;

struct MyState {
    count: Mutex<i32>,
}

#[command]
fn with_state(state: State<MyState>) -> i32 {
    let mut count = state.count.lock().unwrap();
    *count += 1;
    *count
}
```

## 权限系统

Tauri 2.x 使用 capability 系统控制 IPC 访问。

### 定义 Capability

创建 `src-tauri/permissions/my-capability.toml`:

```toml
$schema = "../schemas/capability.schema.json"
identifier = "my-capability"
description = "My custom capability"

# 允许特定命令
[permissions.core:default]
allow = [
    { name = "my_command" },
    { name = "another_command" }
]
```

### 配置 Capability

在 `tauri.conf.json` 中：

```json
{
  "app": {
    "capabilities": ["my-capability", "core:default"]
  }
}
```

## 前端 API 详解

### invoke 函数

**签名**:
```typescript
function invoke<T>(
  cmd: string,
  args?: InvokeArgs,
  options?: InvokeOptions
): Promise<T>
```

**参数**:
- `cmd`: 命令名称
- `args`: 命令参数对象
- `options`: 调用选项

**示例**:
```typescript
// 基本调用
await invoke('command')

// 带参数
await invoke('command', { arg1: 'value1', arg2: 42 })

// 指定返回类型
const result = await invoke<MyType>('command')
```

### transformCallback

用于创建可以从 Rust 调用的 JavaScript 回调：

```typescript
import { transformCallback } from '@tauri-apps/api/core'

const callback = transformCallback((result) => {
  console.log('Callback called with:', result)
})

// 将回调 ID 发送给 Rust
await invoke('register_callback', { callbackId: callback })
```

## 底层实现

### IPC 协议

基于代码分析，Tauri 的 IPC 使用 JSON 序列化消息：

```rust
// IPC 消息格式
struct IpcMessage {
    cmd: String,
    callback: u64,
    error: u64,
    payload: Option<Value>,
}
```

### 消息流程

1. 前端调用 `invoke(cmd, args)`
2. `invoke` 序列化参数为 JSON
3. 通过 WebView 的 IPC 通道发送到 Rust
4. Rust 接收消息，反序列化参数
5. 路由到对应的命令处理函数
6. 执行命令函数
7. 序列化返回值
8. 通过 IPC 通道发送回前端
9. 前端反序列化结果，resolve Promise

## 最佳实践

### 1. 类型安全

使用 TypeScript 接口定义类型：

```typescript
// types.ts
export interface User {
  id: number
  name: string
  email: string
}

// api.ts
import type { User } from './types'

export async function getUser(id: number): Promise<User> {
  return await invoke<User>('get_user', { id })
}
```

### 2. 错误处理

```typescript
try {
  const result = await invoke('might_fail')
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message)
  } else {
    console.error('Unknown error:', error)
  }
}
```

### 3. 批量操作

```rust
#[command]
async fn batch_operations(items: Vec<Item>) -> Result<Vec<Result>, String> {
    // 批量处理
}
```

### 4. 进度反馈

使用 Channel 进行进度反馈（见 [事件系统](./events.md)）。

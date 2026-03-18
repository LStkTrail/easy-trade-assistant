# 命令 (Commands)

命令是 Tauri 中前后端通信的核心机制。本文档详细讲解如何定义、注册和使用 Tauri 命令。

## 基本概念

命令是被 `#[tauri::command]` 宏标记的普通 Rust 函数，可以从前端 JavaScript/TypeScript 代码中调用。

## 定义命令

### 最简单的命令

```rust
use tauri::command;

#[command]
fn greet() -> String {
    "Hello from Rust!".to_string()
}
```

### 带参数的命令

```rust
#[command]
fn greet_name(name: String) -> String {
    format!("Hello, {}!", name)
}
```

### 多个参数

```rust
#[command]
fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

## 参数类型

### 基本类型

Tauri 命令支持所有可以被 `serde` 序列化的类型：

```rust
#[command]
fn basic_types(
    string: String,
    integer: i32,
    float: f64,
    boolean: bool,
    optional: Option<String>,
) {
    // 使用参数
}
```

### 结构体参数

需要派生 `serde::Deserialize`:

```rust
use serde::Deserialize;

#[derive(Deserialize)]
struct User {
    name: String,
    age: u32,
    email: String,
}

#[command]
fn create_user(user: User) -> String {
    format!("Created user: {}", user.name)
}
```

前端调用：
```typescript
await invoke('create_user', {
  user: {
    name: 'Alice',
    age: 25,
    email: 'alice@example.com'
  }
})
```

### 枚举参数

```rust
#[derive(Deserialize)]
#[serde(tag = "type")]
enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
}

#[command]
fn calculate_area(shape: Shape) -> f64 {
    match shape {
        Shape::Circle { radius } => std::f64::consts::PI * radius * radius,
        Shape::Rectangle { width, height } => width * height,
    }
}
```

### Vec 参数

```rust
#[command]
fn sum_numbers(numbers: Vec<i32>) -> i32 {
    numbers.iter().sum()
}

#[command]
fn process_strings(strings: Vec<String>) -> Vec<String> {
    strings.into_iter().map(|s| s.to_uppercase()).collect()
}
```

## 返回值类型

### 基本返回值

```rust
#[command]
fn get_string() -> String {
    "Hello".to_string()
}

#[command]
fn get_number() -> i32 {
    42
}

#[command]
fn get_boolean() -> bool {
    true
}
```

### 结构体返回值

需要派生 `serde::Serialize`:

```rust
use serde::Serialize;

#[derive(Serialize)]
struct User {
    id: u32,
    name: String,
    email: String,
}

#[command]
fn get_user() -> User {
    User {
        id: 1,
        name: "Alice".to_string(),
        email: "alice@example.com".to_string(),
    }
}

#[command]
fn get_users() -> Vec<User> {
    vec![
        User { id: 1, name: "Alice".to_string(), email: "alice@example.com".to_string() },
        User { id: 2, name: "Bob".to_string(), email: "bob@example.com".to_string() },
    ]
}
```

### Option 返回值

```rust
#[command]
fn find_user(id: u32) -> Option<User> {
    if id == 1 {
        Some(User {
            id: 1,
            name: "Alice".to_string(),
            email: "alice@example.com".to_string(),
        })
    } else {
        None
    }
}
```

## Result 和错误处理

### 基本 Result

```rust
#[command]
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Cannot divide by zero".to_string())
    } else {
        Ok(a / b)
    }
}
```

前端错误处理：
```typescript
try {
  const result = await invoke('divide', { a: 10, b: 0 })
} catch (error) {
  console.error('Error:', error)
}
```

### 自定义错误类型

使用 `thiserror` 创建自定义错误类型：

```rust
use serde::Serialize;
use thiserror::Error;

#[derive(Error, Debug)]
enum ApiError {
    #[error("Invalid input: {0}")]
    InvalidInput(String),
    #[error("Not found: {0}")]
    NotFound(String),
    #[error("Database error")]
    DatabaseError,
}

// 需要实现 Serialize 以便前端能接收
impl Serialize for ApiError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[command]
fn custom_error_example(id: u32) -> Result<String, ApiError> {
    if id == 0 {
        Err(ApiError::InvalidInput("ID cannot be zero".to_string()))
    } else if id > 100 {
        Err(ApiError::NotFound(format!("User {}", id)))
    } else {
        Ok("Success".to_string())
    }
}
```

### 转换外部错误

```rust
#[command]
fn read_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))
}

// 或者使用 ? 操作符
#[command]
fn read_file2(path: String) -> Result<String, String> {
    let content = std::fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))?;
    Ok(content)
}
```

## 异步命令

### async fn

```rust
#[command]
async fn async_greet() -> String {
    // 模拟异步操作
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    "Hello after 1 second".to_string()
}
```

### 返回 Future

```rust
use futures::future::FutureExt;

#[command]
fn future_greet() -> impl futures::Future<Output = String> {
    async {
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        "Hello from future".to_string()
    }.boxed()
}
```

### 异步 I/O 示例

```rust
#[command]
async fn fetch_url(url: String) -> Result<String, String> {
    reqwest::get(&url)
        .await
        .map_err(|e| format!("Request failed: {}", e))?
        .text()
        .await
        .map_err(|e| format!("Failed to read response: {}", e))
}
```

## 特殊参数

Tauri 命令可以接收一些特殊的参数，这些参数由 Tauri 自动注入，不需要从前端传递。

### AppHandle

```rust
use tauri::AppHandle;

#[command]
fn with_app_handle(app: AppHandle) {
    // 获取应用名称
    let name = app.package_info().name.clone();

    // 发送全局事件
    app.emit("custom-event", "payload").unwrap();

    // 获取窗口
    let window = app.get_webview_window("main").unwrap();
}
```

### Window

```rust
use tauri::Window;

#[command]
fn with_window(window: Window) {
    // 设置窗口标题
    window.set_title("New Title").unwrap();

    // 最小化窗口
    window.minimize().unwrap();

    // 发送事件到窗口
    window.emit("window-event", "payload").unwrap();

    // 获取窗口标签
    let label = window.label();
}
```

### State

```rust
use tauri::State;
use std::sync::Mutex;

// 定义状态
struct AppState {
    counter: Mutex<i32>,
}

#[command]
fn with_state(state: State<AppState>) -> i32 {
    let mut counter = state.counter.lock().unwrap();
    *counter += 1;
    *counter
}
```

### 组合多个特殊参数

```rust
#[command]
fn with_all(
    app: AppHandle,
    window: Window,
    state: State<AppState>,
    name: String,
) -> String {
    format!("Hello, {}!", name)
}
```

## 注册命令

### 使用 generate_handler!

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            greet_name,
            add,
            create_user,
            // ... 更多命令
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 命令命名

默认情况下，命令使用 Rust 函数名。你也可以重命名：

```rust
#[command(name = "custom_command_name")]
fn my_function() -> String {
    "Hello".to_string()
}

// 前端调用
await invoke('custom_command_name')
```

## 完整示例

### 简单的待办事项应用

```rust
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tauri::State;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Todo {
    id: u32,
    text: String,
    completed: bool,
}

struct TodoState {
    todos: Arc<Mutex<Vec<Todo>>>,
    next_id: Arc<Mutex<u32>>,
}

#[command]
fn add_todo(state: State<TodoState>, text: String) -> Todo {
    let mut todos = state.todos.lock().unwrap();
    let mut next_id = state.next_id.lock().unwrap();

    let todo = Todo {
        id: *next_id,
        text,
        completed: false,
    };

    todos.push(todo.clone());
    *next_id += 1;

    todo
}

#[command]
fn get_todos(state: State<TodoState>) -> Vec<Todo> {
    state.todos.lock().unwrap().clone()
}

#[command]
fn toggle_todo(state: State<TodoState>, id: u32) -> Option<Todo> {
    let mut todos = state.todos.lock().unwrap();
    todos.iter_mut().find(|t| t.id == id).map(|t| {
        t.completed = !t.completed;
        t.clone()
    })
}

#[command]
fn delete_todo(state: State<TodoState>, id: u32) -> bool {
    let mut todos = state.todos.lock().unwrap();
    let initial_len = todos.len();
    todos.retain(|t| t.id != id);
    todos.len() != initial_len
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(TodoState {
            todos: Arc::new(Mutex::new(Vec::new())),
            next_id: Arc::new(Mutex::new(1)),
        })
        .invoke_handler(tauri::generate_handler![
            add_todo,
            get_todos,
            toggle_todo,
            delete_todo,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

前端代码：
```typescript
import { invoke } from '@tauri-apps/api/core'

interface Todo {
  id: number
  text: string
  completed: boolean
}

// 添加待办
async function addTodo(text: string): Promise<Todo> {
  return await invoke<Todo>('add_todo', { text })
}

// 获取所有待办
async function getTodos(): Promise<Todo[]> {
  return await invoke<Todo[]>('get_todos')
}

// 切换完成状态
async function toggleTodo(id: number): Promise<Todo | null> {
  return await invoke<Todo | null>('toggle_todo', { id })
}

// 删除待办
async function deleteTodo(id: number): Promise<boolean> {
  return await invoke<boolean>('delete_todo', { id })
}
```

## 最佳实践

### 1. 类型安全

在前后端使用对应的类型定义：

```rust
// Rust
#[derive(Serialize, Deserialize)]
struct User {
    id: u32,
    name: String,
}
```

```typescript
// TypeScript
interface User {
  id: number
  name: string
}

async function getUser(): Promise<User> {
  return await invoke<User>('get_user')
}
```

### 2. 错误处理

总是使用 `Result` 并提供有意义的错误信息：

```rust
#[command]
fn do_something() -> Result<String, String> {
    // ...
}
```

### 3. 异步操作

对于 I/O 密集型操作，使用异步命令：

```rust
#[command]
async fn fetch_data() -> Result<String, String> {
    // 异步操作
}
```

### 4. 状态管理

使用 `State` 管理应用状态，而不是全局变量：

```rust
struct AppState {
    // ...
}

#[command]
fn with_state(state: State<AppState>) {
    // ...
}
```

### 5. 批量操作

对于频繁调用的操作，考虑批量处理：

```rust
#[command]
fn batch_update(items: Vec<Item>) -> Result<(), String> {
    // 批量处理
}
```

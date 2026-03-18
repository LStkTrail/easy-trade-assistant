# 状态管理

本文档详细讲解 Tauri 中 Rust 后端的状态管理机制。

## 概述

Tauri 提供了类型安全的状态管理系统，允许你在命令之间共享数据，而不需要使用全局变量。

## 基本概念

### State<T>

`State<T>` 是 Tauri 提供的一个智能指针类型，用于访问应用状态。它可以作为命令的特殊参数自动注入。

### Manager::manage()

使用 `Builder` 或 `AppHandle` 的 `manage()` 方法来添加状态。

## 简单状态

### 定义状态

```rust
use std::sync::Mutex;
use tauri::State;

// 定义一个简单的计数器状态
struct Counter {
    count: Mutex<i32>,
}
```

### 添加状态

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // 添加状态
        .manage(Counter {
            count: Mutex::new(0),
        })
        .invoke_handler(tauri::generate_handler![increment, get_count])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 在命令中使用状态

```rust
#[command]
fn increment(state: State<Counter>) -> i32 {
    let mut count = state.count.lock().unwrap();
    *count += 1;
    *count
}

#[command]
fn get_count(state: State<Counter>) -> i32 {
    *state.count.lock().unwrap()
}
```

## 线程安全

### Mutex

对于需要修改的状态，使用 `Mutex`：

```rust
use std::sync::Mutex;

struct AppState {
    data: Mutex<Vec<String>>,
}

#[command]
fn add_item(state: State<AppState>, item: String) {
    let mut data = state.data.lock().unwrap();
    data.push(item);
}
```

### RwLock

对于读多写少的场景，使用 `RwLock`：

```rust
use std::sync::RwLock;

struct CacheState {
    cache: RwLock<std::collections::HashMap<String, String>>,
}

#[command]
fn get_cache(state: State<CacheState>, key: String) -> Option<String> {
    let cache = state.cache.read().unwrap();
    cache.get(&key).cloned()
}

#[command]
fn set_cache(state: State<CacheState>, key: String, value: String) {
    let mut cache = state.cache.write().unwrap();
    cache.insert(key, value);
}
```

### Arc

对于需要共享所有权的状态，使用 `Arc`：

```rust
use std::sync::{Arc, Mutex};

struct SharedState {
    data: Arc<Mutex<Vec<String>>>,
}

// 可以在多个地方克隆 Arc
let data_clone = state.data.clone();
```

## 复杂状态

### 多个状态

你可以添加多个不同类型的状态：

```rust
struct Counter {
    count: Mutex<i32>,
}

struct UserStore {
    users: Mutex<Vec<User>>,
}

struct Config {
    settings: RwLock<Settings>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(Counter { count: Mutex::new(0) })
        .manage(UserStore { users: Mutex::new(Vec::new()) })
        .manage(Config { settings: RwLock::new(Settings::default()) })
        .invoke_handler(tauri::generate_handler![...])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 嵌套状态

```rust
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex, RwLock};

#[derive(Clone, Serialize, Deserialize)]
struct User {
    id: u32,
    name: String,
}

#[derive(Clone)]
struct Database {
    users: Mutex<Vec<User>>,
    posts: Mutex<Vec<Post>>,
}

struct AppState {
    db: Arc<Database>,
    cache: RwLock<std::collections::HashMap<String, String>>,
    config: RwLock<Config>,
}

#[command]
fn add_user(state: State<AppState>, user: User) {
    let mut users = state.db.users.lock().unwrap();
    users.push(user);
}

#[command]
fn get_users(state: State<AppState>) -> Vec<User> {
    state.db.users.lock().unwrap().clone()
}
```

## 状态初始化

### 从配置初始化

```rust
use tauri::Manager;

#[derive(Debug)]
struct Config {
    api_url: String,
    debug: bool,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 从文件或环境变量加载配置
    let config = Config {
        api_url: std::env::var("API_URL").unwrap_or_else(|_| "http://localhost".to_string()),
        debug: std::env::var("DEBUG").is_ok(),
    };

    tauri::Builder::default()
        .manage(config)
        .setup(|app| {
            // 也可以在 setup 中访问状态
            let config = app.state::<Config>();
            println!("Config: {:?}", config);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![...])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 异步初始化

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // 同步初始化
            let sync_state = SyncState::new();
            app.manage(sync_state);

            // 对于异步初始化，可以在 setup 中 spawn 任务
            let app_handle = app.app_handle().clone();
            tauri::async_runtime::spawn(async move {
                let async_state = load_async_state().await;
                app_handle.manage(async_state);
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![...])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 在 setup 中使用状态

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(Counter { count: Mutex::new(0) })
        .setup(|app| {
            // 获取状态
            let counter = app.state::<Counter>();

            // 使用状态
            let mut count = counter.count.lock().unwrap();
            *count = 42;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![...])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 从 AppHandle 访问状态

```rust
use tauri::AppHandle;

#[command]
fn access_from_app_handle(app: AppHandle) {
    // 从 AppHandle 获取状态
    let counter = app.state::<Counter>();
    let count = counter.count.lock().unwrap();
    println!("Count: {}", count);
}

// 也可以在其他地方使用 AppHandle
fn some_function(app: AppHandle) {
    let counter = app.state::<Counter>();
    // ...
}
```

## 状态与命令组合

### 完整示例：待办事项应用

```rust
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tauri::State;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Todo {
    id: u32,
    text: String,
    completed: bool,
    created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone)]
struct TodoStore {
    todos: Arc<Mutex<Vec<Todo>>>,
    next_id: Arc<Mutex<u32>>,
}

impl TodoStore {
    fn new() -> Self {
        Self {
            todos: Arc::new(Mutex::new(Vec::new())),
            next_id: Arc::new(Mutex::new(1)),
        }
    }

    fn add(&self, text: String) -> Todo {
        let mut todos = self.todos.lock().unwrap();
        let mut next_id = self.next_id.lock().unwrap();

        let todo = Todo {
            id: *next_id,
            text,
            completed: false,
            created_at: chrono::Utc::now(),
        };

        todos.push(todo.clone());
        *next_id += 1;

        todo
    }

    fn get_all(&self) -> Vec<Todo> {
        self.todos.lock().unwrap().clone()
    }

    fn toggle(&self, id: u32) -> Option<Todo> {
        let mut todos = self.todos.lock().unwrap();
        todos.iter_mut().find(|t| t.id == id).map(|t| {
            t.completed = !t.completed;
            t.clone()
        })
    }

    fn delete(&self, id: u32) -> bool {
        let mut todos = self.todos.lock().unwrap();
        let len_before = todos.len();
        todos.retain(|t| t.id != id);
        todos.len() != len_before
    }
}

// 命令
#[command]
fn add_todo(store: State<TodoStore>, text: String) -> Todo {
    store.add(text)
}

#[command]
fn get_todos(store: State<TodoStore>) -> Vec<Todo> {
    store.get_all()
}

#[command]
fn toggle_todo(store: State<TodoStore>, id: u32) -> Option<Todo> {
    store.toggle(id)
}

#[command]
fn delete_todo(store: State<TodoStore>, id: u32) -> bool {
    store.delete(id)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(TodoStore::new())
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

## 最佳实践

### 1. 使用封装

将状态操作封装在 impl 块中：

```rust
impl AppState {
    pub fn new() -> Self { /* ... */ }
    pub fn do_something(&self) { /* ... */ }
}
```

### 2. 避免长时间持有锁

```rust
#[command]
fn bad_example(state: State<AppState>) {
    let data = state.data.lock().unwrap();
    // 不要在持有锁的情况下做耗时操作
    // long_operation();
}

#[command]
fn good_example(state: State<AppState>) {
    // 克隆需要的数据后释放锁
    let data = state.data.lock().unwrap().clone();
    // 现在可以做耗时操作了
}
```

### 3. 使用类型别名简化

```rust
type AppStateHandle = State<'static, AppState>;

#[command]
fn do_something(state: AppStateHandle) {
    // ...
}
```

### 4. 考虑使用 Send + Sync

确保你的状态类型实现了 `Send` 和 `Sync`，这样才能在多线程环境中安全使用。

### 5. 错误处理

不要在锁中使用 `unwrap()`，使用适当的错误处理：

```rust
#[command]
fn safe_example(state: State<AppState>) -> Result<String, String> {
    let data = state.data.lock()
        .map_err(|_| "Failed to lock state")?;
    Ok(data.clone())
}
```

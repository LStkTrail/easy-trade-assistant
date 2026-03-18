# 应用生命周期

本文档详细讲解 Tauri 应用的完整生命周期。

## 概述

Tauri 应用的生命周期涵盖从启动到关闭的整个过程，包括多个阶段和事件。

## 生命周期阶段

```
启动阶段
    ↓
初始化阶段
    ↓
设置阶段 (setup)
    ↓
运行阶段
    ↓
关闭阶段
```

## 启动流程

### 1. Rust 入口

`src-tauri/src/main.rs` 是应用的入口点：

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // 配置阶段
        .invoke_handler(tauri::generate_handler![...])
        .plugin(...)
        .manage(...)
        // 设置阶段
        .setup(|app| {
            // 初始化代码
            Ok(())
        })
        // 运行阶段
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 2. 配置生成

`tauri::generate_context!()` 宏在编译时处理 `tauri.conf.json`：

```rust
// 展开后类似：
tauri::Context::new(
    tauri::config::Config::from_str(include_str!("../tauri.conf.json")),
    // ... 其他配置
)
```

## 配置阶段

### Builder 配置

使用 `tauri::Builder` 进行应用配置：

```rust
tauri::Builder::default()
    // 注册命令处理器
    .invoke_handler(tauri::generate_handler![
        my_command,
        another_command
    ])
    // 添加插件
    .plugin(my_plugin::init())
    // 管理状态
    .manage(AppState::new())
    // 设置菜单
    .menu(menu)
    // 设置系统托盘
    .system_tray(tray)
    // ... 更多配置
```

### 详细配置项

#### 1. invoke_handler

注册 IPC 命令处理器：

```rust
.invoke_handler(tauri::generate_handler![
    greet,
    get_user,
    update_user
])
```

#### 2. plugin

添加插件：

```rust
.plugin(tauri_plugin_window_state::Builder::default().build())
.plugin(tauri_plugin_shell::init())
.plugin(my_custom_plugin::init())
```

#### 3. manage

添加应用状态：

```rust
.manage(AppState {
    counter: Mutex::new(0),
    config: RwLock::new(Config::load()),
})
```

#### 4. setup

设置回调函数（详见下一章节）。

#### 5. menu

设置应用菜单：

```rust
.menu(Menu::new()
    .add_submenu(Submenu::new(
        "File",
        Menu::new()
            .add_item(MenuItem::new("New", "CmdOrCtrl+N"))
            .add_item(MenuItem::new("Open", "CmdOrCtrl+O"))
            .add_item(MenuItem::new("Save", "CmdOrCtrl+S"))
    ))
)
```

#### 6. system_tray

设置系统托盘：

```rust
.system_tray(SystemTray::new()
    .with_menu(Menu::new()
        .add_item(MenuItem::new("Show", ""))
        .add_item(MenuItem::new("Quit", ""))
    )
)
```

#### 7. on_window_event

监听窗口事件：

```rust
.on_window_event(|event| {
    match event.event() {
        WindowEvent::CloseRequested { api, .. } => {
            api.prevent_close();
        }
        WindowEvent::Resized(size) => {
            println!("Window resized: {:?}", size);
        }
        _ => {}
    }
})
```

#### 8. on_menu_event

监听菜单事件：

```rust
.on_menu_event(|event| {
    match event.menu_item_id() {
        "new" => { /* ... */ }
        "open" => { /* ... */ }
        "save" => { /* ... */ }
        _ => {}
    }
})
```

#### 9. on_system_tray_event

监听系统托盘事件：

```rust
.on_system_tray_event(|app, event| {
    match event {
        SystemTrayEvent::LeftClick { .. } => {
            if let Some(window) = app.get_webview_window("main") {
                window.show().unwrap();
            }
        }
        SystemTrayEvent::MenuItemClick { id, .. } => {
            match id.as_str() {
                "quit" => app.exit(0),
                _ => {}
            }
        }
        _ => {}
    }
})
```

## 设置阶段 (setup)

### setup 回调

`setup` 是应用启动过程中的关键阶段，可以在此进行初始化：

```rust
.setup(|app| {
    // 在这里进行初始化工作

    // 获取窗口
    let window = app.get_webview_window("main").unwrap();

    // 访问状态
    let state = app.state::<AppState>();

    // 发送初始事件
    window.emit("app-ready", ()).unwrap();

    // 初始化数据库
    init_database()?;

    Ok(())
})
```

### 常见 setup 任务

#### 1. 初始化状态

```rust
.setup(|app| {
    // 从文件加载配置
    let config = load_config()?;
    app.manage(config);

    Ok(())
})
```

#### 2. 设置事件监听器

```rust
.setup(|app| {
    let window = app.get_webview_window("main").unwrap();

    window.listen("frontend-event", move |event| {
        println!("Got event: {:?}", event.payload());
    });

    Ok(())
})
```

#### 3. 初始化后台任务

```rust
.setup(|app| {
    let app_handle = app.app_handle().clone();

    // 启动后台任务
    tauri::async_runtime::spawn(async move {
        loop {
            tokio::time::sleep(tokio::time::Duration::from_secs(60)).await;
            // 定期执行任务
            let _ = app_handle.emit_all("tick", ());
        }
    });

    Ok(())
})
```

#### 4. 访问窗口

```rust
.setup(|app| {
    // 获取主窗口
    let main_window = app.get_webview_window("main").unwrap();

    // 设置窗口大小
    main_window.set_size(Size::Logical(LogicalSize::new(1000.0, 700.0)))?;

    // 居中显示
    main_window.center()?;

    Ok(())
})
```

## 运行阶段

### 应用运行中

应用进入运行阶段后，主要处理：

1. **窗口事件** - 窗口移动、调整大小、关闭等
2. **IPC 调用** - 前端调用 Rust 命令
3. **事件处理** - 全局事件、窗口事件等
4. **菜单操作** - 用户点击菜单项
5. **托盘交互** - 系统托盘操作

### AppHandle

`AppHandle` 是应用的句柄，可以在任何地方访问应用：

```rust
use tauri::AppHandle;

#[command]
fn do_something(app: AppHandle) {
    // 获取窗口
    if let Some(window) = app.get_webview_window("main") {
        // 操作窗口
    }

    // 访问状态
    let state = app.state::<AppState>();

    // 发送事件
    app.emit_all("event", ()).unwrap();

    // 退出应用
    app.exit(0);

    // 重新启动
    app.restart();
}
```

### Manager trait

`Manager` trait 提供了管理窗口、状态等的功能：

```rust
use tauri::Manager;

fn example(app: &impl Manager) {
    // 获取窗口
    let window = app.get_webview_window("main").unwrap();

    // 获取所有窗口
    let windows = app.webview_windows();

    // 访问状态
    let state = app.state::<AppState>();

    // 管理状态
    app.manage(NewState::new());
}
```

## 关闭阶段

### 关闭流程

1. **关闭请求** - 用户点击关闭按钮或调用 `window.close()`
2. **关闭事件** - 触发 `tauri://close-requested` 事件
3. **决定关闭** - 可以阻止关闭或继续关闭
4. **窗口关闭** - 窗口被销毁
5. **应用退出** - 所有窗口关闭后应用退出

### 阻止关闭

```rust
use tauri::WindowEvent;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .on_window_event(|event| {
            if let WindowEvent::CloseRequested { api, .. } = event.event() {
                // 阻止关闭
                api.prevent_close();

                // 可以在这里显示确认对话框
                let window = event.window().clone();
                tauri::async_runtime::spawn(async move {
                    // 检查是否可以关闭
                    if can_close().await {
                        window.destroy().unwrap();
                    }
                });
            }
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 前端阻止关闭

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

await window.listen('tauri://close-requested', async (event) => {
  // 阻止关闭
  event.preventDefault()

  // 确认对话框
  const shouldClose = confirm('Are you sure you want to quit?')

  if (shouldClose) {
    // 保存数据
    await saveUnsavedData()

    // 继续关闭
    await window.destroy()
  }
})
```

### 清理工作

```rust
.setup(|app| {
    let app_handle = app.app_handle().clone();

    // 监听应用退出
    std::panic::set_hook(Box::new(move |panic_info| {
        // 清理工作
        cleanup(&app_handle);
    }));

    Ok(())
})

// 或者使用 Drop
struct Cleanup {
    app: AppHandle,
}

impl Drop for Cleanup {
    fn drop(&mut self) {
        // 清理代码
        println!("Cleaning up...");
    }
}
```

## 应用退出

### 退出应用

```rust
use tauri::AppHandle;

#[command]
fn quit_app(app: AppHandle) {
    // 正常退出
    app.exit(0);
}

#[command]
fn restart_app(app: AppHandle) {
    // 重新启动
    app.restart();
}
```

前端：
```typescript
import { getCurrent } from '@tauri-apps/api/app'

// 退出应用
await getCurrent().exit(0)

// 重新启动
await getCurrent().restart()
```

## 完整生命周期示例

```rust
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tauri::{Manager, State, Window};

#[derive(Debug, Default)]
struct AppState {
    initialized: Mutex<bool>,
    window_count: Mutex<usize>,
}

#[command]
fn app_initialized(state: State<AppState>) -> bool {
    *state.initialized.lock().unwrap()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    println!("Phase 1: Building application...");

    tauri::Builder::default()
        // 配置阶段
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![app_initialized])

        // 设置阶段
        .setup(|app| {
            println!("Phase 2: Setting up application...");

            let state = app.state::<AppState>();
            *state.initialized.lock().unwrap() = true;

            // 获取窗口
            let window = app.get_webview_window("main").unwrap();

            // 发送应用就绪事件
            window.emit("app-ready", ()).unwrap();

            println!("Phase 3: Application running...");

            Ok(())
        })

        // 窗口事件
        .on_window_event(|event| {
            match event.event() {
                tauri::WindowEvent::CloseRequested { api, .. } => {
                    println!("Phase 4: Close requested");
                    // 可以阻止关闭
                    // api.prevent_close();
                }
                tauri::WindowEvent::Destroyed => {
                    println!("Phase 5: Window destroyed");
                }
                _ => {}
            }
        })

        // 运行
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    println!("Phase 6: Application exited");
}
```

## 前端生命周期事件

```typescript
import { listen } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'

// 应用就绪
await listen('app-ready', () => {
  console.log('App is ready!')
})

// 窗口事件
const window = getCurrentWindow()

await window.listen('tauri://created', () => {
  console.log('Window created')
})

await window.listen('tauri://close-requested', (event) => {
  console.log('Close requested')
})

await window.listen('tauri://destroyed', () => {
  console.log('Window destroyed')
})

await window.listen('tauri://focus', () => {
  console.log('Window focused')
})

await window.listen('tauri://blur', () => {
  console.log('Window blurred')
})
```

## 最佳实践

### 1. 异步初始化

```rust
.setup(|app| {
    let app_handle = app.app_handle().clone();

    // 异步初始化
    tauri::async_runtime::spawn(async move {
        // 耗时的初始化工作
        let data = load_large_data().await;

        // 初始化完成后通知前端
        app_handle.emit_all("initialization-complete", data).unwrap();
    });

    Ok(())
})
```

### 2. 状态初始化顺序

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 1. 先初始化基本状态
    let config = Config::load();

    tauri::Builder::default()
        // 2. 添加到 Builder
        .manage(config)
        // 3. 在 setup 中使用
        .setup(|app| {
            let config = app.state::<Config>();
            // 使用 config
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 3. 错误处理

```rust
.setup(|app| {
    // 使用 ? 传播错误
    let config = Config::load()?;
    app.manage(config);

    Ok(())
})

// 或者处理错误
.setup(|app| {
    match Config::load() {
        Ok(config) => app.manage(config),
        Err(e) => {
            eprintln!("Failed to load config: {}", e);
            // 使用默认配置
            app.manage(Config::default());
        }
    }

    Ok(())
})
```

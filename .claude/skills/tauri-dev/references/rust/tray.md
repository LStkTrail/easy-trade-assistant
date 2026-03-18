# 系统托盘

本文档详细讲解 Tauri 中的系统托盘功能。

## 基本托盘

### 创建简单托盘

```rust
use tauri::{SystemTray, SystemTrayMenu, SystemTrayMenuItem, CustomMenuItem};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 创建托盘菜单
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("show", "Show"))
        .add_item(CustomMenuItem::new("hide", "Hide"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit", "Quit"));

    // 创建系统托盘
    let tray = SystemTray::new()
        .with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(tray)
        .on_system_tray_event(|app, event| {
            match event {
                SystemTrayEvent::LeftClick { .. } => {
                    // 左键点击显示/隐藏窗口
                    if let Some(window) = app.get_webview_window("main") {
                        if let Ok(is_visible) = window.is_visible() {
                            if is_visible {
                                let _ = window.hide();
                            } else {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    }
                }
                SystemTrayEvent::MenuItemClick { id, .. } => {
                    match id.as_str() {
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "hide" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.hide();
                            }
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 托盘图标

### 使用默认图标

```rust
use tauri::SystemTray;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 使用默认图标
    let tray = SystemTray::new();

    tauri::Builder::default()
        .system_tray(tray)
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 自定义图标

#### 从文件加载

```rust
use tauri::{SystemTray, Image};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 加载图标
    let icon = Image::from_path("icons/tray-icon.png")
        .expect("Failed to load tray icon");

    let tray = SystemTray::new()
        .with_icon(icon);

    tauri::Builder::default()
        .system_tray(tray)
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

#### 从字节加载

```rust
use tauri::{SystemTray, Image};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 嵌入图标
    const TRAY_ICON: &[u8] = include_bytes!("../icons/tray-icon.png");

    let icon = Image::from_bytes(TRAY_ICON)
        .expect("Failed to load tray icon");

    let tray = SystemTray::new()
        .with_icon(icon);

    tauri::Builder::default()
        .system_tray(tray)
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

#### 平台特定图标

```rust
use tauri::{SystemTray, Image};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(target_os = "windows")]
    let icon = Image::from_path("icons/tray-icon.ico")
        .expect("Failed to load Windows tray icon");

    #[cfg(target_os = "macos")]
    let icon = Image::from_path("icons/tray-icon.png")
        .expect("Failed to load macOS tray icon");

    #[cfg(target_os = "linux")]
    let icon = Image::from_path("icons/tray-icon.png")
        .expect("Failed to load Linux tray icon");

    let tray = SystemTray::new()
        .with_icon(icon);

    tauri::Builder::default()
        .system_tray(tray)
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 托盘菜单

### 基本菜单

```rust
use tauri::{SystemTrayMenu, SystemTrayMenuItem, CustomMenuItem};

fn create_tray_menu() -> SystemTrayMenu {
    SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("show", "Show Window"))
        .add_item(CustomMenuItem::new("hide", "Hide Window"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("about", "About"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit", "Quit"))
}
```

### 启用/禁用菜单项

```rust
use tauri::{SystemTrayMenu, CustomMenuItem};

fn create_tray_menu() -> SystemTrayMenu {
    SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("enabled", "Enabled Item"))
        .add_item(CustomMenuItem::new("disabled", "Disabled Item").disabled())
}
```

### 动态菜单

```rust
use tauri::{AppHandle, Manager, State};
use tauri::system_tray::SystemTrayHandle;
use tauri::{CustomMenuItem, SystemTrayMenu};
use std::sync::Mutex;

struct TrayState {
    is_online: Mutex<bool>,
}

#[command]
fn update_tray_menu(app: AppHandle, state: State<TrayState>) -> Result<(), String> {
    let mut is_online = state.is_online.lock().unwrap();
    *is_online = !*is_online;

    if let Some(tray) = app.tray_handle() {
        // 创建新菜单
        let new_menu = SystemTrayMenu::new()
            .add_item(CustomMenuItem::new(
                "status",
                if *is_online { "Online" } else { "Offline" }
            ))
            .add_native_item(tauri::SystemTrayMenuItem::Separator)
            .add_item(CustomMenuItem::new("quit", "Quit"));

        // 设置新菜单
        tray.set_menu(new_menu)
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}
```

## 托盘工具提示

```rust
use tauri::SystemTray;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let tray = SystemTray::new()
        .with_tooltip("My Tauri App");

    tauri::Builder::default()
        .system_tray(tray)
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 托盘事件

### 事件类型

```rust
use tauri::SystemTrayEvent;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .system_tray(SystemTray::new())
        .on_system_tray_event(|_app, event| {
            match event {
                // 左键点击
                SystemTrayEvent::LeftClick { position: _, size: _, .. } => {
                    println!("Left click");
                }
                // 右键点击
                SystemTrayEvent::RightClick { position: _, size: _, .. } => {
                    println!("Right click");
                }
                // 双击
                SystemTrayEvent::DoubleClick { position: _, size: _, .. } => {
                    println!("Double click");
                }
                // 鼠标进入
                SystemTrayEvent::MouseEnter { position: _, size: _, .. } => {
                    println!("Mouse enter");
                }
                // 鼠标离开
                SystemTrayEvent::MouseLeave { position: _, size: _, .. } => {
                    println!("Mouse leave");
                }
                // 菜单项点击
                SystemTrayEvent::MenuItemClick { id, .. } => {
                    println!("Menu item clicked: {}", id);
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 动态更新托盘

### 更新图标

```rust
use tauri::{AppHandle, Manager, Image};

#[command]
fn update_tray_icon(app: AppHandle, icon_path: String) -> Result<(), String> {
    if let Some(tray) = app.tray_handle() {
        let icon = Image::from_path(&icon_path)
            .map_err(|e| e.to_string())?;

        tray.set_icon(icon)
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[command]
fn set_tray_icon_state(app: AppHandle, is_active: bool) -> Result<(), String> {
    if let Some(tray) = app.tray_handle() {
        let icon_path = if is_active {
            "icons/tray-active.png"
        } else {
            "icons/tray-inactive.png"
        };

        let icon = Image::from_path(icon_path)
            .map_err(|e| e.to_string())?;

        tray.set_icon(icon)
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}
```

### 更新工具提示

```rust
use tauri::{AppHandle, Manager};

#[command]
fn update_tray_tooltip(app: AppHandle, text: String) -> Result<(), String> {
    if let Some(tray) = app.tray_handle() {
        tray.set_tooltip(&text)
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[command]
fn update_tray_tooltip_with_count(app: AppHandle, count: u32) -> Result<(), String> {
    if let Some(tray) = app.tray_handle() {
        let tooltip = if count > 0 {
            format!("My App ({} new messages)", count)
        } else {
            "My App".to_string()
        };

        tray.set_tooltip(&tooltip)
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}
```

### 更新菜单项

```rust
use tauri::{AppHandle, Manager};

#[command]
fn update_menu_item(app: AppHandle, id: String, new_text: String) -> Result<(), String> {
    if let Some(tray) = app.tray_handle() {
        tray.get_item(&id)
            .set_title(&new_text)
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[command]
fn toggle_menu_item(app: AppHandle, id: String) -> Result<bool, String> {
    if let Some(tray) = app.tray_handle() {
        let item = tray.get_item(&id);
        let is_enabled = item.is_enabled().map_err(|e| e.to_string())?;
        item.set_enabled(!is_enabled).map_err(|e| e.to_string())?;
        return Ok(!is_enabled);
    }
    Ok(false)
}
```

## 多托盘

### 创建多个托盘

```rust
use tauri::{SystemTray, SystemTrayMenu, CustomMenuItem};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 主托盘
    let main_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("main-action", "Main Action"))
        .add_item(CustomMenuItem::new("quit", "Quit"));

    let main_tray = SystemTray::new()
        .with_id("main")
        .with_menu(main_menu);

    // 辅助托盘
    let secondary_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("secondary-action", "Secondary Action"));

    let secondary_tray = SystemTray::new()
        .with_id("secondary")
        .with_menu(secondary_menu);

    tauri::Builder::default()
        .system_tray(main_tray)
        .system_tray(secondary_tray)
        .on_system_tray_event(|app, event| {
            if let SystemTrayEvent::MenuItemClick { id, tray_id, .. } = event {
                match (tray_id.as_str(), id.as_str()) {
                    ("main", "main-action") => {
                        println!("Main tray action");
                    }
                    ("secondary", "secondary-action") => {
                        println!("Secondary tray action");
                    }
                    ("main", "quit") => {
                        app.exit(0);
                    }
                    _ => {}
                }
            }
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 访问特定托盘

```rust
use tauri::{AppHandle, Manager};

#[command]
fn update_specific_tray(app: AppHandle, tray_id: String) -> Result<(), String> {
    if let Some(tray) = app.tray_handle_by_id(&tray_id) {
        tray.set_tooltip(&format!("Tray: {}", tray_id))
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}
```

## 完整示例：完整托盘应用

```rust
use tauri::{
    AppHandle, Manager, State, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem, CustomMenuItem, Image, Window
};
use std::sync::{Arc, Mutex};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Notification {
    id: u32,
    title: String,
    message: String,
}

struct AppState {
    notifications: Arc<Mutex<Vec<Notification>>>,
    is_online: Arc<Mutex<bool>>,
}

fn create_tray_menu(has_notifications: bool, is_online: bool) -> SystemTrayMenu {
    let status_text = if is_online { "Online" } else { "Offline" };
    let notifications_text = if has_notifications {
        "View Notifications (!)"
    } else {
        "View Notifications"
    };

    SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("status", status_text).disabled())
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("show", "Show Window"))
        .add_item(CustomMenuItem::new("hide", "Hide Window"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("notifications", notifications_text))
        .add_item(CustomMenuItem::new("toggle-online", if is_online { "Go Offline" } else { "Go Online" }))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("about", "About"))
        .add_item(CustomMenuItem::new("quit", "Quit"))
}

fn update_tray(app: &AppHandle, state: &State<AppState>) {
    let notifications = state.notifications.lock().unwrap();
    let is_online = state.is_online.lock().unwrap();

    let has_notifications = !notifications.is_empty();
    let new_menu = create_tray_menu(has_notifications, *is_online);

    if let Some(tray) = app.tray_handle() {
        let _ = tray.set_menu(new_menu);

        // 更新图标
        let icon_path = if *is_online {
            if has_notifications {
                "icons/tray-notification.png"
            } else {
                "icons/tray-online.png"
            }
        } else {
            "icons/tray-offline.png"
        };

        if let Ok(icon) = Image::from_path(icon_path) {
            let _ = tray.set_icon(icon);
        }

        // 更新工具提示
        let tooltip = if has_notifications {
            format!("My App ({} notifications)", notifications.len())
        } else {
            "My App".to_string()
        };
        let _ = tray.set_tooltip(&tooltip);
    }
}

#[command]
fn add_notification(
    app: AppHandle,
    state: State<AppState>,
    title: String,
    message: String
) -> Result<(), String> {
    let mut notifications = state.notifications.lock().unwrap();
    let id = notifications.len() as u32 + 1;

    notifications.push(Notification {
        id,
        title,
        message,
    });
    drop(notifications);

    update_tray(&app, &state);
    Ok(())
}

#[command]
fn toggle_online_status(app: AppHandle, state: State<AppState>) -> Result<bool, String> {
    let mut is_online = state.is_online.lock().unwrap();
    *is_online = !*is_online;
    let result = *is_online;
    drop(is_online);

    update_tray(&app, &state);
    Ok(result)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let initial_menu = create_tray_menu(false, true);
    let tray = SystemTray::new()
        .with_menu(initial_menu)
        .with_tooltip("My App");

    tauri::Builder::default()
        .manage(AppState {
            notifications: Arc::new(Mutex::new(Vec::new())),
            is_online: Arc::new(Mutex::new(true)),
        })
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                if let Some(window) = app.get_webview_window("main") {
                    if let Ok(is_visible) = window.is_visible() {
                        if is_visible {
                            let _ = window.hide();
                        } else {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                }
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
                let state = app.state::<AppState>();
                match id.as_str() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "hide" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.hide();
                        }
                    }
                    "notifications" => {
                        app.emit("show-notifications", ()).unwrap();
                    }
                    "toggle-online" => {
                        let _ = toggle_online_status(app.clone(), state);
                    }
                    "about" => {
                        app.emit("show-about", ()).unwrap();
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                }
            }
            _ => {}
        })
        .setup(|app| {
            // 初始更新
            let state = app.state::<AppState>();
            update_tray(&app.app_handle(), &state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            add_notification,
            toggle_online_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 平台特定注意事项

### Windows

- 推荐使用 `.ico` 格式图标
- 托盘图标尺寸通常为 16x16 或 32x32

### macOS

- 推荐使用 PNG 格式图标
- 托盘图标尺寸通常为 18x18 (2x 为 36x36)
- 可以使用模板图标（黑色和透明）

### Linux

- 推荐使用 PNG 格式图标
- 托盘图标尺寸通常为 22x22 或 24x24
- 某些桌面环境可能不支持系统托盘

## 最佳实践

1. **提供显示/隐藏功能** - 总是允许用户通过托盘显示和隐藏窗口
2. **状态指示** - 使用图标和工具提示显示应用状态
3. **退出选项** - 总是提供退出应用的选项
4. **平台适配** - 为不同平台使用合适的图标格式
5. **动态更新** - 及时更新托盘菜单和图标以反映应用状态

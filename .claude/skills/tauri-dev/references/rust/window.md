# 窗口操作

本文档详细讲解如何在 Rust 后端操作窗口。

## 获取窗口

### 获取当前窗口

```rust
use tauri::Window;

#[command]
fn get_current_window(window: Window) {
    // window 是当前窗口
    println!("Window label: {}", window.label());
}
```

### 通过 AppHandle 获取窗口

```rust
use tauri::{AppHandle, Manager};

#[command]
fn get_window_by_label(app: AppHandle) {
    // 获取指定标签的窗口
    if let Some(window) = app.get_webview_window("main") {
        println!("Found window: {}", window.label());
    }

    // 获取所有窗口
    let windows = app.webview_windows();
    for (label, window) in windows {
        println!("Window: {}", label);
    }
}
```

### 通过 Manager trait 获取

```rust
use tauri::Manager;

fn example(manager: &impl Manager) {
    // 获取主窗口
    let window = manager.get_webview_window("main").unwrap();

    // 获取所有窗口
    let all_windows = manager.webview_windows();
}
```

## 窗口标题

```rust
use tauri::Window;

#[command]
fn set_window_title(window: Window, title: String) -> Result<(), String> {
    window.set_title(&title)
        .map_err(|e| e.to_string())
}

#[command]
fn get_window_title(window: Window) -> Result<String, String> {
    window.title()
        .map_err(|e| e.to_string())
}
```

## 窗口大小

```rust
use tauri::{Window, Size, LogicalSize, PhysicalSize};

#[command]
fn set_window_size(window: Window) -> Result<(), String> {
    // 设置逻辑大小（与 DPI 无关）
    window.set_size(Size::Logical(LogicalSize::new(800.0, 600.0)))
        .map_err(|e| e.to_string())?;

    // 设置物理大小（实际像素）
    window.set_size(Size::Physical(PhysicalSize::new(1920, 1080)))
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
fn get_window_size(window: Window) -> Result<(), String> {
    // 获取内部大小
    let inner_size = window.inner_size()
        .map_err(|e| e.to_string())?;
    println!("Inner size: {:?}", inner_size);

    // 获取外部大小
    let outer_size = window.outer_size()
        .map_err(|e| e.to_string())?;
    println!("Outer size: {:?}", outer_size);

    Ok(())
}

#[command]
fn set_min_max_size(window: Window) -> Result<(), String> {
    // 设置最小大小
    window.set_min_size(Some(Size::Logical(LogicalSize::new(400.0, 300.0))))
        .map_err(|e| e.to_string())?;

    // 设置最大大小
    window.set_max_size(Some(Size::Logical(LogicalSize::new(1200.0, 900.0))))
        .map_err(|e| e.to_string())?;

    // 清除限制
    window.set_min_size(None::<Size>)
        .map_err(|e| e.to_string())?;
    window.set_max_size(None::<Size>)
        .map_err(|e| e.to_string())?;

    Ok(())
}
```

## 窗口位置

```rust
use tauri::{Window, Position, LogicalPosition, PhysicalPosition};

#[command]
fn set_window_position(window: Window) -> Result<(), String> {
    // 设置逻辑位置
    window.set_position(Position::Logical(LogicalPosition::new(100.0, 100.0)))
        .map_err(|e| e.to_string())?;

    // 设置物理位置
    window.set_position(Position::Physical(PhysicalPosition::new(200, 200)))
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
fn get_window_position(window: Window) -> Result<(), String> {
    // 获取外部位置
    let position = window.outer_position()
        .map_err(|e| e.to_string())?;
    println!("Position: {:?}", position);

    Ok(())
}

#[command]
fn center_window(window: Window) -> Result<(), String> {
    // 居中显示
    window.center()
        .map_err(|e| e.to_string())
}
```

## 窗口状态

```rust
use tauri::Window;

#[command]
fn window_state_operations(window: Window) -> Result<(), String> {
    // 最小化
    window.minimize()
        .map_err(|e| e.to_string())?;

    // 取消最小化
    window.unminimize()
        .map_err(|e| e.to_string())?;

    // 最大化
    window.maximize()
        .map_err(|e| e.to_string())?;

    // 取消最大化
    window.unmaximize()
        .map_err(|e| e.to_string())?;

    // 切换最大化
    window.toggle_maximize()
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
fn check_window_state(window: Window) -> Result<(), String> {
    // 检查是否最大化
    let is_maximized = window.is_maximized()
        .map_err(|e| e.to_string())?;
    println!("Is maximized: {}", is_maximized);

    // 检查是否最小化
    let is_minimized = window.is_minimized()
        .map_err(|e| e.to_string())?;
    println!("Is minimized: {}", is_minimized);

    // 检查是否聚焦
    let is_focused = window.is_focused()
        .map_err(|e| e.to_string())?;
    println!("Is focused: {}", is_focused);

    Ok(())
}
```

## 全屏模式

```rust
use tauri::Window;

#[command]
fn set_fullscreen(window: Window, fullscreen: bool) -> Result<(), String> {
    window.set_fullscreen(fullscreen)
        .map_err(|e| e.to_string())
}

#[command]
fn is_fullscreen(window: Window) -> Result<bool, String> {
    window.is_fullscreen()
        .map_err(|e| e.to_string())
}
```

## 显示和隐藏

```rust
use tauri::Window;

#[command]
fn show_hide_window(window: Window) -> Result<(), String> {
    // 隐藏窗口
    window.hide()
        .map_err(|e| e.to_string())?;

    // 显示窗口
    window.show()
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
fn is_visible(window: Window) -> Result<bool, String> {
    window.is_visible()
        .map_err(|e| e.to_string())
}
```

## 焦点

```rust
use tauri::Window;

#[command]
fn set_focus(window: Window) -> Result<(), String> {
    window.set_focus()
        .map_err(|e| e.to_string())
}

#[command]
fn request_user_attention(window: Window) -> Result<(), String> {
    // 请求用户注意（在任务栏闪烁）
    window.request_user_attention(None)
        .map_err(|e| e.to_string())
}
```

## 关闭和销毁

```rust
use tauri::Window;

#[command]
fn close_window(window: Window) -> Result<(), String> {
    window.close()
        .map_err(|e| e.to_string())
}

#[command]
fn destroy_window(window: Window) -> Result<(), String> {
    window.destroy()
        .map_err(|e| e.to_string())
}
```

## 窗口装饰

```rust
use tauri::Window;

#[command]
fn set_decorations(window: Window, decorations: bool) -> Result<(), String> {
    // 设置是否显示标题栏和边框
    window.set_decorations(decorations)
        .map_err(|e| e.to_string())
}

#[command]
fn is_decorated(window: Window) -> Result<bool, String> {
    window.is_decorated()
        .map_err(|e| e.to_string())
}
```

## 窗口透明度 (macOS)

```rust
use tauri::Window;

#[command]
fn set_opacity(window: Window, opacity: f32) -> Result<(), String> {
    // 设置窗口透明度 (0.0 - 1.0)
    // 仅 macOS 支持
    window.set_opacity(opacity)
        .map_err(|e| e.to_string())
}

#[command]
fn get_opacity(window: Window) -> Result<f32, String> {
    window.opacity()
        .map_err(|e| e.to_string())
}
```

## 窗口阴影

```rust
use tauri::Window;

#[command]
fn set_shadow(window: Window, enable: bool) -> Result<(), String> {
    window.set_shadow(enable)
        .map_err(|e| e.to_string())
}
```

## 内容保护

```rust
use tauri::Window;

#[command]
fn set_content_protected(window: Window, protect: bool) -> Result<(), String> {
    // 启用内容保护，防止屏幕录制
    window.set_content_protected(protect)
        .map_err(|e| e.to_string())
}
```

## 跳过任务栏

```rust
use tauri::Window;

#[command]
fn set_skip_taskbar(window: Window, skip: bool) -> Result<(), String> {
    // 在任务栏中隐藏窗口
    window.set_skip_taskbar(skip)
        .map_err(|e| e.to_string())
}
```

## 置顶/置底

```rust
use tauri::Window;

#[command]
fn set_always_on_top(window: Window, always_on_top: bool) -> Result<(), String> {
    window.set_always_on_top(always_on_top)
        .map_err(|e| e.to_string())
}

#[command]
fn set_always_on_bottom(window: Window, always_on_bottom: bool) -> Result<(), String> {
    window.set_always_on_bottom(always_on_bottom)
        .map_err(|e| e.to_string())
}
```

## 窗口图标

```rust
use tauri::{Window, image::Image};

#[command]
fn set_window_icon(window: Window, icon_path: String) -> Result<(), String> {
    // 从文件加载图标
    let icon = Image::from_path(icon_path)
        .map_err(|e| e.to_string())?;

    window.set_icon(icon)
        .map_err(|e| e.to_string())
}

#[command]
fn set_window_icon_from_bytes(window: Window, bytes: Vec<u8>) -> Result<(), String> {
    // 从字节加载图标
    let icon = Image::from_bytes(&bytes)
        .map_err(|e| e.to_string())?;

    window.set_icon(icon)
        .map_err(|e| e.to_string())
}
```

## 窗口主题

```rust
use tauri::{Window, Theme};

#[command]
fn set_theme(window: Window, theme: String) -> Result<(), String> {
    let t = match theme.as_str() {
        "light" => Theme::Light,
        "dark" => Theme::Dark,
        _ => Theme::System,
    };

    window.set_theme(Some(t))
        .map_err(|e| e.to_string())
}

#[command]
fn get_theme(window: Window) -> Result<String, String> {
    let theme = window.theme()
        .map_err(|e| e.to_string())?;

    Ok(match theme {
        Theme::Light => "light".to_string(),
        Theme::Dark => "dark".to_string(),
        Theme::System => "system".to_string(),
    })
}
```

## 窗口事件

```rust
use tauri::{Window, WindowEvent};

#[command]
fn listen_to_window_events(window: Window) {
    window.on_window_event(|event| {
        match event {
            WindowEvent::Resized(size) => {
                println!("Resized to: {:?}", size);
            }
            WindowEvent::Moved(position) => {
                println!("Moved to: {:?}", position);
            }
            WindowEvent::CloseRequested { api, .. } => {
                println!("Close requested");
                // 可以阻止关闭
                // api.prevent_close();
            }
            WindowEvent::Destroyed => {
                println!("Window destroyed");
            }
            WindowEvent::Focused(focused) => {
                println!("Focused: {}", focused);
            }
            WindowEvent::ScaleFactorChanged { scale_factor, .. } => {
                println!("Scale factor: {}", scale_factor);
            }
            WindowEvent::ThemeChanged(theme) => {
                println!("Theme changed: {:?}", theme);
            }
            _ => {}
        }
    });
}
```

## 监听事件（一次性）

```rust
use tauri::Window;

#[command]
fn listen_once(window: Window) {
    window.once("custom-event", |event| {
        println!("Got event: {:?}", event.payload());
    });
}
```

## 发送事件

```rust
use tauri::Window;

#[command]
fn emit_to_window(window: Window, message: String) -> Result<(), String> {
    // 发送事件到当前窗口
    window.emit("window-event", message)
        .map_err(|e| e.to_string())?;

    // 发送事件到所有窗口
    window.emit_all("global-event", ())
        .map_err(|e| e.to_string())?;

    Ok(())
}
```

## 窗口菜单

```rust
use tauri::{Window, menu::{Menu, MenuItem, Submenu}};

#[command]
fn set_window_menu(window: Window) -> Result<(), String> {
    let menu = Menu::new()
        .add_submenu(Submenu::new(
            "File",
            Menu::new()
                .add_item(MenuItem::with_id("new", "New", true, None::<&str>))
                .add_item(MenuItem::with_id("open", "Open", true, None::<&str>))
                .add_item(MenuItem::with_id("save", "Save", true, None::<&str>))
        ));

    window.set_menu(menu)
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
fn remove_window_menu(window: Window) -> Result<(), String> {
    window.remove_menu()
        .map_err(|e| e.to_string())
}
```

## 拖动区域

```rust
// 在 HTML 中标记可拖动区域
// <div data-tauri-drag-region style="height: 30px; background: #333;">
//   标题栏
// </div>
```

## 监视器信息

```rust
use tauri::Window;

#[command]
fn get_monitor_info(window: Window) -> Result<(), String> {
    // 当前监视器
    if let Some(monitor) = window.current_monitor().map_err(|e| e.to_string())? {
        println!("Current monitor: {:?}", monitor.name());
        println!("Size: {:?}", monitor.size());
        println!("Position: {:?}", monitor.position());
        println!("Scale factor: {}", monitor.scale_factor());
    }

    // 主监视器
    if let Some(monitor) = window.primary_monitor().map_err(|e| e.to_string())? {
        println!("Primary monitor: {:?}", monitor.name());
    }

    // 所有监视器
    let monitors = window.available_monitors().map_err(|e| e.to_string())?;
    for monitor in monitors {
        println!("Monitor: {:?}", monitor.name());
    }

    Ok(())
}
```

## 缩放因子

```rust
use tauri::Window;

#[command]
fn get_scale_factor(window: Window) -> Result<f64, String> {
    window.scale_factor()
        .map_err(|e| e.to_string())
}
```

## 光标操作

```rust
use tauri::{Window, CursorIcon};

#[command]
fn set_cursor_icon(window: Window, icon: String) -> Result<(), String> {
    let cursor_icon = match icon.as_str() {
        "default" => CursorIcon::Default,
        "pointer" => CursorIcon::Hand,
        "text" => CursorIcon::Text,
        "crosshair" => CursorIcon::Crosshair,
        "wait" => CursorIcon::Wait,
        _ => CursorIcon::Default,
    };

    window.set_cursor_icon(cursor_icon)
        .map_err(|e| e.to_string())
}

#[command]
fn set_cursor_position(window: Window, x: f64, y: f64) -> Result<(), String> {
    use tauri::Position;
    use tauri::LogicalPosition;

    window.set_cursor_position(Position::Logical(LogicalPosition::new(x, y)))
        .map_err(|e| e.to_string())
}

#[command]
fn set_cursor_grab(window: Window, grab: bool) -> Result<(), String> {
    window.set_cursor_grab(grab)
        .map_err(|e| e.to_string())
}

#[command]
fn set_cursor_visible(window: Window, visible: bool) -> Result<(), String> {
    window.set_cursor_visible(visible)
        .map_err(|e| e.to_string())
}
```

## 窗口句柄

```rust
use tauri::Window;

#[command]
fn get_window_handle(window: Window) -> Result<(), String> {
    let handle = window.hwnd();

    // 平台特定操作
    #[cfg(windows)]
    {
        use windows::Win32::UI::WindowsAndMessaging::*;
        unsafe {
            SetWindowTextA(handle, "New Title");
        }
    }

    #[cfg(target_os = "macos")]
    {
        // macOS 特定操作
    }

    #[cfg(target_os = "linux")]
    {
        // Linux 特定操作
    }

    Ok(())
}
```

## 完整示例：窗口管理器

```rust
use tauri::{AppHandle, Manager, Window, State};
use std::sync::Mutex;

struct WindowManager {
    main_window: Mutex<Option<String>>,
}

#[command]
fn create_settings_window(app: AppHandle, state: State<WindowManager>) -> Result<(), String> {
    use tauri::WebviewWindowBuilder;

    let window = WebviewWindowBuilder::new(&app, "settings", tauri::WebviewUrl::App("settings.html".into()))
        .title("Settings")
        .inner_size(600.0, 400.0)
        .center()
        .build()
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
fn toggle_window_visibility(app: AppHandle, label: String) -> Result<(), String> {
    if let Some(window) = app.get_webview_window(&label) {
        if window.is_visible().unwrap_or(false) {
            window.hide().map_err(|e| e.to_string())?;
        } else {
            window.show().map_err(|e| e.to_string())?;
            window.set_focus().map_err(|e| e.to_string())?;
        }
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(WindowManager {
            main_window: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![
            create_settings_window,
            toggle_window_visibility,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 最佳实践

1. **错误处理**：始终处理窗口操作的错误
2. **事件监听**：在 setup 中设置事件监听器
3. **窗口标签**：使用有意义的窗口标签
4. **避免阻塞**：不要在窗口事件回调中执行耗时操作

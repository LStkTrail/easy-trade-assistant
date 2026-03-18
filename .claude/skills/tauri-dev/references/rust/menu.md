# 菜单系统

本文档详细讲解 Tauri 中的菜单系统。

## 菜单类型

Tauri 提供了多种菜单类型：

- **Menu** - 菜单容器
- **MenuItem** - 标准菜单项
- **Submenu** - 子菜单
- **CheckMenuItem** - 可勾选的菜单项
- **IconMenuItem** - 带图标的菜单项
- **PredefinedMenuItem** - 预定义菜单项

## 基本菜单

### 创建应用菜单

```rust
use tauri::menu::{Menu, MenuItem, Submenu};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let menu = Menu::new()
        // 文件菜单
        .add_submenu(Submenu::new(
            "File",
            Menu::new()
                .add_item(MenuItem::with_id("new", "New", true, Some("CmdOrCtrl+N")))
                .add_item(MenuItem::with_id("open", "Open", true, Some("CmdOrCtrl+O")))
                .add_native_item(tauri::menu::PredefinedMenuItem::separator())
                .add_item(MenuItem::with_id("save", "Save", true, Some("CmdOrCtrl+S")))
                .add_item(MenuItem::with_id("save-as", "Save As...", true, Some("CmdOrCtrl+Shift+S")))
                .add_native_item(tauri::menu::PredefinedMenuItem::separator())
                .add_item(MenuItem::with_id("quit", "Quit", true, Some("CmdOrCtrl+Q")))
        ))
        // 编辑菜单
        .add_submenu(Submenu::new(
            "Edit",
            Menu::new()
                .add_native_item(tauri::menu::PredefinedMenuItem::undo(None))
                .add_native_item(tauri::menu::PredefinedMenuItem::redo(None))
                .add_native_item(tauri::menu::PredefinedMenuItem::separator())
                .add_native_item(tauri::menu::PredefinedMenuItem::cut(None))
                .add_native_item(tauri::menu::PredefinedMenuItem::copy(None))
                .add_native_item(tauri::menu::PredefinedMenuItem::paste(None))
                .add_native_item(tauri::menu::PredefinedMenuItem::selectAll(None))
        ))
        // 视图菜单
        .add_submenu(Submenu::new(
            "View",
            Menu::new()
                .add_item(MenuItem::with_id("zoom-in", "Zoom In", true, Some("CmdOrCtrl+Plus")))
                .add_item(MenuItem::with_id("zoom-out", "Zoom Out", true, Some("CmdOrCtrl+-")))
                .add_item(MenuItem::with_id("zoom-reset", "Reset Zoom", true, Some("CmdOrCtrl+0")))
                .add_native_item(tauri::menu::PredefinedMenuItem::separator())
                .add_item(MenuItem::with_id("toggle-fullscreen", "Toggle Fullscreen", true, Some("F11")))
        ))
        // 帮助菜单
        .add_submenu(Submenu::new(
            "Help",
            Menu::new()
                .add_item(MenuItem::with_id("about", "About", true, None::<&str>))
                .add_item(MenuItem::with_id("docs", "Documentation", true, None::<&str>))
        ));

    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| {
            match event.menu_item_id() {
                "new" => { /* 新建文件 */ }
                "open" => { /* 打开文件 */ }
                "save" => { /* 保存文件 */ }
                "quit" => {
                    event.window().app_handle().exit(0);
                }
                "about" => { /* 显示关于 */ }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 菜单项类型

### MenuItem - 标准菜单项

```rust
use tauri::menu::MenuItem;

// 创建菜单项
let menu_item = MenuItem::with_id(
    "my-item",      // ID
    "My Menu Item", // 文本
    true,           // 是否启用
    Some("CmdOrCtrl+M") // 快捷键
);

// 或者使用 builder
let menu_item = MenuItem::builder("My Menu Item")
    .id("my-item")
    .enabled(true)
    .accelerator("CmdOrCtrl+M")
    .build()?;
```

### Submenu - 子菜单

```rust
use tauri::menu::{Submenu, Menu, MenuItem};

let submenu = Submenu::new(
    "File",
    Menu::new()
        .add_item(MenuItem::with_id("new", "New", true, None::<&str>))
        .add_item(MenuItem::with_id("open", "Open", true, None::<&str>))
);

// 或者使用 builder
let submenu = Submenu::builder("File")
    .id("file-menu")
    .enabled(true)
    .build()?;
submenu.append(&MenuItem::with_id("new", "New", true, None::<&str>))?;
```

### CheckMenuItem - 可勾选菜单项

```rust
use tauri::menu::CheckMenuItem;

let check_item = CheckMenuItem::with_id(
    "show-sidebar",
    "Show Sidebar",
    true,    // 默认选中
    true,    // 是否启用
    None::<&str>
);

// 获取选中状态
let is_checked = check_item.is_checked()?;

// 设置选中状态
check_item.set_checked(true)?;
```

### IconMenuItem - 带图标的菜单项

```rust
use tauri::menu::IconMenuItem;
use tauri::image::Image;

// 从文件加载图标
let icon = Image::from_path("path/to/icon.png")?;

let icon_item = IconMenuItem::with_id(
    "with-icon",
    "With Icon",
    true,
    Some(icon),
    None::<&str>
);
```

### PredefinedMenuItem - 预定义菜单项

```rust
use tauri::menu::PredefinedMenuItem;

let menu = Menu::new()
    .add_native_item(PredefinedMenuItem::separator())
    .add_native_item(PredefinedMenuItem::copy(None))
    .add_native_item(PredefinedMenuItem::cut(None))
    .add_native_item(PredefinedMenuItem::paste(None))
    .add_native_item(PredefinedMenuItem::selectAll(None))
    .add_native_item(PredefinedMenuItem::undo(None))
    .add_native_item(PredefinedMenuItem::redo(None))
    .add_native_item(PredefinedMenuItem::separator())
    .add_native_item(PredefinedMenuItem::hide(None))
    .add_native_item(PredefinedMenuItem::hideOthers(None))
    .add_native_item(PredefinedMenuItem::showAll(None))
    .add_native_item(PredefinedMenuItem::quit(None))
    .add_native_item(PredefinedMenuItem::separator())
    .add_native_item(PredefinedMenuItem::about(None, None))
    .add_native_item(PredefinedMenuItem::services(None));
```

## 菜单操作

### 动态添加菜单项

```rust
use tauri::{AppHandle, Manager};
use tauri::menu::{Menu, MenuItem};

#[command]
fn add_menu_item(app: AppHandle, id: String, text: String) -> Result<(), String> {
    let window = app.get_webview_window("main").unwrap();

    if let Some(menu) = window.menu() {
        let new_item = MenuItem::with_id(&id, &text, true, None::<&str>);
        menu.append(&new_item).map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[command]
fn add_submenu(app: AppHandle, text: String) -> Result<(), String> {
    let window = app.get_webview_window("main").unwrap();

    if let Some(menu) = window.menu() {
        let submenu = Menu::new()
            .add_item(MenuItem::with_id("sub-item1", "Item 1", true, None::<&str>))
            .add_item(MenuItem::with_id("sub-item2", "Item 2", true, None::<&str>));

        menu.add_submenu(tauri::menu::Submenu::new(&text, submenu))
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}
```

### 移除菜单项

```rust
use tauri::{AppHandle, Manager};
use tauri::menu::Menu;

#[command]
fn remove_menu_item(app: AppHandle, id: String) -> Result<(), String> {
    let window = app.get_webview_window("main").unwrap();

    if let Some(menu) = window.menu() {
        // 通过索引移除
        menu.remove_at(0).map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[command]
fn clear_menu(app: AppHandle) -> Result<(), String> {
    let window = app.get_webview_window("main").unwrap();

    if let Some(menu) = window.menu() {
        // 清除所有菜单项
        for i in (0..menu.items().map_err(|e| e.to_string())?.len()).rev() {
            menu.remove_at(i).map_err(|e| e.to_string())?;
        }
    }

    Ok(())
}
```

### 更新菜单项

```rust
use tauri::{AppHandle, Manager};
use tauri::menu::MenuItem;

#[command]
fn update_menu_item(
    app: AppHandle,
    id: String,
    new_text: String
) -> Result<(), String> {
    let window = app.get_webview_window("main").unwrap();

    if let Some(menu) = window.menu() {
        // 遍历查找菜单项
        if let Ok(items) = menu.items() {
            for item in items {
                if let Some(menu_item) = item.as_menuitem() {
                    if menu_item.id() == id {
                        menu_item.set_text(&new_text).map_err(|e| e.to_string())?;
                    }
                }
            }
        }
    }

    Ok(())
}

#[command]
fn toggle_menu_item(
    app: AppHandle,
    id: String
) -> Result<bool, String> {
    let window = app.get_webview_window("main").unwrap();

    if let Some(menu) = window.menu() {
        if let Ok(items) = menu.items() {
            for item in items {
                if let Some(menu_item) = item.as_menuitem() {
                    if menu_item.id() == id {
                        let is_enabled = menu_item.is_enabled().map_err(|e| e.to_string())?;
                        menu_item.set_enabled(!is_enabled).map_err(|e| e.to_string())?;
                        return Ok(!is_enabled);
                    }
                }
            }
        }
    }

    Err("Menu item not found".to_string())
}
```

### 设置窗口菜单

```rust
use tauri::{Window, menu::{Menu, MenuItem, Submenu}};

#[command]
fn set_window_menu(window: Window) -> Result<(), String> {
    let menu = Menu::new()
        .add_submenu(Submenu::new(
            "File",
            Menu::new()
                .add_item(MenuItem::with_id("new", "New", true, Some("CmdOrCtrl+N")))
                .add_item(MenuItem::with_id("open", "Open", true, Some("CmdOrCtrl+O")))
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

## 快捷键

### 快捷键语法

```rust
use tauri::menu::MenuItem;

// 常用快捷键
let shortcuts = [
    "CmdOrCtrl+N",      // Command 或 Control + N
    "CmdOrCtrl+Shift+S", // Command/Control + Shift + S
    "Alt+F4",           // Alt + F4
    "Ctrl+Shift+Esc",    // Control + Shift + Escape
    "F11",              // F11
    "Delete",           // Delete
    "Cmd+.",            // Command + .
];

for shortcut in shortcuts {
    let item = MenuItem::with_id(
        shortcut,
        shortcut,
        true,
        Some(shortcut)
    );
}
```

### 修饰键

| 修饰键 | 描述 |
|--------|------|
| `Cmd` | Command (macOS) |
| `Ctrl` | Control |
| `Alt` | Alt |
| `Shift` | Shift |
| `CmdOrCtrl` | Command (macOS) 或 Control (其他) |
| `Option` | Option (macOS，同 Alt) |
| `Super` | Windows 键 |

## 菜单事件处理

### 在 Builder 中处理

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .menu(create_menu())
        .on_menu_event(|event| {
            match event.menu_item_id() {
                "new" => {
                    println!("New file");
                }
                "open" => {
                    println!("Open file");
                }
                "save" => {
                    println!("Save file");
                }
                "quit" => {
                    event.window().app_handle().exit(0);
                }
                "about" => {
                    // 显示关于对话框
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 监听菜单事件

```rust
use tauri::{Window, Manager};

#[command]
fn listen_to_menu_events(window: Window) {
    window.on_menu_event(|event| {
        println!("Menu event: {}", event.menu_item_id());
    });
}
```

## 上下文菜单

### 创建上下文菜单

```rust
use tauri::menu::{Menu, MenuItem};
use tauri::Window;

#[command]
fn show_context_menu(window: Window) -> Result<(), String> {
    let context_menu = Menu::new()
        .add_item(MenuItem::with_id("cut", "Cut", true, Some("CmdOrCtrl+X")))
        .add_item(MenuItem::with_id("copy", "Copy", true, Some("CmdOrCtrl+C")))
        .add_item(MenuItem::with_id("paste", "Paste", true, Some("CmdOrCtrl+V")))
        .add_native_item(tauri::menu::PredefinedMenuItem::separator())
        .add_item(MenuItem::with_id("inspect", "Inspect Element", true, None::<&str>));

    context_menu.show_on_window(&window, None::<(f64, f64)>)
        .map_err(|e| e.to_string())?;

    Ok(())
}
```

### 在指定位置显示

```rust
use tauri::{Window, menu::Menu};

#[command]
fn show_context_menu_at(window: Window, x: f64, y: f64) -> Result<(), String> {
    let context_menu = create_context_menu();

    context_menu.show_on_window(&window, Some((x, y)))
        .map_err(|e| e.to_string())?;

    Ok(())
}
```

## 完整示例：编辑器菜单

```rust
use tauri::{AppHandle, Manager, Window};
use tauri::menu::{Menu, MenuItem, Submenu, CheckMenuItem, PredefinedMenuItem};

fn create_editor_menu() -> Menu {
    Menu::new()
        // 文件菜单
        .add_submenu(Submenu::new(
            "File",
            Menu::new()
                .add_item(MenuItem::with_id("new-file", "New", true, Some("CmdOrCtrl+N")))
                .add_item(MenuItem::with_id("open-file", "Open...", true, Some("CmdOrCtrl+O")))
                .add_native_item(PredefinedMenuItem::separator())
                .add_item(MenuItem::with_id("save", "Save", true, Some("CmdOrCtrl+S")))
                .add_item(MenuItem::with_id("save-as", "Save As...", true, Some("CmdOrCtrl+Shift+S")))
                .add_native_item(PredefinedMenuItem::separator())
                .add_item(MenuItem::with_id("quit", "Quit", true, Some("CmdOrCtrl+Q")))
        ))
        // 编辑菜单
        .add_submenu(Submenu::new(
            "Edit",
            Menu::new()
                .add_native_item(PredefinedMenuItem::undo(None))
                .add_native_item(PredefinedMenuItem::redo(None))
                .add_native_item(PredefinedMenuItem::separator())
                .add_native_item(PredefinedMenuItem::cut(None))
                .add_native_item(PredefinedMenuItem::copy(None))
                .add_native_item(PredefinedMenuItem::paste(None))
                .add_native_item(PredefinedMenuItem::separator())
                .add_native_item(PredefinedMenuItem::selectAll(None))
        ))
        // 视图菜单
        .add_submenu(Submenu::new(
            "View",
            Menu::new()
                .add_item(CheckMenuItem::with_id("show-sidebar", "Show Sidebar", true, true, None::<&str>))
                .add_item(CheckMenuItem::with_id("show-status-bar", "Show Status Bar", true, true, None::<&str>))
                .add_native_item(PredefinedMenuItem::separator())
                .add_item(MenuItem::with_id("zoom-in", "Zoom In", true, Some("CmdOrCtrl+Plus")))
                .add_item(MenuItem::with_id("zoom-out", "Zoom Out", true, Some("CmdOrCtrl+-")))
                .add_item(MenuItem::with_id("zoom-reset", "Reset Zoom", true, Some("CmdOrCtrl+0")))
                .add_native_item(PredefinedMenuItem::separator())
                .add_item(MenuItem::with_id("toggle-fullscreen", "Toggle Fullscreen", true, Some("F11")))
        ))
        // 帮助菜单
        .add_submenu(Submenu::new(
            "Help",
            Menu::new()
                .add_item(MenuItem::with_id("about", "About", true, None::<&str>))
                .add_item(MenuItem::with_id("docs", "Documentation", true, None::<&str>))
        ))
}

#[command]
fn get_menu_state(app: AppHandle, item_id: String) -> Result<bool, String> {
    let window = app.get_webview_window("main").unwrap();

    if let Some(menu) = window.menu() {
        if let Ok(items) = menu.items() {
            for item in items {
                if let Some(submenu) = item.as_submenu() {
                    if let Ok(sub_items) = submenu.inner().items() {
                        for sub_item in sub_items {
                            if let Some(check_item) = sub_item.as_check_menuitem() {
                                if check_item.id() == item_id {
                                    return Ok(check_item.is_checked().map_err(|e| e.to_string())?);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    Err("Item not found".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let menu = create_editor_menu();

    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| {
            match event.menu_item_id() {
                "new-file" => {
                    event.window().emit("new-file", ()).unwrap();
                }
                "open-file" => {
                    event.window().emit("open-file", ()).unwrap();
                }
                "save" => {
                    event.window().emit("save", ()).unwrap();
                }
                "quit" => {
                    event.window().app_handle().exit(0);
                }
                "show-sidebar" => {
                    if let Ok(items) = event.window().menu().unwrap().items() {
                        for item in items {
                            if let Some(submenu) = item.as_submenu() {
                                if let Ok(sub_items) = submenu.inner().items() {
                                    for sub_item in sub_items {
                                        if let Some(check_item) = sub_item.as_check_menuitem() {
                                            if check_item.id() == "show-sidebar" {
                                                let is_checked = check_item.is_checked().unwrap();
                                                event.window().emit("toggle-sidebar", !is_checked).unwrap();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                "toggle-fullscreen" => {
                    let window = event.window();
                    if let Ok(is_fullscreen) = window.is_fullscreen() {
                        window.set_fullscreen(!is_fullscreen).unwrap();
                    }
                }
                "about" => {
                    event.window().emit("show-about", ()).unwrap();
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![
            get_menu_state
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 最佳实践

1. **组织清晰** - 按功能分组菜单项，使用分隔符
2. **快捷键** - 为常用操作添加快捷键
3. **状态更新** - 及时更新菜单项的启用/禁用状态
4. **国际化** - 考虑菜单文本的国际化
5. **上下文菜单** - 为常用操作提供上下文菜单

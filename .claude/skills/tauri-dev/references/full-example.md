# 完整示例应用

本文档展示一个完整的 Tauri 应用示例，整合所有核心功能。

## 应用概述

我们将创建一个简单但功能完整的待办事项应用，包含：

- Rust 后端命令
- 状态管理
- 窗口操作
- 菜单系统
- 系统托盘
- 事件系统
- 权限配置

## 项目结构

```
todo-app/
├── src/                           # 前端
│   ├── index.html
│   ├── main.ts
│   ├── App.tsx
│   ├── components/
│   │   ├── TodoList.tsx
│   │   └── TodoItem.tsx
│   └── styles.css
└── src-tauri/
    ├── src/
    │   └── main.rs           # Rust 后端
    ├── permissions/
    │   └── default.toml      # 权限配置
    ├── icons/
    │   └── tray-icon.png
    │   └── icon.png
    ├── Cargo.toml
    ├── build.rs
    └── tauri.conf.json
```

## Rust 后端 (main.rs)

```rust
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tauri::{
    AppHandle, Manager, State, SystemTray, SystemTrayEvent,
    SystemTrayMenu, SystemTrayMenuItem, CustomMenuItem,
    Window, menu::{Menu, MenuItem, Submenu, PredefinedMenuItem
};
use chrono::{DateTime, Utc};

// ==================== 数据模型 ====================

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Todo {
    id: u32,
    text: String,
    completed: bool,
    created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AppSettings {
    dark_mode: bool,
    notifications_enabled: bool,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            dark_mode: false,
            notifications_enabled: true,
        }
    }
}

// ==================== 状态管理 ====================

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
            created_at: Utc::now(),
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

    fn clear_completed(&self) -> usize {
        let mut todos = self.todos.lock().unwrap();
        let len_before = todos.len();
        todos.retain(|t| !t.completed);
        len_before - todos.len()
    }

    fn stats(&self) -> (usize, usize) {
        let todos = self.todos.lock().unwrap();
        let total = todos.len();
        let completed = todos.iter().filter(|t| t.completed).count();
        (total, completed)
    }
}

struct AppState {
    store: TodoStore,
    settings: Arc<Mutex<AppSettings>>,
}

// ==================== 命令定义 ====================

#[tauri::command]
fn add_todo(state: State<AppState>, text: String) -> Todo {
    state.store.add(text)
}

#[tauri::command]
fn get_todos(state: State<AppState>) -> Vec<Todo> {
    state.store.get_all()
}

#[tauri::command]
fn toggle_todo(state: State<AppState>, id: u32) -> Option<Todo> {
    state.store.toggle(id)
}

#[tauri::command]
fn delete_todo(state: State<AppState>, id: u32) -> bool {
    state.store.delete(id)
}

#[tauri::command]
fn clear_completed(state: State<AppState>) -> usize {
    state.store.clear_completed()
}

#[tauri::command]
fn get_stats(state: State<AppState>) -> (usize, usize) {
    state.store.stats()
}

#[tauri::command]
fn get_settings(state: State<AppState>) -> AppSettings {
    state.settings.lock().unwrap().clone()
}

#[tauri::command]
fn update_settings(state: State<AppState>, settings: AppSettings) -> AppSettings {
    let mut current = state.settings.lock().unwrap();
    *current = settings;
    current.clone()
}

#[tauri::command]
fn set_window_title(window: Window, title: String) -> Result<(), String> {
    window.set_title(&title).map_err(|e| e.to_string())
}

#[tauri::command]
fn toggle_fullscreen(window: Window) -> Result<(), String> {
    let is_full = window.is_fullscreen().map_err(|e| e.to_string())?;
    window.set_fullscreen(!is_full).map_err(|e| e.to_string())
}

#[tauri::command]
fn focus_main_window(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
    }
    Ok(())
}

// ==================== 菜单创建 ====================

fn create_menu() -> Menu {
    Menu::new()
        .add_submenu(Submenu::new(
            "File",
            Menu::new()
                .add_item(MenuItem::with_id(
                    "new-todo", "New Todo", true, Some("CmdOrCtrl+N")
                ))
                .add_item(MenuItem::with_id(
                    "clear-completed", "Clear Completed", true, None::<&str>
                ))
                .add_native_item(PredefinedMenuItem::separator())
                .add_item(MenuItem::with_id(
                    "quit", "Quit", true, Some("CmdOrCtrl+Q")
                ))
        ))
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
        .add_submenu(Submenu::new(
            "View",
            Menu::new()
                .add_item(MenuItem::with_id(
                    "toggle-fullscreen", "Toggle Fullscreen", true, Some("F11")
                ))
                .add_item(MenuItem::with_id(
                    "reload", "Reload", true, Some("CmdOrCtrl+R")
                ))
        ))
        .add_submenu(Submenu::new(
            "Help",
            Menu::new()
                .add_item(MenuItem::with_id(
                    "about", "About Todo App", true, None::<&str>
                ))
        ))
}

fn create_tray_menu() -> SystemTrayMenu {
    SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("show", "Show Window"))
        .add_item(CustomMenuItem::new("hide", "Hide Window"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("new-todo", "New Todo"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit", "Quit"))
}

// ==================== 主函数 ====================

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let menu = create_menu();
    let tray = SystemTray::new()
        .with_menu(create_tray_menu())
        .with_tooltip("Todo App");

    tauri::Builder::default()
        .menu(menu)
        .system_tray(tray)
        .manage(AppState {
            store: TodoStore::new(),
            settings: Arc::new(Mutex::new(AppSettings::default())),
        })
        .on_menu_event(|event| {
            match event.menu_item_id() {
                "new-todo" => {
                    event.window().emit("trigger-new-todo", ()).unwrap();
                }
                "clear-completed" => {
                    event.window().emit("trigger-clear-completed", ()).unwrap();
                }
                "quit" => {
                    event.window().app_handle().exit(0);
                }
                "toggle-fullscreen" => {
                    let window = event.window();
                    if let Ok(is_full) = window.is_fullscreen() {
                        let _ = window.set_fullscreen(!is_full);
                    }
                }
                "reload" => {
                    let _ = event.window().eval("location.reload()");
                }
                "about" => {
                    event.window().emit("show-about", ()).unwrap();
                }
                _ => {}
            }
        })
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
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
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
                "new-todo" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                        let _ = window.emit("trigger-new-todo", ());
                    }
                }
                "quit" => {
                    app.exit(0);
                }
                _ => {}
            },
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            add_todo,
            get_todos,
            toggle_todo,
            delete_todo,
            clear_completed,
            get_stats,
            get_settings,
            update_settings,
            set_window_title,
            toggle_fullscreen,
            focus_main_window,
        ])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.set_title("Todo App").unwrap();

            // 加载一些示例数据
            let state = app.state::<AppState>();
            state.store.add("学习 Tauri".to_string());
            state.store.add("写第一个应用".to_string());
            state.store.add("探索更多功能".to_string());

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 权限配置 (default.toml)

```toml
$schema = "../schemas/capability.schema.json"
identifier = "default"
description = "Todo app permissions"
platforms = ["linux", "macos", "windows"]

[permissions.core:default]
allow = [
  { name = "add_todo" },
  { name = "get_todos" },
  { name = "toggle_todo" },
  { name = "delete_todo" },
  { name = "clear_completed" },
  { name = "get_stats" },
  { name = "get_settings" },
  { name = "update_settings" },
  { name = "set_window_title" },
  { name = "toggle_fullscreen" },
  { name = "focus_main_window" }
]

[permissions.core:window]
allow = [
  "show",
  "hide",
  "close",
  "set-title",
  "set-size",
  "set-position",
  "minimize",
  "maximize",
  "unmaximize",
  "set-fullscreen",
  "set-focus",
  "set-decoration",
  "listen-tauri://resize",
  "listen-tauri://move",
  "listen-tauri://close-requested"
]

[permissions.core:event]
allow = [
  "listen",
  "emit"
]

[permissions.core:app]
allow = [
  "get-name",
  "get-version"
]
```

## 配置文件 (tauri.conf.json)

```json
{
  "$schema": "https://schema.tauri.app/config/2.0.0/schema.json",
  "productName": "Todo App",
  "version": "1.0.0",
  "identifier": "com.example.todoapp",
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devUrl": "http://localhost:5173",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "label": "main",
        "title": "Todo App",
        "width": 800,
        "height": 600,
        "minWidth": 400,
        "minHeight": 300,
        "resizable": true,
        "center": true
      }
    ],
    "security": {
      "capabilities": ["default"]
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "category": "Productivity",
    "shortDescription": "A simple todo app",
    "longDescription": "A simple todo application built with Tauri"
  }
}
```

## 前端 API (api.ts)

```typescript
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'

// 类型定义
export interface Todo {
  id: number
  text: string
  completed: boolean
  created_at: string
}

export interface AppSettings {
  dark_mode: boolean
  notifications_enabled: boolean
}

// API 函数
export async function addTodo(text: string): Promise<Todo> {
  return await invoke<Todo>('add_todo', { text })
}

export async function getTodos(): Promise<Todo[]> {
  return await invoke<Todo[]>('get_todos')
}

export async function toggleTodo(id: number): Promise<Todo | null> {
  return await invoke<Todo | null>('toggle_todo', { id })
}

export async function deleteTodo(id: number): Promise<boolean> {
  return await invoke<boolean>('delete_todo', { id })
}

export async function clearCompleted(): Promise<number> {
  return await invoke<number>('clear_completed')
}

export async function getStats(): Promise<[number, number]> {
  return await invoke<[number, number]>('get_stats')
}

export async function getSettings(): Promise<AppSettings> {
  return await invoke<AppSettings>('get_settings')
}

export async function updateSettings(settings: AppSettings): Promise<AppSettings> {
  return await invoke<AppSettings>('update_settings', { settings })
}

export async function setWindowTitle(title: string): Promise<void> {
  return await invoke('set_window_title', { title })
}

export async function toggleFullscreen(): Promise<void> {
  return await invoke('toggle_fullscreen')
}

export async function focusMainWindow(): Promise<void> {
  return await invoke('focus_main_window')
}

// 事件监听
export async function onTriggerNewTodo(callback: () => void) {
  return await listen('trigger-new-todo', callback)
}

export async function onTriggerClearCompleted(callback: () => void) {
  return await listen('trigger-clear-completed', callback)
}

export async function onShowAbout(callback: () => void) {
  return await listen('show-about', callback)
}
```

## 前端组件 (App.tsx)

```tsx
import { useState, useEffect } from 'react'
import * as api from './api'
import type { Todo, AppSettings } from './api'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodoText, setNewTodoText] = useState('')
  const [settings, setSettings] = useState<AppSettings>({
    dark_mode: false,
    notifications_enabled: true,
  })
  const [stats, setStats] = useState<[number, number]>([0, 0])

  // 加载数据
  useEffect(() => {
    loadTodos()
    loadSettings()
    loadStats()
  }, [])

  // 监听事件
  useEffect(() => {
    api.onTriggerNewTodo(() => {
      document.getElementById('new-todo-input')?.focus()
    })
    api.onTriggerClearCompleted(handleClearCompleted)
  }, [])

  async function loadTodos() {
    const data = await api.getTodos()
    setTodos(data)
  }

  async function loadSettings() {
    const data = await api.getSettings()
    setSettings(data)
  }

  async function loadStats() {
    const data = await api.getStats()
    setStats(data)
  }

  async function handleAddTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!newTodoText.trim()) return

    const todo = await api.addTodo(newTodoText.trim())
    setTodos([...todos, todo])
    setNewTodoText('')
    loadStats()
  }

  async function handleToggleTodo(id: number) {
    const updated = await api.toggleTodo(id)
    if (updated) {
      setTodos(todos.map(t => t.id === id ? updated : t))
      loadStats()
    }
  }

  async function handleDeleteTodo(id: number) {
    const deleted = await api.deleteTodo(id)
    if (deleted) {
      setTodos(todos.filter(t => t.id !== id))
      loadStats()
    }
  }

  async function handleClearCompleted() {
    const count = await api.clearCompleted()
    if (count > 0) {
      loadTodos()
      loadStats()
    }
  }

  async function handleUpdateSettings(newSettings: AppSettings) {
    const updated = await api.updateSettings(newSettings)
    setSettings(updated)
  }

  const [total, completed] = stats
  const remaining = total - completed

  return (
    <div className={`app ${settings.dark_mode ? 'dark' : ''}>
      <header>
        <h1>Todo App</h1>
        <div className="stats">
          <span>{total} total</span>
          <span>{completed} completed</span>
          <span>{remaining} remaining</span>
        </div>
      </header>

      <main>
        <form onSubmit={handleAddTodo}>
          <input
            id="new-todo-input"
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="What needs to be done?"
          />
          <button type="submit">Add</button>
        </form>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
              />
              <span className="text">{todo.text}</span>
              <button onClick={() => handleDeleteTodo(todo.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>

        {completed > 0 && (
          <button onClick={handleClearCompleted}>
            Clear {completed} completed
          </button>
        )}
      </main>

      <footer>
        <label>
          <input
            type="checkbox"
            checked={settings.dark_mode}
            onChange={(e) => handleUpdateSettings({
              ...settings,
              dark_mode: e.target.checked
            })}
          />
          Dark Mode
        </label>
      </footer>
    </div>
  )
}

export default App
```

## 样式 (styles.css)

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  color: #333;
}

.app.dark {
  background: #1a1a1a;
  color: #f0f0f0;
}

header {
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app.dark header {
  background: #2d2d2d;
  border-color: #444;
}

header h1 {
  font-size: 1.5rem;
}

.stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.app.dark .stats {
  color: #999;
}

main {
  flex: 1;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

input[type="text"] {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.app.dark input[type="text"] {
  background: #3d3d3d;
  border-color: #555;
  color: #f0f0f0;
}

button {
  padding: 0.75rem 1.5rem;
  background: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background: #005a9e;
}

.todo-list {
  list-style: none;
  margin-bottom: 1rem;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.app.dark .todo-list li {
  background: #2d2d2d;
}

.todo-list li.completed .text {
  text-decoration: line-through;
  color: #999;
}

.todo-list li button {
  margin-left: auto;
  padding: 0.5rem 1rem;
  background: #dc3545;
}

.todo-list li button:hover {
  background: #b02a37;
}

footer {
  padding: 1rem;
  background: white;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.app.dark footer {
  background: #2d2d2d;
  border-color: #444;
}

footer label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
```

## 运行应用

### 开发模式

```bash
pnpm tauri dev
```

### 构建发布版本

```bash
pnpm tauri build
```

## 功能特性总结

这个示例应用展示了：

✅ **后端开发**
- Rust 命令定义和注册
- 状态管理（Mutex, Arc）
- 数据模型（Serde 序列化）
- 菜单系统

✅ **窗口管理**
- 窗口操作
- 系统托盘
- 事件监听

✅ **前端开发**
- TypeScript API 封装
- React 组件
- 事件监听
- 状态管理

✅ **配置**
- 权限系统
- 应用配置
- 打包配置

这是一个完整的、可运行的 Tauri 应用，可以作为你自己项目的起点！

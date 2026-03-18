# 事件系统

Tauri 的事件系统允许前端和后端之间进行跨上下文的通信。

## 概述

事件系统提供了一种发布-订阅模式，支持：
- 前端发送事件到后端
- 后端发送事件到前端
- 窗口间通信
- 全局事件广播

## 前端事件 API

### 发送事件

```typescript
import { emit } from '@tauri-apps/api/event'

// 发送全局事件
await emit('custom-event', { data: 'Hello!' })

// 发送带 payload 的事件
interface EventPayload {
  message: string
  timestamp: number
}

await emit<EventPayload>('user-login', {
  message: 'User logged in',
  timestamp: Date.now()
})
```

### 发送到特定窗口

```typescript
import { emitTo } from '@tauri-apps/api/event'

// 发送到指定标签的窗口
await emitTo('main', 'window-event', { data: 'Hello main window!' })
await emitTo('settings', 'refresh-settings', null)
```

### 监听事件

```typescript
import { listen } from '@tauri-apps/api/event'

// 基本监听
const unlisten = await listen<string>('custom-event', (event) => {
  console.log('Received event:', event.payload)
})

// 停止监听
unlisten()

// 带类型的事件
interface UserData {
  id: number
  name: string
}

await listen<UserData>('user-updated', (event) => {
  console.log('User:', event.payload.id, event.payload.name)
})
```

### 只监听一次

```typescript
import { once } from '@tauri-apps/api/event'

await once<string>('one-time-event', (event) => {
  console.log('Received once:', event.payload)
})
```

## 事件对象

事件监听器接收的事件对象包含：

```typescript
interface Event<T> {
  // 事件名称
  event: string
  // 事件数据
  payload: T
  // 事件来源窗口标签（如果有）
  id?: number
  // 事件来源窗口标签
  windowLabel?: string
}
```

## 后端事件 API

### 发送事件

#### 从命令中发送

```rust
use tauri::Window;

#[command]
fn send_event(window: Window) -> Result<(), String> {
    // 发送到当前窗口
    window.emit("event-name", "payload")?;

    // 发送到所有窗口
    window.emit_all("global-event", "global payload")?;

    Ok(())
}
```

#### 使用 AppHandle

```rust
use tauri::AppHandle;

#[command]
fn send_from_app_handle(app: AppHandle) -> Result<(), String> {
    // 发送到所有窗口
    app.emit_all("app-event", "payload")?;

    // 发送到特定窗口
    if let Some(window) = app.get_webview_window("main") {
        window.emit("window-event", "payload")?;
    }

    Ok(())
}
```

### 监听事件

#### 监听来自前端的事件

```rust
use tauri::{Window, Manager};

#[command]
fn listen_to_frontend(window: Window) {
    // 监听前端事件
    window.listen("frontend-event", |event| {
        println!("Received from frontend: {:?}", event.payload());
    });
}
```

#### 在 setup 中监听

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            // 监听事件
            window.listen("my-event", move |event| {
                println!("Got event: {:?}", event.payload());
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 内置事件

### 窗口事件

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 窗口大小变化
await window.listen('tauri://resize', ({ payload }) => {
  console.log('Size:', payload.width, 'x', payload.height)
})

// 窗口移动
await window.listen('tauri://move', ({ payload }) => {
  console.log('Position:', payload.x, ',', payload.y)
})

// 窗口获得焦点
await window.listen('tauri://focus', () => {
  console.log('Window focused')
})

// 窗口失去焦点
await window.listen('tauri://blur', () => {
  console.log('Window blurred')
})

// 窗口关闭请求
await window.listen('tauri://close-requested', (event) => {
  console.log('Close requested')
  // 可以阻止关闭
  event.preventDefault()
})

// 窗口已关闭
await window.listen('tauri://destroyed', () => {
  console.log('Window destroyed')
})

// 窗口文件拖放
await window.listen('tauri://file-drop', ({ payload }) => {
  console.log('Dropped files:', payload)
})

// 文件拖放悬停
await window.listen('tauri://file-drop-hover', ({ payload }) => {
  console.log('Hovering files:', payload)
})

// 文件拖放取消
await window.listen('tauri://file-drop-cancelled', () => {
  console.log('File drop cancelled')
})

// 主题变化
await window.listen('tauri://theme-changed', ({ payload }) => {
  console.log('New theme:', payload)
})

// 缩放因子变化
await window.listen('tauri://scale-change', ({ payload }) => {
  console.log('Scale factor:', payload.scaleFactor)
})
```

### Webview 事件

```typescript
import { getCurrentWebview } from '@tauri-apps/api/webview'

const webview = getCurrentWebview()

// URL 变化
await webview.listen('tauri://url', ({ payload }) => {
  console.log('URL:', payload)
})
```

## 窗口间通信

### 从窗口 A 发送到窗口 B

窗口 A (main):
```typescript
import { emitTo } from '@tauri-apps/api/event'

await emitTo('settings', 'refresh-data', { newData: true })
```

窗口 B (settings):
```typescript
import { listen } from '@tauri-apps/api/event'

await listen('refresh-data', ({ payload }) => {
  console.log('Refresh data:', payload)
})
```

### 使用窗口监听器

```typescript
import { getWebviewWindow } from '@tauri-apps/api/webviewWindow'

const settingsWindow = getWebviewWindow('settings')

await settingsWindow.listen('message-from-main', ({ payload }) => {
  console.log('Received:', payload)
})
```

## Channel (双向通信)

对于需要持续通信的场景，可以使用 Channel：

### Rust 端

```rust
use tauri::{ipc::Channel, command};

#[command]
fn start_stream(channel: Channel) {
    std::thread::spawn(move || {
        for i in 0..10 {
            channel.send(i).unwrap();
            std::thread::sleep(std::time::Duration::from_millis(500));
        }
    });
}
```

### 前端

```typescript
import { invoke } from '@tauri-apps/api/core'

function startStream() {
  return new Promise((resolve) => {
    let messages: number[] = []

    const onMessage = (message: number) => {
      messages.push(message)
      console.log('Received:', message)

      if (message === 9) {
        resolve(messages)
      }
    }

    invoke('start_stream', {
      onMessage: transformCallback(onMessage)
    })
  })
}

// 使用
const messages = await startStream()
console.log('All messages:', messages)
```

## 完整示例

### 实时通知系统

#### Rust 后端

```rust
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Manager, State, Window};

#[derive(Clone, Serialize, Deserialize)]
struct Notification {
    id: u32,
    title: String,
    message: String,
    timestamp: i64,
}

struct NotificationState {
    notifications: Arc<Mutex<Vec<Notification>>>,
    next_id: Arc<Mutex<u32>>,
}

#[command]
fn send_notification(
    app: AppHandle,
    state: State<NotificationState>,
    title: String,
    message: String,
) -> Notification {
    let mut next_id = state.next_id.lock().unwrap();
    let id = *next_id;
    *next_id += 1;
    drop(next_id);

    let notification = Notification {
        id,
        title,
        message,
        timestamp: chrono::Utc::now().timestamp(),
    };

    // 存储
    let mut notifications = state.notifications.lock().unwrap();
    notifications.push(notification.clone());
    drop(notifications);

    // 广播到所有窗口
    app.emit_all("notification", notification.clone()).unwrap();

    notification
}

#[command]
fn get_notifications(state: State<NotificationState>) -> Vec<Notification> {
    state.notifications.lock().unwrap().clone()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(NotificationState {
            notifications: Arc::new(Mutex::new(Vec::new())),
            next_id: Arc::new(Mutex::new(1)),
        })
        .setup(|app| {
            // 定期发送心跳通知
            let app_handle = app.app_handle().clone();
            tauri::async_runtime::spawn(async move {
                loop {
                    tokio::time::sleep(tokio::time::Duration::from_secs(60)).await;
                    app_handle.emit_all("heartbeat", ()).unwrap();
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            send_notification,
            get_notifications
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

#### 前端

```typescript
import { listen, emit } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/core'

interface Notification {
  id: number
  title: string
  message: string
  timestamp: number
}

// 监听通知
await listen<Notification>('notification', ({ payload }) => {
  console.log('New notification:', payload)
  showNotification(payload)
})

// 监听心跳
await listen('heartbeat', () => {
  console.log('Heartbeat received')
})

// 发送通知
async function sendNotification(title: string, message: string) {
  return await invoke<Notification>('send_notification', { title, message })
}

// 获取所有通知
async function getNotifications(): Promise<Notification[]> {
  return await invoke('get_notifications')
}

// 显示通知
function showNotification(notification: Notification) {
  const el = document.createElement('div')
  el.className = 'notification'
  el.innerHTML = `
    <h3>${notification.title}</h3>
    <p>${notification.message}</p>
  `
  document.body.appendChild(el)

  setTimeout(() => el.remove(), 5000)
}
```

## 最佳实践

### 1. 使用类型定义

```typescript
// types/events.ts
export interface Events {
  'user-login': { userId: number; name: string }
  'user-logout': { userId: number }
  'notification': Notification
}

export interface Notification {
  id: number
  title: string
  message: string
}

// 使用
await listen<Events['user-login']>('user-login', (event) => {
  console.log(event.payload.userId) // 类型安全
})
```

### 2. 事件命名规范

使用一致的命名约定：

```typescript
// 使用冒号分隔
'user:login'
'user:logout'
'data:updated'
'ui:refresh'

// 或使用点分隔
'user.login'
'user.logout'
```

### 3. 清理监听器

```typescript
// 在组件卸载时清理
useEffect(() => {
  let unlisten: (() => void) | null = null

  async function setupListener() {
    unlisten = await listen('event', handler)
  }

  setupListener()

  return () => {
    unlisten?.()
  }
}, [])
```

### 4. 避免大 payload

```typescript
// 不推荐：发送整个大数据集
await emit('data-updated', hugeDataset)

// 推荐：只发送变更通知
await emit('data-updated', { updatedAt: Date.now() })
// 然后按需请求数据
const data = await invoke('get_data')
```

### 5. 错误处理

```typescript
try {
  await emit('event', payload)
} catch (error) {
  console.error('Failed to emit event:', error)
}
```

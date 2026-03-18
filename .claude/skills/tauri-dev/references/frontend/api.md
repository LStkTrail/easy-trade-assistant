# 前端 API 概述

@tauri-apps/api 是 Tauri 提供的 TypeScript 前端库，用于与 Rust 后端进行通信。

## 安装

### 使用 npm

```bash
npm install @tauri-apps/api
```

### 使用 pnpm

```bash
pnpm add @tauri-apps/api
```

### 使用 yarn

```bash
yarn add @tauri-apps/api
```

## 模块结构

@tauri-apps/api 包含以下主要模块：

| 模块 | 描述 |
|------|------|
| `core` | 核心功能 (invoke, transformCallback) |
| `window` | 窗口控制和管理 |
| `webview` | Webview 相关 API |
| `webviewWindow` | 组合 Webview 和 Window 功能 |
| `app` | 应用生命周期管理 |
| `event` | 事件系统 |
| `path` | 文件系统路径工具 |
| `menu` | 菜单系统 |
| `tray` | 系统托盘 |
| `dpi` | DPI 和缩放相关 |
| `image` | 图像处理 |

## 基本用法

### 导入模块

```typescript
// 导入单个函数
import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'

// 导入整个模块
import * as window from '@tauri-apps/api/window'
import * as event from '@tauri-apps/api/event'
```

### 调用 Rust 命令

```typescript
import { invoke } from '@tauri-apps/api/core'

// 无参数调用
const result = await invoke('greet')

// 带参数调用
const result = await invoke('greet', { name: 'World' })

// 指定返回类型
interface User {
  id: number
  name: string
}

const user = await invoke<User>('get_user', { id: 1 })
```

## 核心模块 (core)

### invoke

调用 Rust 命令的主要函数：

```typescript
import { invoke } from '@tauri-apps/api/core'

// 基本用法
const result = await invoke('command_name')

// 带参数
const result = await invoke('command_name', { arg1: 'value', arg2: 42 })

// 错误处理
try {
  const result = await invoke('might_fail')
} catch (error) {
  console.error('Error:', error)
}
```

### transformCallback

创建可以从 Rust 调用的 JavaScript 回调：

```typescript
import { invoke, transformCallback } from '@tauri-apps/api/core'

// 创建回调
const callback = transformCallback((result) => {
  console.log('Received from Rust:', result)
})

// 将回调 ID 发送给 Rust
await invoke('register_callback', { callbackId: callback })
```

## 窗口模块 (window)

### 获取当前窗口

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()
```

### 窗口操作

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 设置标题
await window.setTitle('My App')

// 调整大小
await window.setSize({ width: 800, height: 600 })

// 移动窗口
await window.setPosition({ x: 100, y: 100 })

// 最小化/最大化
await window.minimize()
await window.maximize()
await window.unmaximize()

// 全屏
await window.setFullscreen(true)

// 显示/隐藏
await window.hide()
await window.show()

// 关闭窗口
await window.close()
```

### 监听窗口事件

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 监听 resize 事件
await window.listen('tauri://resize', ({ payload }) => {
  console.log('Window resized:', payload)
})

// 监听焦点变化
await window.listen('tauri://focus', () => {
  console.log('Window focused')
})

await window.listen('tauri://blur', () => {
  console.log('Window blurred')
})

// 监听关闭事件
await window.listen('tauri://close-requested', (event) => {
  console.log('Window close requested')
  // 可以阻止关闭
  event.preventDefault()
})
```

## 事件模块 (event)

### 发送事件

```typescript
import { emit } from '@tauri-apps/api/event'

// 发送全局事件
await emit('custom-event', { data: 'Hello!' })

// 发送到特定窗口
await emitTo('main', 'window-event', { data: 'Hello window!' })
```

### 监听事件

```typescript
import { listen, once } from '@tauri-apps/api/event'

// 持续监听
const unlisten = await listen<string>('custom-event', (event) => {
  console.log('Received:', event.payload)
})

// 取消监听
unlisten()

// 只监听一次
await once<string>('one-time-event', (event) => {
  console.log('Received once:', event.payload)
})
```

## 应用模块 (app)

```typescript
import { getName, getVersion, getTauriVersion } from '@tauri-apps/api/app'

// 获取应用名称
const appName = await getName()

// 获取应用版本
const appVersion = await getVersion()

// 获取 Tauri 版本
const tauriVersion = await getTauriVersion()
```

## 路径模块 (path)

```typescript
import {
  homeDir,
  dataDir,
  configDir,
  cacheDir,
  documentDir,
  downloadDir,
  audioDir,
  pictureDir,
  videoDir,
  resourceDir,
  tempDir,
  appDataDir,
  appConfigDir,
  appCacheDir,
  appLogDir,
  join,
  resolve,
  normalize,
  dirname,
  extname,
  basename,
  isAbsolute,
  sep,
  delimiter
} from '@tauri-apps/api/path'

// 获取系统目录
const home = await homeDir()
const documents = await documentDir()
const downloads = await downloadDir()

// 获取应用特定目录
const appData = await appDataDir()
const appConfig = await appConfigDir()

// 路径操作
const joined = await join('path', 'to', 'file.txt')
const dir = await dirname('/path/to/file.txt')
const ext = await extname('file.txt')
const base = await basename('/path/to/file.txt')
```

## DPI 模块

```typescript
import {
  LogicalPosition,
  LogicalSize,
  PhysicalPosition,
  PhysicalSize,
} from '@tauri-apps/api/dpi'

// 逻辑尺寸（与 DPI 无关）
const logicalSize = new LogicalSize(800, 600)

// 物理尺寸（实际像素）
const physicalSize = new PhysicalSize(1920, 1080)

// 转换
const scaleFactor = 1.5 // 从 window.scaleFactor() 获取
const toPhysical = logicalSize.toPhysical(scaleFactor)
const toLogical = physicalSize.toLogical(scaleFactor)
```

## 类型安全

### 定义命令类型

```typescript
// types.ts
export interface Commands {
  greet: {
    args: { name: string }
    return: string
  }
  get_user: {
    args: { id: number }
    return: User
  }
}

export interface User {
  id: number
  name: string
  email: string
}
```

### 创建类型安全的 API

```typescript
// api.ts
import { invoke } from '@tauri-apps/api/core'
import type { Commands, User } from './types'

export async function greet(name: string): Promise<string> {
  return await invoke<Commands['greet']['return']>('greet', { name })
}

export async function getUser(id: number): Promise<User> {
  return await invoke<Commands['get_user']['return']>('get_user', { id })
}
```

## 环境检测

```typescript
// 检测是否在 Tauri 环境中
export function isTauri(): boolean {
  return typeof window !== 'undefined' &&
         '__TAURI__' in window &&
         typeof (window as any).__TAURI__ !== 'undefined'
}

// 使用示例
if (isTauri()) {
  // 在 Tauri 中，使用 @tauri-apps/api
  import('@tauri-apps/api/core').then(({ invoke }) => {
    invoke('command')
  })
} else {
  // 在浏览器中，使用降级方案
  console.log('Not in Tauri')
}
```

## Mock 测试

@tauri-apps/api 提供了 mocks 用于测试：

```typescript
import { mockIPC, clearMocks } from '@tauri-apps/api/mocks'

// 设置 mock
mockIPC((cmd, args) => {
  if (cmd === 'greet') {
    return `Hello, ${(args as any).name}!`
  }
})

// 测试代码
const result = await invoke('greet', { name: 'Test' })
console.log(result) // "Hello, Test!"

// 清除 mock
clearMocks()
```

## 全局访问

除了模块导入，API 也可以通过全局对象访问：

```typescript
// 通过 window.__TAURI__ 访问
const tauri = (window as any).__TAURI__

// 调用命令
tauri.invoke('command')

// 访问模块
tauri.window.getCurrentWindow()
tauri.event.emit('event')
```

注意：推荐使用模块导入方式，因为它提供更好的类型支持和 tree-shaking。

## 最佳实践

### 1. 创建 API 封装层

```typescript
// api/index.ts
export * from './user'
export * from './todo'
export * from './settings'

// api/user.ts
import { invoke } from '@tauri-apps/api/core'
import type { User } from '../types'

export async function getUsers(): Promise<User[]> {
  return await invoke<User[]>('get_users')
}

export async function createUser(data: Partial<User>): Promise<User> {
  return await invoke<User>('create_user', { data })
}
```

### 2. 统一错误处理

```typescript
class TauriError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'TauriError'
  }
}

export async function safeInvoke<T>(
  cmd: string,
  args?: Record<string, unknown>
): Promise<T> {
  try {
    return await invoke<T>(cmd, args)
  } catch (error) {
    if (typeof error === 'string') {
      throw new TauriError(error)
    }
    throw new TauriError('Unknown error')
  }
}
```

### 3. 使用 async/await

```typescript
// 推荐
async function loadData() {
  try {
    const data = await invoke('get_data')
    return data
  } catch (error) {
    console.error(error)
  }
}

// 避免
invoke('get_data').then(data => {
  // ...
}).catch(error => {
  // ...
})
```

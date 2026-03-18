# 窗口与 Webview

本文档详细讲解 Tauri 中的窗口和 Webview 管理。

## 概述

Tauri 提供了强大的窗口和 Webview 管理功能，支持多窗口、窗口生命周期管理、窗口事件等。

## 核心概念

### Window

`Window` 代表一个操作系统窗口，负责窗口的外观、位置、大小等。

### Webview

`Webview` 是窗口内的网页渲染组件，负责加载和渲染 HTML/CSS/JavaScript。

### WebviewWindow

`WebviewWindow` 是 `Window` 和 `Webview` 的组合，是最常用的类型。

## 窗口基础

### 获取当前窗口

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()
```

### 获取窗口标签

```typescript
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

// 通过标签获取窗口
const window = WebviewWindow.getByLabel('main')
```

### 获取所有窗口

```typescript
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

const windows = WebviewWindow.getAllWindows()
```

## 窗口操作

### 标题

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 设置标题
await window.setTitle('My App')

// 获取标题
const title = await window.title()
```

### 大小

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'
import { LogicalSize, PhysicalSize } from '@tauri-apps/api/dpi'

const window = getCurrentWindow()

// 设置大小（逻辑尺寸）
await window.setSize(new LogicalSize(800, 600))

// 设置大小（物理尺寸）
await window.setSize(new PhysicalSize(1920, 1080))

// 获取大小
const size = await window.innerSize() // 内部大小
const outerSize = await window.outerSize() // 外部大小

// 最小/最大大小
await window.setMinSize(new LogicalSize(400, 300))
await window.setMaxSize(new LogicalSize(1200, 900))
```

### 位置

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'
import { LogicalPosition, PhysicalPosition } from '@tauri-apps/api/dpi'

const window = getCurrentWindow()

// 设置位置
await window.setPosition(new LogicalPosition(100, 100))

// 获取位置
const position = await window.outerPosition()

// 居中
await window.center()
```

### 窗口状态

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 最小化
await window.minimize()

// 取消最小化
await window.unminimize()

// 最大化
await window.maximize()

// 取消最大化
await window.unmaximize()

// 切换最大化
await window.toggleMaximize()

// 全屏
await window.setFullscreen(true)

// 检查是否全屏
const isFullscreen = await window.isFullscreen()

// 置顶
await window.setAlwaysOnTop(true)

// 置底
await window.setAlwaysOnBottom(true)
```

### 显示/隐藏

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 隐藏窗口
await window.hide()

// 显示窗口
await window.show()

// 检查是否可见
const isVisible = await window.isVisible()
```

### 焦点

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 设置焦点
await window.setFocus()

// 检查是否聚焦
const isFocused = await window.isFocused()
```

### 关闭窗口

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 关闭窗口
await window.close()

// 销毁窗口
await window.destroy()
```

### 装饰

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 设置是否显示装饰（标题栏、边框等）
await window.setDecorations(true)

// 检查是否有装饰
const hasDecorations = await window.isDecorated()
```

### 透明窗口

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 设置透明度 (仅 macOS)
await window.setOpacity(0.8)

// 获取透明度
const opacity = await window.opacity()
```

### 阴影

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 设置阴影
await window.setShadow(true)
```

### 内容保护

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 启用内容保护（防止屏幕录制）
await window.setContentProtected(true)
```

### 跳过任务栏

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 从任务栏隐藏
await window.setSkipTaskbar(true)
```

## 窗口图标

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'
import { image } from '@tauri-apps/api/image'

const window = getCurrentWindow()

// 设置窗口图标
const icon = await image('path/to/icon.png')
await window.setIcon(icon)
```

## 光标

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 设置光标
await window.setCursorIcon('pointer')

// 光标类型：
// 'default', 'crosshair', 'hand', 'arrow', 'move', 'text', 'wait',
// 'help', 'progress', 'notAllowed', 'contextMenu', 'cell', 'verticalText',
// 'alias', 'copy', 'noDrop', 'grab', 'grabbing', 'allScroll',
// 'zoomIn', 'zoomOut', 'eResize', 'nResize', 'neResize', 'nwResize',
// 'sResize', 'seResize', 'swResize', 'wResize', 'ewResize', 'nsResize',
// 'neswResize', 'nwseResize', 'colResize', 'rowResize'

// 设置光标位置
await window.setCursorPosition({ x: 100, y: 100 })

// 抓取光标
await window.setCursorGrab(true)

// 隐藏光标
await window.setCursorVisible(false)
```

## 主题

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 设置主题
await window.setTheme('dark') // 'light' | 'dark' | 'system'

// 获取主题
const theme = await window.theme()
```

## 拖拽区域

```typescript
// 在 HTML 中添加拖拽区域
<div data-tauri-drag-region style="height: 30px; background: #333;">
  拖拽区域
</div>

// 或者使用 CSS 类
<div class="tauri-drag-region">
  拖拽区域
</div>
```

## 创建新窗口

### 基本创建

```typescript
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

// 创建新窗口
const newWindow = new WebviewWindow('new-window', {
  url: 'second-page.html',
  title: 'Second Window',
  width: 600,
  height: 400,
})

// 等待窗口准备好
await newWindow.once('tauri://created', () => {
  console.log('Window created')
})

// 监听错误
await newWindow.once('tauri://error', (error) => {
  console.error('Error:', error)
})
```

### 完整配置

```typescript
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

const window = new WebviewWindow('my-window', {
  // 基本配置
  url: 'index.html',
  title: 'My Window',

  // 大小
  width: 800,
  height: 600,
  minWidth: 400,
  minHeight: 300,
  maxWidth: 1200,
  maxHeight: 900,

  // 位置
  x: 100,
  y: 100,
  center: true,

  // 窗口状态
  resizable: true,
  minimizable: true,
  maximizable: true,
  closable: true,
  fullscreen: false,
  maximized: false,
  visible: true,

  // 外观
  decorations: true,
  transparent: false,
  alwaysOnTop: false,
  alwaysOnBottom: false,
  contentProtected: false,
  skipTaskbar: false,

  // 主题
  theme: 'system',
  titleBarStyle: 'default',
  hiddenTitle: false,

  // 其他
  focus: true,
  fileDropEnabled: true,
  acceptFirstMouse: false,

  // Webview 配置
  userAgent: 'My App User Agent',
  additionalBrowserArgs: [],
  dataDirectory: null,
  disabled: [],
})
```

### 从配置创建

```typescript
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

// 使用 tauri.conf.json 中定义的窗口配置
const window = await WebviewWindow.create('settings')
```

## 窗口事件

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 创建事件
await window.listen('tauri://created', () => {
  console.log('Window created')
})

// 关闭请求
await window.listen('tauri://close-requested', (event) => {
  console.log('Close requested')
  // 可以阻止关闭
  event.preventDefault()
})

// 窗口已关闭
await window.listen('tauri://destroyed', () => {
  console.log('Window destroyed')
})

// 焦点变化
await window.listen('tauri://focus', () => {
  console.log('Window focused')
})

await window.listen('tauri://blur', () => {
  console.log('Window blurred')
})

// 大小变化
await window.listen('tauri://resize', ({ payload }) => {
  console.log('Resized:', payload.width, 'x', payload.height)
})

// 位置变化
await window.listen('tauri://move', ({ payload }) => {
  console.log('Moved:', payload.x, ',', payload.y)
})

// 缩放变化
await window.listen('tauri://scale-change', ({ payload }) => {
  console.log('Scale:', payload.scaleFactor)
})

// 主题变化
await window.listen('tauri://theme-changed', ({ payload }) => {
  console.log('Theme:', payload)
})

// 文件拖放
await window.listen('tauri://file-drop', ({ payload }) => {
  console.log('Dropped files:', payload)
})

await window.listen('tauri://file-drop-hover', ({ payload }) => {
  console.log('Hovering:', payload)
})

await window.listen('tauri://file-drop-cancelled', () => {
  console.log('Drop cancelled')
})

// Moved/Resized 结束
await window.listen('tauri://moved', () => {
  console.log('Move finished')
})

await window.listen('tauri://resized', () => {
  console.log('Resize finished')
})
```

## Webview 操作

### 获取当前 Webview

```typescript
import { getCurrentWebview } from '@tauri-apps/api/webview'

const webview = getCurrentWebview()
```

### 导航

```typescript
import { getCurrentWebview } from '@tauri-apps/api/webview'

const webview = getCurrentWebview()

// 导航到 URL
await webview.navigate('https://tauri.app')

// 导航到本地文件
await webview.navigate('second-page.html')
```

### 打印

```typescript
import { getCurrentWebview } from '@tauri-apps/api/webview'

const webview = getCurrentWebview()

// 打印
await webview.print()
```

### 打开开发者工具

```typescript
import { getCurrentWebview } from '@tauri-apps/api/webview'

const webview = getCurrentWebview()

// 打开 DevTools
await webview.openDevtools()

// 关闭 DevTools
await webview.closeDevtools()

// 检查是否打开
const isOpen = await webview.isDevtoolsOpen()
```

### 执行 JavaScript

```typescript
import { getCurrentWebview } from '@tauri-apps/api/webview'

const webview = getCurrentWebview()

// 执行脚本
const result = await webview.eval('2 + 2')
console.log(result) // "4"

// 更复杂的脚本
await webview.eval(`
  document.body.style.backgroundColor = 'red';
  console.log('Hello from Rust!');
`)
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

## 多窗口管理

### 窗口间通信

```typescript
// 窗口 A: 发送消息
import { emitTo } from '@tauri-apps/api/event'

await emitTo('window-b', 'message', { text: 'Hello from A!' })

// 窗口 B: 接收消息
import { listen } from '@tauri-apps/api/event'

await listen('message', ({ payload }) => {
  console.log('Received:', payload.text)
})
```

### 获取其他窗口

```typescript
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

// 通过标签获取
const window = WebviewWindow.getByLabel('settings')

if (window) {
  // 操作窗口
  await window.setTitle('Settings Updated')
}

// 获取所有窗口
const windows = WebviewWindow.getAllWindows()
windows.forEach(async (win) => {
  console.log('Window:', win.label)
  await win.show()
})
```

## 监视器

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 获取当前监视器
const monitor = await window.currentMonitor()
console.log('Current monitor:', monitor)

// 获取主监视器
const primary = await window.primaryMonitor()
console.log('Primary:', primary)

// 获取所有监视器
const monitors = await window.availableMonitors()
console.log('All monitors:', monitors)

// 监视器信息
// {
//   name: string | null,
//   size: PhysicalSize,
//   position: PhysicalPosition,
//   scaleFactor: number,
//   workArea: { position: PhysicalPosition, size: PhysicalSize }
// }
```

## 缩放因子

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 获取缩放因子
const scale = await window.scaleFactor()
console.log('Scale factor:', scale)
```

## 窗口句柄

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window'

const window = getCurrentWindow()

// 获取窗口句柄
const handle = await window.handle()

// handle 包含平台特定的句柄：
// - Windows: { hwnd: number }
// - macOS: { nsWindow: number }
// - Linux: { xlibWindow: number } or { waylandSurface: number }
```

## 最佳实践

### 1. 窗口标签管理

```typescript
// 定义窗口标签常量
export const WindowLabels = {
  MAIN: 'main',
  SETTINGS: 'settings',
  ABOUT: 'about',
} as const

type WindowLabel = typeof WindowLabels[keyof typeof WindowLabels]

// 使用
const settingsWindow = WebviewWindow.getByLabel(WindowLabels.SETTINGS)
```

### 2. 窗口创建包装

```typescript
async function createWindow(
  label: string,
  options: any = {}
): Promise<WebviewWindow> {
  // 检查窗口是否已存在
  const existing = WebviewWindow.getByLabel(label)
  if (existing) {
    await existing.setFocus()
    return existing
  }

  // 创建新窗口
  const window = new WebviewWindow(label, {
    width: 800,
    height: 600,
    center: true,
    ...options,
  })

  // 等待创建
  await new Promise((resolve, reject) => {
    window.once('tauri://created', resolve)
    window.once('tauri://error', reject)
  })

  return window
}
```

### 3. 清理事件监听器

```typescript
import { onCleanup } from 'solid-js' // 或其他框架的清理机制

let unlisten: (() => void) | null = null

async function setup() {
  const window = getCurrentWindow()
  unlisten = await window.listen('event', handler)
}

onCleanup(() => {
  unlisten?.()
})
```

### 4. 处理窗口关闭

```typescript
const window = getCurrentWindow()

await window.listen('tauri://close-requested', async (event) => {
  // 阻止关闭
  event.preventDefault()

  // 确认对话框
  const shouldClose = confirm('Are you sure you want to close?')

  if (shouldClose) {
    // 保存数据
    await saveData()

    // 继续关闭
    await window.destroy()
  }
})
```

# 权限系统 (Capabilities)

Tauri 2.x 引入了 capability 系统，提供细粒度的权限控制，增强应用安全性。

## 概述

Capability 系统允许你精确控制前端可以访问哪些后端 API 和命令。每个 capability 定义一组权限，然后在配置中启用。

## 目录结构

```
src-tauri/
├── permissions/
│   ├── schemas/
│   │   ├── capability.schema.json
│   │   ├── permission.schema.json
│   │   └── scope.schema.json
│   ├── default.toml
│   └── my-custom-capability.toml
└── tauri.conf.json
```

## 基本概念

### Capability

Capability 是一组权限的集合，定义在 `.toml` 文件中。

### Permission

Permission 是单个权限条目，定义可以访问的具体功能。

### Scope

Scope 定义权限的作用域和参数限制。

## 配置 Capability

### 在 tauri.conf.json 中启用

```json
{
  "app": {
    "capabilities": ["default", "my-custom-capability"]
  }
}
```

### 创建 Capability 文件

创建 `src-tauri/permissions/my-capability.toml`:

```toml
$schema = "../schemas/capability.schema.json"
identifier = "my-capability"
description = "My custom capability"
platforms = ["linux", "macos", "windows"]

[permissions]
# 配置权限
```

## 权限类型

### 1. 命令权限

允许调用特定的 Rust 命令：

```toml
$schema = "../schemas/capability.schema.json"
identifier = "commands"
description = "Allow command access"

[permissions.core:default]
allow = [
  { name = "greet" },
  { name = "get_user" },
  { name = "update_user" }
]
```

### 2. 窗口权限

```toml
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
  "set-always-on-top",
  "set-decoration",
  "set-resizable",
  "listen-tauri://resize",
  "listen-tauri://move",
  "listen-tauri://close-requested"
]
```

### 3. 事件权限

```toml
[permissions.core:event]
allow = [
  "listen",
  "emit",
  "listen-to",
  "emit-to"
]
```

### 4. 应用权限

```toml
[permissions.core:app]
allow = [
  "get-name",
  "get-version",
  "get-tauri-version",
  "show",
  "hide"
]
```

### 5. 路径权限

```toml
[permissions.core:path]
allow = [
  "home-dir",
  "data-dir",
  "config-dir",
  "cache-dir",
  "document-dir",
  "download-dir",
  "audio-dir",
  "picture-dir",
  "video-dir",
  "resource-dir",
  "temp-dir",
  "app-data-dir",
  "app-config-dir",
  "app-cache-dir",
  "app-log-dir",
  "join",
  "resolve",
  "normalize",
  "dirname",
  "extname",
  "basename",
  "is-absolute"
]
```

## 完整示例

### default.toml

```toml
$schema = "../schemas/capability.schema.json"
identifier = "default"
description = "Default permissions"
platforms = ["linux", "macos", "windows"]

[permissions.core:default]
allow = [
  { name = "greet" },
  { name = "get_todos" },
  { name = "add_todo" }
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
  "listen-tauri://resize",
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

[permissions.core:path]
allow = [
  "home-dir",
  "document-dir",
  "app-data-dir",
  "join"
]
```

### admin.toml

```toml
$schema = "../schemas/capability.schema.json"
identifier = "admin"
description = "Admin permissions"
platforms = ["linux", "macos", "windows"]

[permissions.core:default]
allow = [
  { name = "delete_user" },
  { name = "reset_app" },
  { name = "export_data" }
]

[permissions.core:window]
allow = [
  "set-always-on-top",
  "set-decoration"
]
```

### 使用多个 Capability

```json
{
  "app": {
    "capabilities": ["default", "admin"]
  }
}
```

## Scope 限制

### 作用域示例

```toml
[permissions.my-plugin:read]
allow = [
  {
    path = "$APP_DATA/*.json"
  }
]

[permissions.my-plugin:write]
allow = [
  {
    path = "$APP_DATA/config.json"
  }
]
```

### 变量

| 变量 | 描述 |
|------|------|
| `$APP_DATA` | 应用数据目录 |
| `$APP_CONFIG` | 应用配置目录 |
| `$APP_CACHE` | 应用缓存目录 |
| `$APP_LOG` | 应用日志目录 |
| `$HOME` | 用户主目录 |
| `$DOCUMENT` | 文档目录 |
| `$DESKTOP` | 桌面目录 |
| `$AUDIO` | 音频目录 |
| `$PICTURE` | 图片目录 |
| `$VIDEO` | 视频目录 |
| `$RESOURCE` | 资源目录 |
| `$TEMP` | 临时目录 |

### 通配符

```toml
[permissions.fs:read-file]
allow = [
  { path = "$APP_DATA/*.json" },
  { path = "$APP_DATA/**/*" }
]
```

## 平台特定权限

```toml
$schema = "../schemas/capability.schema.json"
identifier = "platform-specific"
description = "Platform specific permissions"

# 仅 macOS
[permissions.core:window."macos"]
allow = ["set-title-bar-style"]

# 仅 Windows
[permissions.core:window."windows"]
allow = ["set-taskbar"]

# Linux 和 macOS
[permissions.core:window."linux,macos"]
allow = ["set-decoration"]

# 排除特定平台
[permissions.core:window."!windows"]
allow = ["set-decoration"]
```

## 拒绝权限

```toml
[permissions.core:window]
allow = ["all"]
deny = ["set-always-on-top", "set-fullscreen"]
```

## 插件权限

```toml
[permissions.shell:allow-execute]
allow = [
  { command = "open" },
  { command = "code" }
]

[permissions.fs:read-file]
allow = [
  { path = "$APP_DATA/*.json" }
]

[permissions.fs:write-file]
allow = [
  { path = "$APP_DATA/config.json" }
]

[permissions.dialog:open]
allow = ["all"]

[permissions.notification:allow]
allow = ["all"]

[permissions.clipboard:read-text]
allow = ["all"]

[permissions.clipboard:write-text]
allow = ["all"]

[permissions.global-shortcut:allow]
allow = [
  { hotkey = "Cmd+Space" },
  { hotkey = "Ctrl+Shift+A" }
]
```

## 完整应用示例

### 权限配置

`src-tauri/permissions/default.toml`:
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
  { name = "delete_todo" }
]

[permissions.core:window]
allow = [
  "show",
  "hide",
  "close",
  "set-title",
  "set-size",
  "minimize",
  "maximize",
  "unmaximize",
  "listen-tauri://resize",
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

[permissions.core:path]
allow = [
  "app-data-dir",
  "join"
]
```

### 应用配置

`src-tauri/tauri.conf.json`:
```json
{
  "app": {
    "capabilities": ["default"]
  }
}
```

## 最佳实践

### 1. 最小权限原则

只授予必要的权限：

```toml
# 不推荐
[permissions.core:window]
allow = ["all"]

# 推荐
[permissions.core:window]
allow = [
  "show",
  "hide",
  "set-title"
]
```

### 2. 分离 Capabilities

按功能分离 capabilities：

```
permissions/
├── default.toml      # 基础权限
├── user.toml         # 用户功能
├── admin.toml        # 管理员功能
└── dev.toml          # 开发调试
```

### 3. 使用 Scope 限制

精确限制访问范围：

```toml
[permissions.fs:read-file]
allow = [
  { path = "$APP_DATA/config.json" },
  { path = "$APP_DATA/data/*.json" }
]
```

### 4. 平台特定配置

为不同平台配置不同权限：

```toml
[permissions.core:window."macos"]
allow = ["set-title-bar-style"]

[permissions.core:window."windows"]
allow = ["set-taskbar"]
```

### 5. 定期审查

定期审查权限配置，移除不必要的权限。

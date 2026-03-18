# 配置文件 (tauri.conf.json)

`tauri.conf.json` 是 Tauri 应用的主配置文件，用于定义应用的各种设置。

## 配置文件位置

配置文件默认位于 `src-tauri/tauri.conf.json`。也支持以下格式：
- `tauri.conf.json5` - JSON5 格式
- `tauri.conf.toml` - TOML 格式

## 基本结构

```json
{
  "$schema": "https://schema.tauri.app/config/2.0.0/schema.json",
  "productName": "My App",
  "version": "0.1.0",
  "identifier": "com.example.myapp",
  "build": {},
  "app": {},
  "bundle": {}
}
```

## 完整配置示例

```json
{
  "$schema": "https://schema.tauri.app/config/2.0.0/schema.json",
  "productName": "My Awesome App",
  "version": "1.0.0",
  "identifier": "com.example.myapp",
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devUrl": "http://localhost:5173",
    "frontendDist": "../dist",
    "withGlobalTauri": false
  },
  "app": {
    "windows": [
      {
        "label": "main",
        "title": "My Awesome App",
        "width": 800,
        "height": 600,
        "minWidth": 400,
        "minHeight": 300,
        "resizable": true,
        "fullscreen": false,
        "focus": true,
        "transparent": false,
        "maximized": false,
        "visible": true,
        "decorations": true,
        "alwaysOnTop": false,
        "skipTaskbar": false,
        "center": true
      }
    ],
    "security": {
      "csp": null,
      "dangerousDisableAssetUrlModification": false,
      "dangerousRemoteDomainIpcAccess": [],
      "capabilities": ["default"]
    },
    "macOSPrivateApi": false,
    "withGlobalTauri": false
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "identifier": "com.example.myapp",
    "longDescription": "My awesome Tauri application",
    "shortDescription": "A Tauri app",
    "copyright": "Copyright (c) 2024",
    "category": "DeveloperTool",
    "shortDescription": "A Tauri application",
    "externalBin": [],
    "resources": [],
    "copyright": "",
    "icon": [],
    "fileAssociations": [],
    "macOS": {
      "frameworks": [],
      "minimumSystemVersion": "10.13",
      "license": null,
      "exceptionDomain": "",
      "signingIdentity": null,
      "providerShortName": null,
      "entitlements": null,
      "infoPlist": {}
    },
    "windows": {
      "certificateThumbprint": null,
      "timestampUrl": null,
      "tsp": false,
      "digestAlgorithm": "sha256",
      "certificatePath": null,
      "wix": {
        "language": ["en-US"],
        "template": null,
        "fragmentPaths": [],
        "componentGroupRefs": [],
        "componentRefs": [],
        "featureGroupRefs": [],
        "featureRefs": [],
        "mergeRefs": []
      },
      "nsis": {
        "languages": ["English"],
        "customLanguageFiles": [],
        "template": null,
        "compressionLevel": "lzma-solid",
        "displayLanguageSelector": false,
        "installerIcon": null,
        "headerImage": null,
        "sidebarImage": null,
        "installMode": "perMachine",
        "purgeSettings": true,
        "prependToPath": false,
        "menuCategory": true
      }
    },
    "linux": {
      "debian": {
        "depends": [],
        "useBootstrapper": true,
        "section": "utility",
        "priority": "optional",
        "lintian": {
          "files": {},
          "overrides": []
        }
      },
      "appimage": {
        "bundleMediaFramework": true,
        "files": {},
        "libraryFolders": []
      },
      "appcategory": null
    }
  },
  "plugins": {}
}
```

## 配置详解

### 顶层配置

| 字段 | 类型 | 描述 |
|------|------|------|
| `$schema` | string | JSON Schema URL，用于编辑器提示 |
| `productName` | string | 应用名称 |
| `version` | string | 应用版本 |
| `identifier` | string | 应用标识符 (如 com.example.app) |
| `build` | object | 构建配置 |
| `app` | object | 应用配置 |
| `bundle` | object | 打包配置 |
| `plugins` | object | 插件配置 |

### build 配置

```json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devUrl": "http://localhost:5173",
    "frontendDist": "../dist",
    "withGlobalTauri": false
  }
}
```

| 字段 | 类型 | 描述 |
|------|------|------|
| `beforeDevCommand` | string | 开发前执行的命令 |
| `beforeBuildCommand` | string | 构建前执行的命令 |
| `devUrl` | string | 开发服务器 URL |
| `frontendDist` | string | 前端构建输出目录 |
| `withGlobalTauri` | boolean | 是否注入全局 Tauri API |

### app 配置

#### windows 配置

```json
{
  "app": {
    "windows": [
      {
        "label": "main",
        "url": "index.html",
        "title": "My App",
        "width": 800,
        "height": 600,
        "minWidth": 400,
        "minHeight": 300,
        "maxWidth": 1200,
        "maxHeight": 900,
        "resizable": true,
        "closable": true,
        "minimizable": true,
        "maximizable": true,
        "fullscreen": false,
        "focus": true,
        "transparent": false,
        "maximized": false,
        "visible": true,
        "decorations": true,
        "alwaysOnTop": false,
        "alwaysOnBottom": false,
        "contentProtected": false,
        "skipTaskbar": false,
        "center": true,
        "x": 0,
        "y": 0,
        "theme": "system",
        "titleBarStyle": "default",
        "hiddenTitle": false,
        "acceptFirstMouse": false,
        "tabbingIdentifier": null,
        "dragAndDrop": true,
        "shadow": true,
        "menu": null,
        "fileDropEnabled": true,
        "disableWebSecurity": false
      }
    ]
  }
}
```

#### security 配置

```json
{
  "app": {
    "security": {
      "csp": null,
      "dangerousDisableAssetUrlModification": false,
      "dangerousRemoteDomainIpcAccess": [],
      "capabilities": ["default"]
    }
  }
}
```

| 字段 | 类型 | 描述 |
|------|------|------|
| `csp` | string \| null | 内容安全策略 |
| `capabilities` | string[] | 启用的 capability 列表 |

### bundle 配置

#### 基本配置

```json
{
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "identifier": "com.example.myapp",
    "longDescription": "",
    "shortDescription": "",
    "copyright": "",
    "category": "DeveloperTool",
    "externalBin": [],
    "resources": []
  }
}
```

#### macOS 配置

```json
{
  "bundle": {
    "macOS": {
      "frameworks": [],
      "minimumSystemVersion": "10.13",
      "license": null,
      "exceptionDomain": "",
      "signingIdentity": null,
      "providerShortName": null,
      "entitlements": null,
      "infoPlist": {}
    }
  }
}
```

#### Windows 配置

```json
{
  "bundle": {
    "windows": {
      "certificateThumbprint": null,
      "timestampUrl": null,
      "tsp": false,
      "digestAlgorithm": "sha256",
      "certificatePath": null,
      "wix": {},
      "nsis": {}
    }
  }
}
```

#### Linux 配置

```json
{
  "bundle": {
    "linux": {
      "debian": {
        "depends": [],
        "useBootstrapper": true,
        "section": "utility",
        "priority": "optional"
      },
      "appimage": {
        "bundleMediaFramework": true,
        "files": {},
        "libraryFolders": []
      },
      "appcategory": null
    }
  }
}
```

## 环境变量替换

配置文件支持环境变量替换：

```json
{
  "app": {
    "windows": [
      {
        "title": "${env.APP_NAME}"
      }
    ]
  }
}
```

## 常见配置示例

### 单窗口应用

```json
{
  "app": {
    "windows": [
      {
        "label": "main",
        "title": "My App",
        "width": 800,
        "height": 600,
        "resizable": true,
        "center": true
      }
    ]
  }
}
```

### 透明无边框窗口

```json
{
  "app": {
    "windows": [
      {
        "label": "main",
        "title": "My App",
        "width": 800,
        "height": 600,
        "decorations": false,
        "transparent": true
      }
    ]
  }
}
```

### 多窗口应用

```json
{
  "app": {
    "windows": [
      {
        "label": "main",
        "title": "Main Window",
        "width": 1200,
        "height": 800
      },
      {
        "label": "settings",
        "title": "Settings",
        "width": 600,
        "height": 400,
        "visible": false
      }
    ]
  }
}
```

### CSP 配置

```json
{
  "app": {
    "security": {
      "csp": "default-src 'self'; img-src 'self' asset: https://asset.localhost; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    }
  }
}
```

### 包含资源文件

```json
{
  "bundle": {
    "resources": [
      "assets/**/*",
      "config.json",
      {
        "from": "../external",
        "to": "resources"
      }
    ]
  }
}
```

### 文件关联

```json
{
  "bundle": {
    "fileAssociations": [
      {
        "ext": "txt",
        "name": "Text File",
        "description": "A plain text file",
        "role": "Editor",
        "icon": ["icons/txt.png"]
      }
    ]
  }
}
```

## 插件配置

```json
{
  "plugins": {
    "shell": {
      "open": true
    },
    "fs": {
      "scope": ["$APP_DATA/**", "$APP_CONFIG/**"]
    }
  }
}
```

## 最佳实践

1. **使用 schema**：总是添加 `$schema` 字段以获得编辑器智能提示
2. **分离配置**：考虑为不同环境创建单独的配置文件
3. **版本控制**：将配置文件提交到版本控制
4. **安全性**：合理配置 CSP 和 capabilities
5. **图标**：提供所有必需尺寸的图标

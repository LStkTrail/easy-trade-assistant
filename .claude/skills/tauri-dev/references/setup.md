# 环境配置

本文档详细讲解如何配置 Tauri 开发环境。

## 系统要求

### 支持的平台

- **Windows**: Windows 10 或更高版本
- **macOS**: macOS 10.15 (Catalina) 或更高版本
- **Linux**: 主流发行版 (Ubuntu, Fedora, Arch 等)

## 安装依赖

### Windows

#### 1. Microsoft C++ Build Tools

下载并安装 [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

在安装时选择 **"使用 C++ 的桌面开发"** 工作负载。

或者使用 winget:
```powershell
winget install Microsoft.VisualStudio.2022.BuildTools --silent --add Microsoft.VisualStudio.Workload.VCTools;includeRecommended
```

#### 2. WebView2

Windows 11 已预装 WebView2。对于 Windows 10，下载并安装 [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

或者使用 winget:
```powershell
winget install Microsoft.EdgeWebView2Runtime
```

### macOS

#### 1. Xcode Command Line Tools

```bash
xcode-select --install
```

如果已经安装，会提示错误，可以忽略。

#### 验证安装

```bash
xcode-select -p
# 应该输出类似: /Library/Developer/CommandLineTools
```

### Linux

#### Debian/Ubuntu

```bash
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

#### Fedora

```bash
sudo dnf install -y \
  webkit2gtk4.1-devel \
  gtk3-devel \
  libayatana-appindicator-gtk3-devel \
  openssl-devel \
  librsvg2-devel
```

#### Arch Linux

```bash
sudo pacman -Syu --needed \
  webkit2gtk-4.1 \
  base-devel \
  curl \
  wget \
  file \
  openssl \
  gtk3 \
  libayatana-appindicator \
  librsvg
```

#### openSUSE

```bash
sudo zypper install -y \
  webkit2gtk3-soup2-devel \
  gtk3-devel \
  libopenssl-devel \
  curl \
  wget \
  file
```

## 安装 Rust

### 使用 rustup (推荐)

#### Windows/MacOS/Linux

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

或者在 Windows 上下载并运行 [rustup-init.exe](https://win.rustup.rs/)

#### 安装后配置

重启终端或运行：

```bash
# Linux/macOS
source $HOME/.cargo/env

# Windows (PowerShell)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")
```

### 验证 Rust 安装

```bash
rustc --version
# 应该输出类似: rustc 1.77.2 (25ef9e3d8 2024-04-09)

cargo --version
# 应该输出类似: cargo 1.77.2 (e52e3600f 2024-04-01)
```

### 配置 Rust 工具链

```bash
# 安装稳定版工具链
rustup install stable

# 设置默认工具链
rustup default stable

# 更新 Rust
rustup update
```

## 安装 Node.js 和包管理器

### 安装 Node.js

推荐使用 LTS 版本：

#### 使用 nvm (推荐)

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装 Node.js LTS
nvm install --lts
nvm use --lts
```

#### 或者直接下载

从 [Node.js 官网](https://nodejs.org/) 下载并安装 LTS 版本。

### 验证 Node.js 安装

```bash
node --version
# 应该输出类似: v20.11.0

npm --version
# 应该输出类似: 10.2.4
```

## 安装 pnpm

Tauri 官方推荐使用 pnpm 作为包管理器。

### 安装 pnpm

```bash
# 使用 npm
npm install -g pnpm

# 或使用官方脚本
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 验证 pnpm 安装

```bash
pnpm --version
# 应该输出类似: 10.16.0
```

### 配置 pnpm (可选)

```bash
# 设置镜像源（如果在国内）
pnpm config set registry https://registry.npmmirror.com

# 设置存储目录
pnpm config set store-dir ~/.pnpm-store
```

## 安装 Tauri CLI

### 全局安装

```bash
# 使用 npm
npm install -g @tauri-apps/cli

# 使用 pnpm
pnpm add -g @tauri-apps/cli

# 使用 cargo (仅 Rust CLI)
cargo install tauri-cli
```

### 验证安装

```bash
# Node.js CLI
tauri --version
# 应该输出类似: tauri-cli 2.10.1

# 或使用 npx
npx tauri --version

# 或使用 pnpm
pnpm tauri --version

# Rust CLI
cargo tauri --version
```

## 开发工具 (可选但推荐)

### 代码编辑器

#### VS Code

下载并安装 [VS Code](https://code.visualstudio.com/)

推荐安装的扩展：
- **rust-analyzer** - Rust 语言支持
- **Tauri** - Tauri 官方扩展
- **ESLint** - JavaScript/TypeScript 代码检查
- **Prettier** - 代码格式化
- **DotENV** - .env 文件高亮

#### JetBrains IDEs

- **CLion** 或 **RustRover** - 完整的 Rust IDE
- **WebStorm** - 前端开发
- 安装 Tauri 插件

### Rust 开发工具

```bash
# rust-analyzer (语言服务器)
rustup component add rust-analyzer

# rustfmt (代码格式化)
rustup component add rustfmt

# clippy (代码检查)
rustup component add clippy
```

### 浏览器开发者工具

Tauri 应用内置了浏览器开发者工具：

- Windows/Linux: `Ctrl + Shift + I` 或 `F12`
- macOS: `Cmd + Option + I`

## 验证环境

### 创建测试项目

```bash
# 使用 create-tauri-app
pnpm create tauri-app@latest test-tauri-app
# 或
npm create tauri-app@latest test-tauri-app

# 进入项目目录
cd test-tauri-app

# 安装依赖
pnpm install

# 运行开发模式
pnpm tauri dev
```

如果一切正常，应该会看到一个窗口显示 "Welcome to Tauri!"。

### 检查单个组件

```bash
# 检查 Rust
rustc --version
cargo --version
cargo clippy --version

# 检查 Node.js
node --version
npm --version

# 检查 pnpm
pnpm --version

# 检查 Tauri
npx tauri --version
```

## 常见问题

### Windows

#### "linker `link.exe` not found"

确保已安装 Microsoft C++ Build Tools，并选择了"使用 C++ 的桌面开发"工作负载。

#### WebView2 相关错误

确保已安装 WebView2 Runtime。

### macOS

#### "xcrun: error: invalid active developer path"

重新安装 Xcode Command Line Tools:
```bash
sudo xcode-select --reset
xcode-select --install
```

#### 权限问题

确保你的终端有完整的磁盘访问权限：
- 系统设置 → 隐私与安全性 → 完整磁盘访问
- 添加你的终端应用

### Linux

#### 缺少依赖库

根据你的发行版安装相应的依赖包。

#### 权限错误

确保用户在正确的用户组中：
```bash
# Ubuntu/Debian
sudo usermod -aG plugdev $USER

# Arch Linux
sudo usermod -aG uucp $USER
```

## 代理配置 (可选)

如果在中国大陆或需要使用代理：

### Rust

编辑 `~/.cargo/config.toml`:

```toml
[source.crates-io]
replace-with = 'rsproxy'

[source.rsproxy]
registry = "https://rsproxy.cn/crates.io-index"

[net]
git-fetch-with-cli = true
```

### npm/pnpm

```bash
# 设置镜像源
npm config set registry https://registry.npmmirror.com
pnpm config set registry https://registry.npmmirror.com

# 或使用临时镜像
pnpm install --registry https://registry.npmmirror.com
```

### Git

```bash
# 设置代理
git config --global http.proxy http://proxy.example.com:8080
git config --global https.proxy http://proxy.example.com:8080

# 或使用镜像
git config --global url."https://ghproxy.com/https://github.com/".insteadOf "https://github.com/"
```

## 下一步

环境配置完成后，继续阅读 [快速开始](./quick-start.md) 创建你的第一个 Tauri 应用！

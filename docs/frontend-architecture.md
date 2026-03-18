# 邮件客户端前端架构设计文档

## 1. 技术栈

- **框架**: Vue 3.5+ (Composition API + `<script setup>`)
- **语言**: TypeScript 5.6+
- **构建工具**: Vite 6.0+
- **桌面集成**: Tauri 2
- **状态管理**: Pinia (轻量级，适合Tauri)
- **样式**: SCSS + CSS Modules
- **日期处理**: dayjs (轻量替代moment)

---

## 2. 目录结构设计

```
src/
├── main.ts                          # 应用入口
├── App.vue                          # 根组件
├── components/                      # 通用组件
│   ├── common/                      # 基础UI组件
│   │   ├── Button.vue
│   │   ├── Icon.vue
│   │   ├── Avatar.vue
│   │   ├── Badge.vue
│   │   ├── Input.vue
│   │   ├── Modal.vue
│   │   ├── Tabs.vue
│   │   ├── Switch.vue
│   │   └── Tooltip.vue
│   └── layout/                      # 布局组件
│       ├── ResizablePane.vue
│       └── OverlayPortal.vue        # 悬浮层容器
├── layouts/                         # 页面布局
│   └── MainLayout.vue               # 主布局（四栏结构）
├── modules/                         # 业务模块
│   ├── sidebar/                     # 第一栏：侧边导航
│   │   ├── components/
│   │   │   ├── NavItem.vue
│   │   │   └── UserProfile.vue
│   │   └── Sidebar.vue
│   ├── mail-list/                   # 第二栏：邮件列表
│   │   ├── components/
│   │   │   ├── TimeGroup.vue
│   │   │   ├── MailSearch.vue
│   │   │   └── MailItem.vue
│   │   ├── composables/
│   │   │   └── useTimeGrouping.ts
│   │   └── MailListPane.vue
│   ├── mail-detail/                 # 第三栏：邮件详情
│   │   ├── components/
│   │   │   ├── MailHeader.vue
│   │   │   ├── MailBody.vue
│   │   │   ├── MailActions.vue
│   │   │   └── AIActionBar.vue
│   │   └── MailDetailPane.vue
│   ├── ai-assistant/                # 第四栏：AI助手（多会话）
│   │   ├── components/
│   │   │   ├── ChatMessage.vue
│   │   │   ├── QuickPrompts.vue
│   │   │   ├── ChatInput.vue
│   │   │   ├── SessionItem.vue
│   │   │   └── SessionList.vue
│   │   └── AIAssistantPane.vue
│   └── settings/                    # 设置模块（悬浮层）
│       ├── components/
│       │   ├── SettingsModal.vue
│       │   ├── SidebarAccount.vue
│       │   ├── SidebarEditor.vue
│       │   ├── SidebarTemplate.vue
│       │   ├── SidebarShortcut.vue
│       │   └── SidebarAISettings.vue
│       │   ├── AccountSettings.vue
│       │   ├── EditorSettings.vue
│       │   ├── TemplateSettings.vue
│       │   ├── ShortcutSettings.vue
│       │   └── AISettings.vue
│       └── SettingsOverlay.vue
├── stores/                          # Pinia 状态管理
│   ├── index.ts
│   ├── mail.store.ts
│   ├── ui.store.ts
│   ├── ai.store.ts
│   ├── settings.store.ts
│   └── mock-data.store.ts           # 打桩数据Store（与前端解耦）
├── composables/                     # 通用组合式函数
│   ├── index.ts
│   ├── useVirtualList.ts
│   ├── useTheme.ts
│   └── useClickOutside.ts
├── services/                        # 服务层
│   ├── index.ts
│   ├── mail.service.ts
│   ├── ai.service.ts
│   └── storage.service.ts
├── types/                           # TypeScript 类型定义
│   ├── index.ts
│   ├── mail.types.ts
│   ├── ai.types.ts
│   ├── ui.types.ts
│   ├── settings.types.ts
│   └── mock.types.ts
├── data/                            # 打桩数据（独立模块）
│   ├── index.ts
│   ├── mails.mock.ts
│   ├── accounts.mock.ts
│   ├── templates.mock.ts
│   └── knowledge.mock.ts
├── utils/                           # 工具函数
│   ├── index.ts
│   ├── date.ts
│   ├── format.ts
│   └── email.ts
└── assets/                          # 静态资源
    └── styles/
        ├── variables.scss
        └── reset.scss
```

---

## 3. 新增功能设计（V2）

### 3.1 AI 助手多会话功能

#### 设计目标
- 支持创建多个独立的对话会话
- 会话列表显示在AI面板左侧
- 支持会话重命名、删除
- 每个会话独立保存历史消息

#### 数据模型
```typescript
// src/types/ai.types.ts 新增
export interface ChatSession {
  id: string
  title: string           // 会话标题（可编辑）
  messages: ChatMessage[]
  currentMailId?: string
  createdAt: Date
  updatedAt: Date
}
```

#### UI 布局
```
┌─────────────────────────────────────────┐
│  [会话] [新会话]  AI助手  [x]      │
├──────────┬──────────────────────────────┤
│          │                              │
│ 会话1  ✓ │    对话内容区域             │
│ 会话2    │                              │
│ 会话3    │                              │
│ ...      │                              │
│ [+]      │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

---

### 3.2 设置模块（悬浮层）

#### 设计目标
- 点击用户头像弹出设置模态框
- 悬浮在整个界面之上，带遮罩层
- 左侧导航切换不同设置页面

#### 设置分类

##### 1. 邮箱账号设置
- 显示已添加的邮箱账号列表
- 新增邮箱按钮（弹出向导）
- 编辑/删除账号
- 设置默认账号

##### 2. 编辑器设置
- 邮件签名配置（富文本编辑器）
- 默认字体、字号
- 回复/转发前缀设置
- 默认是否引用原文

##### 3. 模板设置
- 邮件模板列表
- 新增/编辑/删除模板
- 模板分类管理
- 模板变量支持（如 {{收件人}}, {{日期}}）

##### 4. 快捷键设置
- 快捷键列表展示
- 支持自定义快捷键
- 预设常用快捷键：
  - `Ctrl+N`: 新邮件
  - `Ctrl+R`: 回复
  - `Ctrl+Shift+R`: 全部回复
  - `Ctrl+F`: 搜索
  - `Ctrl+1~5`: 切换文件夹

##### 5. AI 设置
- 功能开关：
  - [ ] 启用AI助手
  - [ ] 自动翻译邮件
  - [ ] 显示AI快捷操作栏
- AI模型配置（支持多套配置）：
  - 配置名称
  - Base URL
  - API Key
  - Model Name
  - 设为当前默认
- 知识库配置（服装外贸行业）：
  - 行业术语库（可导入JSON）
  - 术语中英对照
  - 支持添加/编辑/删除术语

---

### 3.3 打桩数据系统（与前端解耦）

#### 设计原则
- 打桩数据独立于 `src/data/` 目录
- 通过 `MockDataStore` 统一管理
- 支持开关：开发环境使用mock，生产环境使用真实后端
- 与前端代码完全解耦，易替换

#### 数据结构
```typescript
// src/types/mock.types.ts
export interface MockData {
  mails: Mail[]
  accounts: EmailAccount[]
  templates: EmailTemplate[]
  knowledge: KnowledgeTerm[]
  chatSessions: ChatSession[]
}

// 打桩数据Provider
export interface MockDataProvider {
  getMails(): Mail[]
  getAccounts(): EmailAccount[]
  getTemplates(): EmailTemplate[]
  getKnowledge(): KnowledgeTerm[]
  getChatSessions(): ChatSession[]
}
```

#### 使用方式
```typescript
// stores/mock-data.store.ts
import { defineStore } from 'pinia'
import { mockData } from '@/data'

export const useMockDataStore = defineStore('mockData', () => {
  const enabled = ref(import.meta.env.DEV) // 开发环境默认开启

  function getMails() {
    return enabled.value ? mockData.mails : []
  }

  // ... 其他数据获取方法
})
```

---

## 4. 核心数据模型设计（更新）

### 4.1 设置类型 (`src/types/settings.types.ts`)

```typescript
// 邮箱账号
export interface EmailAccount {
  id: string
  name: string
  email: string
  password?: string
  smtpHost?: string
  smtpPort?: number
  imapHost?: string
  imapPort?: number
  isDefault: boolean
  createdAt: Date
}

// 邮件签名
export interface EmailSignature {
  id: string
  name: string
  content: string // HTML
  isDefault: boolean
}

// 邮件模板
export interface EmailTemplate {
  id: string
  name: string
  category: string
  subject: string
  content: string // HTML
  variables: string[]
  createdAt: Date
  updatedAt: Date
}

// 快捷键
export interface Shortcut {
  id: string
  name: string
  description: string
  key: string
  ctrl: boolean
  shift: boolean
  alt: boolean
}

// AI模型配置
export interface AIModelConfig {
  id: string
  name: string
  baseUrl: string
  apiKey: string
  modelName: string
  isDefault: boolean
  createdAt: Date
}

// 知识库术语
export interface KnowledgeTerm {
  id: string
  termCN: string
  termEN: string
  category: string
  description?: string
  tags: string[]
}

// AI设置
export interface AISettings {
  enabled: boolean
  autoTranslate: boolean
  showActionBar: boolean
  modelConfigs: AIModelConfig[]
  currentModelId?: string
  knowledgeBase: KnowledgeTerm[]
}

// 编辑器设置
export interface EditorSettings {
  signatures: EmailSignature[]
  defaultSignatureId?: string
  defaultFont: string
  defaultFontSize: number
  replyPrefix: string
  forwardPrefix: string
  quoteOriginal: boolean
}

// 设置总览
export interface AppSettings {
  accounts: EmailAccount[]
  editor: EditorSettings
  templates: EmailTemplate[]
  shortcuts: Shortcut[]
  ai: AISettings
  theme: Theme
}
```

---

## 5. 新增状态管理设计

### 5.1 AI Store 更新（支持多会话）

```typescript
// stores/ai.store.ts
export const useAIStore = defineStore('ai', () => {
  const sessions = ref<ChatSession[]>([])
  const currentSessionId = ref<string | null>(null)
  const isPanelVisible = ref(true)
  const showSessionList = ref(true)
  const isLoading = ref(false)

  const currentSession = computed(() =>
    sessions.value.find(s => s.id === currentSessionId.value)
  )
  const messages = computed(() => currentSession.value?.messages ?? [])

  // 创建新会话
  function createSession(mailId?: string, title = '新对话') {
    const session: ChatSession = {
      id: crypto.randomUUID(),
      title,
      messages: [],
      currentMailId: mailId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    sessions.value.unshift(session)
    currentSessionId.value = session.id
    return session
  }

  // 切换会话
  function switchSession(sessionId: string) {
    currentSessionId.value = sessionId
  }

  // 删除会话
  function deleteSession(sessionId: string) {
    const index = sessions.value.findIndex(s => s.id === sessionId)
    if (index > -1) {
      sessions.value.splice(index, 1)
      if (currentSessionId.value === sessionId) {
        currentSessionId.value = sessions.value[0]?.id ?? null
      }
    }
  }

  // 重命名会话
  function renameSession(sessionId: string, title: string) {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      session.title = title
      session.updatedAt = new Date()
    }
  }

  // 确保有当前会话
  function ensureSession() {
    if (!currentSession.value) {
      createSession()
    }
  }

  return {
    sessions,
    currentSessionId,
    currentSession,
    messages,
    isPanelVisible,
    showSessionList,
    isLoading,
    createSession,
    switchSession,
    deleteSession,
    renameSession,
    ensureSession,
    togglePanel: () => { isPanelVisible.value = !isPanelVisible.value }
  }
})
```

### 5.2 Settings Store

```typescript
// stores/settings.store.ts
import { defineStore } from 'pinia'
import type { AppSettings, EmailAccount, EmailTemplate, Shortcut, AIModelConfig, KnowledgeTerm } from '@/types'

export const useSettingsStore = defineStore('settings', () => {
  const isModalOpen = ref(false)
  const activeTab = ref('accounts')

  const settings = ref<AppSettings>({
    accounts: [],
    editor: {
      signatures: [],
      defaultFont: 'Inter',
      defaultFontSize: 14,
      replyPrefix: 'On {{date}}, {{from}} wrote:',
      forwardPrefix: '---------- Forwarded message ----------',
      quoteOriginal: true
    },
    templates: [],
    shortcuts: [],
    ai: {
      enabled: true,
      autoTranslate: false,
      showActionBar: true,
      modelConfigs: [],
      knowledgeBase: []
    },
    theme: 'auto'
  })

  function openModal(tab = 'accounts') {
    activeTab.value = tab
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
  }

  // 账号管理
  function addAccount(account: Omit<EmailAccount, 'id' | 'createdAt'>) {
    settings.value.accounts.push({
      ...account,
      id: crypto.randomUUID(),
      createdAt: new Date()
    })
  }

  function updateAccount(id: string, updates: Partial<EmailAccount>) {
    const account = settings.value.accounts.find(a => a.id === id)
    if (account) Object.assign(account, updates)
  }

  function deleteAccount(id: string) {
    const index = settings.value.accounts.findIndex(a => a.id === id)
    if (index > -1) settings.value.accounts.splice(index, 1)
  }

  function setDefaultAccount(id: string) {
    settings.value.accounts.forEach(a => {
      a.isDefault = a.id === id
    })
  }

  // 模板管理
  function addTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) {
    settings.value.templates.push({
      ...template,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  function updateTemplate(id: string, updates: Partial<EmailTemplate>) {
    const template = settings.value.templates.find(t => t.id === id)
    if (template) {
      Object.assign(template, updates, { updatedAt: new Date() })
    }
  }

  function deleteTemplate(id: string) {
    const index = settings.value.templates.findIndex(t => t.id === id)
    if (index > -1) settings.value.templates.splice(index, 1)
  }

  // AI模型配置
  function addModelConfig(config: Omit<AIModelConfig, 'id' | 'createdAt'>) {
    settings.value.ai.modelConfigs.push({
      ...config,
      id: crypto.randomUUID(),
      createdAt: new Date()
    })
  }

  function updateModelConfig(id: string, updates: Partial<AIModelConfig>) {
    const config = settings.value.ai.modelConfigs.find(c => c.id === id)
    if (config) Object.assign(config, updates)
  }

  function deleteModelConfig(id: string) {
    const index = settings.value.ai.modelConfigs.findIndex(c => c.id === id)
    if (index > -1) settings.value.ai.modelConfigs.splice(index, 1)
  }

  function setDefaultModel(id: string) {
    settings.value.ai.modelConfigs.forEach(c => {
      c.isDefault = c.id === id
    })
    settings.value.ai.currentModelId = id
  }

  // 知识库术语
  function addKnowledgeTerm(term: Omit<KnowledgeTerm, 'id'>) {
    settings.value.ai.knowledgeBase.push({
      ...term,
      id: crypto.randomUUID()
    })
  }

  function updateKnowledgeTerm(id: string, updates: Partial<KnowledgeTerm>) {
    const term = settings.value.ai.knowledgeBase.find(t => t.id === id)
    if (term) Object.assign(term, updates)
  }

  function deleteKnowledgeTerm(id: string) {
    const index = settings.value.ai.knowledgeBase.findIndex(t => t.id === id)
    if (index > -1) settings.value.ai.knowledgeBase.splice(index, 1)
  }

  return {
    isModalOpen,
    activeTab,
    settings,
    openModal,
    closeModal,
    // 账号
    addAccount,
    updateAccount,
    deleteAccount,
    setDefaultAccount,
    // 模板
    addTemplate,
    updateTemplate,
    deleteTemplate,
    // AI
    addModelConfig,
    updateModelConfig,
    deleteModelConfig,
    setDefaultModel,
    addKnowledgeTerm,
    updateKnowledgeTerm,
    deleteKnowledgeTerm
  }
})
```

### 5.3 Mock Data Store（解耦）

```typescript
// stores/mock-data.store.ts
import { defineStore } from 'pinia'
import { getMockData } from '@/data'

export const useMockDataStore = defineStore('mockData', () => {
  const enabled = ref(import.meta.env.DEV) // 开发环境默认启用mock
  const data = ref(getMockData())

  // 从mock加载初始数据到各store
  function loadMockDataToStores() {
    if (!enabled.value) return

    return {
      mails: data.value.mails,
      accounts: data.value.accounts,
      templates: data.value.templates,
      knowledge: data.value.knowledge,
      chatSessions: data.value.chatSessions
    }
  }

  return {
    enabled,
    data,
    loadMockDataToStores
  }
})
```

---

## 6. 打桩数据模块（独立）

```typescript
// data/index.ts
import { mockMails } from './mails.mock'
import { mockAccounts } from './accounts.mock'
import { mockTemplates } from './templates.mock'
import { mockKnowledge } from './knowledge.mock'
import { mockChatSessions } from './chat-sessions.mock'

export function getMockData() {
  return {
    mails: mockMails,
    accounts: mockAccounts,
    templates: mockTemplates,
    knowledge: mockKnowledge,
    chatSessions: mockChatSessions
  }
}
```

---

## 7. 实施计划

### Phase 1: 修复现有问题
1. 修复AI助手面板关闭后无法打开的问题（主布局添加展开按钮）
2. 优化UI现代化样式
3. 添加过渡动画

### Phase 2: AI 多会话功能
1. 更新 AI Store 支持多会话
2. 创建会话列表组件
3. 更新 AI Assistant 面板UI
4. 支持创建/删除/重命名会话

### Phase 3: 设置模态框
1. 创建 OverlayPortal 悬浮层组件
2. 创建 SettingsModal 主框架
3. 实现左侧标签导航
4. 点击头像打开设置

### Phase 4: 设置页面实现
1. 邮箱账号设置页面
2. 编辑器设置页面
3. 模板设置页面
4. 快捷键设置页面
5. AI设置页面

### Phase 5: 打桩数据系统
1. 创建独立的 `data/` 目录
2. 实现各模块的mock数据
3. 创建 MockDataStore
4. 与前端业务逻辑解耦

---

## 8. 原有内容保留

以下为原架构文档内容（保留参考）：

...（此处省略原有内容，实际文档中应保留前面已实现部分的文档）

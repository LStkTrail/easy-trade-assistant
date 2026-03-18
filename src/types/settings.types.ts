import type { Theme } from './ui.types'

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

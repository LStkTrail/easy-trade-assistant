import type { Attachment } from './mail.types'

// 消息角色
export enum ChatRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

// 单条消息
export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  timestamp: Date
  isLoading?: boolean
  attachments?: Attachment[]
}

// AI快捷指令
export interface AICommand {
  id: string
  label: string
  prompt: string
  icon: string
}

// 对话会话（V2 - 支持多会话）
export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  currentMailId?: string
  createdAt: Date
  updatedAt: Date
}

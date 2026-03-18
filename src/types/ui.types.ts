import type { MailFolder } from './mail.types'

// 布局状态
export interface LayoutState {
  sidebarWidth: number
  mailListWidth: number
  aiPanelWidth: number
  isAIPanelVisible: boolean
  activeFolder: MailFolder
  selectedMailId: string | null
}

// 主题
export type Theme = 'light' | 'dark' | 'auto'

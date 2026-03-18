// 邮件状态枚举
export enum MailStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

// 邮件文件夹
export enum MailFolder {
  INBOX = 'inbox',
  SENT = 'sent',
  DRAFTS = 'drafts',
  TRASH = 'trash',
  STARRED = 'starred'
}

// 联系人
export interface Contact {
  id: string
  name: string
  email: string
  avatar?: string
}

// 附件
export interface Attachment {
  id: string
  fileName: string
  fileSize: number
  mimeType: string
  path?: string // Tauri本地路径
  data?: Uint8Array
}

// 邮件实体
export interface Mail {
  id: string
  folder: MailFolder
  status: MailStatus

  // 发送/接收信息
  from: Contact
  to: Contact[]
  cc?: Contact[]
  bcc?: Contact[]

  // 邮件内容
  subject: string
  body: string // HTML格式
  attachments: Attachment[]

  // 时间
  sentAt: Date
  receivedAt: Date
  createdAt: Date
  updatedAt: Date

  // 元数据
  isStarred: boolean
  labels: string[]
  threadId?: string // 线程ID

  // 搜索用（不存储）
  snippet?: string
}

// 时间分组
export interface TimeGroup {
  key: string
  label: string
  mails: Mail[]
}

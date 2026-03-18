import type { EmailAccount } from '@/types'

export const mockAccounts: EmailAccount[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    imapHost: 'imap.example.com',
    imapPort: 993,
    isDefault: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: '工作邮箱',
    email: 'work@company.com',
    smtpHost: 'smtp.company.com',
    smtpPort: 587,
    imapHost: 'imap.company.com',
    imapPort: 993,
    isDefault: false,
    createdAt: new Date('2024-02-15')
  }
]

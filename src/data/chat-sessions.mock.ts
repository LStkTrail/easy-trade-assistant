import type { ChatSession } from '@/types'
import { ChatRole } from '@/types'

export const mockChatSessions: ChatSession[] = [
  {
    id: 'session-1',
    title: '邮件总结',
    messages: [
      {
        id: 'msg-1',
        role: ChatRole.USER,
        content: '帮我总结一下这封邮件',
        timestamp: new Date(Date.now() - 3600000 * 2)
      },
      {
        id: 'msg-2',
        role: ChatRole.ASSISTANT,
        content: '这封邮件是关于2026年Q1项目进度的更新。主要内容包括：\n\n1. 前端开发进度：90%\n2. 后端API开发：85%\n3. 测试覆盖率：75%\n\n邮件还包含了一个详细的PDF报告作为附件。',
        timestamp: new Date(Date.now() - 3600000 * 2 + 10000)
      }
    ],
    currentMailId: 'mail-1',
    createdAt: new Date(Date.now() - 3600000 * 2),
    updatedAt: new Date(Date.now() - 3600000 * 2 + 10000)
  },
  {
    id: 'session-2',
    title: '如何写邮件回复',
    messages: [
      {
        id: 'msg-3',
        role: ChatRole.USER,
        content: '帮我写一封礼貌的邮件回复',
        timestamp: new Date(Date.now() - 3600000 * 24)
      },
      {
        id: 'msg-4',
        role: ChatRole.ASSISTANT,
        content: '好的，这是一个通用的礼貌回复模板：\n\n---\n\n**主题**：Re: [原主题]\n\n您好，\n\n感谢您的来信。关于您提到的问题，我们会尽快处理并回复您。\n\n如有任何疑问，请随时联系。\n\n此致，\n[您的名字]\n\n---\n\n需要我根据具体邮件内容调整吗？',
        timestamp: new Date(Date.now() - 3600000 * 24 + 15000)
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24),
    updatedAt: new Date(Date.now() - 3600000 * 24 + 15000)
  }
]

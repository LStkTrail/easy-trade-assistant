import { invoke } from '@tauri-apps/api/core'

export const aiService = {
  async chat(message: string, mailId?: string): Promise<string> {
    try {
      return await invoke('ai_chat', { message, mailId })
    } catch {
      // Tauri后端未实现时返回模拟响应
      return '这是一个模拟的AI回复。当Tauri后端实现后，这里会显示真实的AI对话内容。'
    }
  },

  async summarizeMail(mailId: string): Promise<string> {
    try {
      return await invoke('ai_summarize_mail', { mailId })
    } catch {
      return '邮件摘要：这封邮件的主要内容是...'
    }
  },

  async generateReply(mailId: string, tone: 'formal' | 'casual' = 'formal'): Promise<string> {
    try {
      return await invoke('ai_generate_reply', { mailId, tone })
    } catch {
      return tone === 'formal'
        ? '您好，感谢您的来信。关于您提到的问题，我会尽快处理。'
        : '好的，收到！我来看看怎么处理这事～'
    }
  }
}

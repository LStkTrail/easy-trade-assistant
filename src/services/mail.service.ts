import { invoke } from '@tauri-apps/api/core'
import type { Mail, MailFolder } from '@/types'

export const mailService = {
  async fetchMails(
    folder: MailFolder,
    options: { offset?: number; limit?: number } = {}
  ): Promise<Mail[]> {
    try {
      return await invoke('fetch_mails', {
        folder,
        offset: options.offset ?? 0,
        limit: options.limit ?? 50
      })
    } catch {
      // Tauri后端未实现时返回模拟数据
      return []
    }
  },

  async getMail(mailId: string): Promise<Mail> {
    try {
      return await invoke('get_mail', { mailId })
    } catch {
      throw new Error('Mail not found')
    }
  },

  async markAsRead(mailId: string): Promise<void> {
    try {
      return await invoke('mark_as_read', { mailId })
    } catch {
      // 静默失败
    }
  },

  async sendMail(mail: Partial<Mail>): Promise<void> {
    try {
      return await invoke('send_mail', { mail })
    } catch {
      throw new Error('Failed to send mail')
    }
  }
}

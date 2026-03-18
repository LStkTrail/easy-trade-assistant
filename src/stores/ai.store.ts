import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChatMessage, ChatSession } from '@/types'
import { ChatRole } from '@/types'
import { aiService } from '@/services'

export const useAIStore = defineStore('ai', () => {
  // 状态 - 支持多会话
  const sessions = ref<ChatSession[]>([])
  const currentSessionId = ref<string | null>(null)
  const isPanelVisible = ref(true)
  const showSessionList = ref(true)
  const isLoading = ref(false)

  // 计算属性
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

  // 添加用户消息
  function addUserMessage(content: string) {
    ensureSession()
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role: ChatRole.USER,
      content,
      timestamp: new Date()
    }
    currentSession.value!.messages.push(message)
    if (currentSession.value!.title === '新对话' && content.length > 0) {
      currentSession.value!.title = content.slice(0, 20) + (content.length > 20 ? '...' : '')
    }
    currentSession.value!.updatedAt = new Date()
    return message
  }

  // 添加AI消息
  function addAssistantMessage(content: string, isLoading = false) {
    ensureSession()
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role: ChatRole.ASSISTANT,
      content,
      timestamp: new Date(),
      isLoading
    }
    currentSession.value!.messages.push(message)
    currentSession.value!.updatedAt = new Date()
    return message
  }

  // 更新AI消息
  function updateAssistantMessage(messageId: string, content: string) {
    const msg = currentSession.value?.messages.find(m => m.id === messageId)
    if (msg) {
      msg.content = content
    }
  }

  // 发送消息
  async function sendMessage(content: string, contextMailId?: string) {
    addUserMessage(content)
    isLoading.value = true
    const aiMessage = addAssistantMessage('', true)

    try {
      const response = await aiService.chat(
        content,
        contextMailId ?? currentSession.value?.currentMailId
      )
      updateAssistantMessage(aiMessage.id, response)
      aiMessage.isLoading = false
    } catch (error) {
      updateAssistantMessage(aiMessage.id, '抱歉，发生了错误，请重试。')
      aiMessage.isLoading = false
    } finally {
      isLoading.value = false
    }
  }

  async function summarizeMail(mailId: string) {
    if (!currentSession.value || currentSession.value.currentMailId !== mailId) {
      createSession(mailId, '邮件总结')
    }
    isLoading.value = true
    const aiMessage = addAssistantMessage('正在总结邮件...', true)

    try {
      const summary = await aiService.summarizeMail(mailId)
      updateAssistantMessage(aiMessage.id, summary)
      aiMessage.isLoading = false
    } catch (error) {
      updateAssistantMessage(aiMessage.id, '抱歉，总结失败。')
      aiMessage.isLoading = false
    } finally {
      isLoading.value = false
    }
  }

  async function generateReply(mailId: string, tone: 'formal' | 'casual' = 'formal') {
    if (!currentSession.value || currentSession.value.currentMailId !== mailId) {
      createSession(mailId, '邮件回复')
    }
    isLoading.value = true
    const aiMessage = addAssistantMessage('正在生成回复...', true)

    try {
      const reply = await aiService.generateReply(mailId, tone)
      updateAssistantMessage(aiMessage.id, reply)
      aiMessage.isLoading = false
    } catch (error) {
      updateAssistantMessage(aiMessage.id, '抱歉，生成回复失败。')
      aiMessage.isLoading = false
    } finally {
      isLoading.value = false
    }
  }

  function togglePanel() {
    isPanelVisible.value = !isPanelVisible.value
  }

  function toggleSessionList() {
    showSessionList.value = !showSessionList.value
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
    sendMessage,
    addUserMessage,
    addAssistantMessage,
    summarizeMail,
    generateReply,
    togglePanel,
    toggleSessionList
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  AppSettings,
  EmailAccount,
  EmailTemplate,
  AIModelConfig,
  KnowledgeTerm,
  Shortcut
} from '@/types'

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
    shortcuts: [
      { id: 'new-mail', name: '新邮件', description: '撰写新邮件', key: 'N', ctrl: true, shift: false, alt: false },
      { id: 'reply', name: '回复', description: '回复当前邮件', key: 'R', ctrl: true, shift: false, alt: false },
      { id: 'reply-all', name: '全部回复', description: '回复所有人', key: 'R', ctrl: true, shift: true, alt: false },
      { id: 'forward', name: '转发', description: '转发当前邮件', key: 'F', ctrl: true, shift: true, alt: false },
      { id: 'send', name: '发送', description: '发送当前邮件', key: 'Enter', ctrl: true, shift: false, alt: false },
      { id: 'search', name: '搜索', description: '搜索邮件', key: 'F', ctrl: true, shift: false, alt: false },
      { id: 'archive', name: '归档', description: '归档当前邮件', key: 'E', ctrl: true, shift: false, alt: false },
      { id: 'delete', name: '删除', description: '删除当前邮件', key: 'Backspace', ctrl: true, shift: false, alt: false },
    ],
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

  // 快捷键管理
  function updateShortcut(id: string, updates: Partial<Shortcut>) {
    const shortcut = settings.value.shortcuts.find(s => s.id === id)
    if (shortcut) Object.assign(shortcut, updates)
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
    deleteKnowledgeTerm,
    // 快捷键
    updateShortcut
  }
})

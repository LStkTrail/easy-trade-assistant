import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getMockData } from '@/data'

export const useMockDataStore = defineStore('mockData', () => {
  const enabled = ref(import.meta.env.DEV) // 开发环境默认启用mock

  function loadMockDataToStores() {
    const data = getMockData()
    return {
      mails: data.mails,
      accounts: data.accounts,
      templates: data.templates,
      knowledge: data.knowledge,
      chatSessions: data.chatSessions
    }
  }

  return {
    enabled,
    loadMockDataToStores
  }
})

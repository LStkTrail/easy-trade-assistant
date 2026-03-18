import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Theme } from '@/types'

export const useUIStore = defineStore('ui', () => {
  // 面板宽度
  const sidebarWidth = ref(64)
  const mailListWidth = ref(300)
  const aiPanelWidth = ref(340)

  // 主题
  const theme = ref<Theme>('auto')

  // 方法
  function setSidebarWidth(width: number) {
    sidebarWidth.value = Math.max(60, Math.min(200, width))
  }

  function setMailListWidth(width: number) {
    mailListWidth.value = Math.max(240, Math.min(500, width))
  }

  function setAIPanelWidth(width: number) {
    aiPanelWidth.value = Math.max(280, Math.min(500, width))
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme
  }

  function resetLayout() {
    sidebarWidth.value = 64
    mailListWidth.value = 300
    aiPanelWidth.value = 340
  }

  return {
    sidebarWidth,
    mailListWidth,
    aiPanelWidth,
    theme,
    setSidebarWidth,
    setMailListWidth,
    setAIPanelWidth,
    setTheme,
    resetLayout
  }
})

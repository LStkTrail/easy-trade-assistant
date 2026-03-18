import { ref, watch } from 'vue'
import type { Theme } from '@/types'

export function useTheme() {
  const theme = ref<Theme>('auto')

  function applyTheme(t: Theme) {
    const isDark = t === 'dark'
      || (t === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', t)
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : theme.value === 'dark' ? 'auto' : 'light'
  }

  // 初始化
  const saved = localStorage.getItem('theme') as Theme | null
  if (saved) theme.value = saved
  applyTheme(theme.value)

  watch(theme, applyTheme)

  return { theme, toggleTheme, applyTheme }
}

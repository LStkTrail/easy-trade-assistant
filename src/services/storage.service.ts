// 本地存储封装
export const storageService = {
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue ?? null
    } catch {
      return defaultValue ?? null
    }
  },

  set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      console.error('Failed to save to localStorage')
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key)
  },

  clear(): void {
    localStorage.clear()
  }
}

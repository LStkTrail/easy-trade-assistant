// 从邮箱获取头像颜色（用于生成默认头像）
export function getAvatarColor(email: string): string {
  const colors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7',
    '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
    '#009688', '#4CAF50', '#8BC34A', '#FF9800'
  ]
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// 从姓名获取首字母
export function getInitials(name: string): string {
  return name.charAt(0).toUpperCase()
}

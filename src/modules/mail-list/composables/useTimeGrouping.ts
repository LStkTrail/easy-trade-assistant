import { computed } from 'vue'
import dayjs from 'dayjs'
import type { Mail, TimeGroup } from '@/types'

export function useTimeGrouping(mailsArr: Mail[]) {
  const timeGroups = computed(() => {
    const groups: Record<string, TimeGroup> = {}
    const now = dayjs()

    mailsArr.forEach((mail: Mail) => {
      const date = dayjs(mail.receivedAt)
      let key: string
      let label: string

      if (date.isSame(now, 'day')) {
        key = 'today'
        label = '今天'
      } else if (date.isSame(now.subtract(1, 'day'), 'day')) {
        key = 'yesterday'
        label = '昨天'
      } else if (date.isAfter(now.subtract(7, 'day'))) {
        key = 'last-week'
        label = '上周'
      } else if (date.isSame(now, 'month')) {
        key = `this-month`
        label = date.format('M月')
      } else if (date.isSame(now.subtract(1, 'month'), 'month')) {
        key = `last-month`
        label = date.format('M月')
      } else if (date.isSame(now, 'year')) {
        key = `month-${date.month()}`
        label = date.format('M月')
      } else {
        key = `year-${date.year()}-${date.month()}`
        label = date.format('YYYY年M月')
      }

      if (!groups[key]) {
        groups[key] = { key, label, mails: [] }
      }
      groups[key].mails.push(mail)
    })

    const order = ['today', 'yesterday', 'last-week']
    return Object.values(groups).sort((a, b) => {
      const idxA = order.indexOf(a.key)
      const idxB = order.indexOf(b.key)
      if (idxA >= 0 && idxB >= 0) return idxA - idxB
      if (idxA >= 0) return -1
      if (idxB >= 0) return 1
      return b.mails[0].receivedAt.getTime() - a.mails[0].receivedAt.getTime()
    })
  })

  return { timeGroups }
}

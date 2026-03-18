import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

export { dayjs }

// 格式化相对时间
export function formatRelativeTime(date: Date | string | number): string {
  const d = dayjs(date)
  const now = dayjs()

  if (d.isSame(now, 'day')) {
    return d.format('HH:mm')
  } else if (d.isSame(now.subtract(1, 'day'), 'day')) {
    return '昨天'
  } else if (d.isAfter(now.subtract(7, 'day'))) {
    return d.format('ddd')
  } else if (d.isSame(now, 'year')) {
    return d.format('M-D')
  } else {
    return d.format('YYYY-M-D')
  }
}

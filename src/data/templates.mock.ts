import type { EmailTemplate } from '@/types'

export const mockTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: '询价回复',
    category: '外贸',
    subject: '回复：关于 {{产品名}} 的询价',
    content: '<p>您好 {{客户名}}，</p><p>感谢您对我们产品的关注。关于 {{产品名}}，报价如下：</p><p>价格：{{价格}}</p><p>最小起订量：{{MOQ}}</p><p>期待与您合作！</p><p>此致，<br>销售团队</p>',
    variables: ['客户名', '产品名', '价格', 'MOQ'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '2',
    name: '订单确认',
    category: '外贸',
    subject: '订单确认 - {{订单号}}',
    content: '<p>尊敬的 {{客户名}}，</p><p>您的订单 {{订单号}} 已确认，预计 {{发货日期}} 发货。</p><p>感谢您的支持！</p>',
    variables: ['客户名', '订单号', '发货日期'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
]

import type { KnowledgeTerm } from '@/types'

export const mockKnowledge: KnowledgeTerm[] = [
  {
    id: '1',
    termCN: '最小起订量',
    termEN: 'MOQ (Minimum Order Quantity)',
    category: '贸易术语',
    description: '指卖方要求买方订购货物的最低数量',
    tags: ['价格', '订单']
  },
  {
    id: '2',
    termCN: '离岸价',
    termEN: 'FOB (Free on Board)',
    category: '价格术语',
    description: '指卖方在指定的装运港将货物装上买方指定的船只',
    tags: ['价格', '运输']
  },
  {
    id: '3',
    termCN: '成本加运费',
    termEN: 'CFR (Cost and Freight)',
    category: '价格术语',
    description: '指卖方必须支付将货物运至指定目的港所需的成本和运费',
    tags: ['价格', '运输']
  },
  {
    id: '4',
    termCN: '信用证',
    termEN: 'L/C (Letter of Credit)',
    category: '支付方式',
    description: '银行开立的有条件的承诺付款的书面文件',
    tags: ['支付', '金融']
  },
  {
    id: '5',
    termCN: '电汇',
    termEN: 'T/T (Telegraphic Transfer)',
    category: '支付方式',
    description: '通过电报办理汇兑',
    tags: ['支付', '金融']
  }
]

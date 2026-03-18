import { MailFolder, MailStatus } from '@/types'
import type { Mail, Contact } from '@/types'

function createContact(name: string, email: string): Contact {
  return { id: email, name, email }
}

const contacts = [
  createContact('张三', 'zhangsan@example.com'),
  createContact('李四', 'lisi@example.com'),
  createContact('王五', 'wangwu@example.com'),
  createContact('技术团队', 'tech@example.com'),
  createContact('产品经理', 'pm@example.com'),
  createContact('HR', 'hr@company.com'),
  createContact('GitHub', 'noreply@github.com'),
  createContact('阿里云', 'notice@aliyun.com')
]

function createMail(
  id: string,
  from: Contact,
  subject: string,
  body: string,
  daysAgo: number = 0,
  isUnread: boolean = true,
  hasAttachment: boolean = false
): Mail {
  const now = new Date()
  const date = new Date(now)
  date.setDate(date.getDate() - daysAgo)

  return {
    id,
    folder: MailFolder.INBOX,
    status: isUnread ? MailStatus.UNREAD : MailStatus.READ,
    from,
    to: [createContact('我', 'me@example.com')],
    subject,
    body,
    attachments: hasAttachment ? [{
      id: 'att-1',
      fileName: 'report.pdf',
      fileSize: 1024 * 1024 * 2.5,
      mimeType: 'application/pdf'
    }] : [],
    sentAt: date,
    receivedAt: date,
    createdAt: date,
    updatedAt: date,
    isStarred: false,
    labels: []
  }
}

export const mockMails: Mail[] = [
  createMail('mail-1', contacts[0], '项目进度更新 - 2026年Q1', '<p>你好！</p><p>以下是本季度项目的最新进度：</p><ul><li>前端开发：90%</li><li>后端API：85%</li><li>测试覆盖率：75%</li></ul><p>请查看附件中的详细报告。</p><p>谢谢！</p>', 0, true, true),
  createMail('mail-2', contacts[4], '需求评审会议邀请', '<p>Hi all,</p><p>诚邀大家参加明天下午3点的需求评审会议。</p><p>会议议程：</p><ol><li>新功能需求讨论</li><li>技术方案评审</li><li>时间排期确认</li></ol><p>请提前准备相关材料。</p>', 0, true),
  createMail('mail-3', contacts[6], '[GitHub] 你有新的代码审查请求', '<p>Hello,</p><p>@user 请求你审查 Pull Request #123：</p><p><strong>feat: 添加用户认证模块</strong></p><p>请在方便时查看。</p>', 0, false),
  createMail('mail-4', contacts[5], '关于2026年度假期安排的通知', '<p>各位同事：</p><p>现将2026年度假期安排通知如下，请大家知悉：</p><p>春节：2月16日至2月23日，共8天</p><p>劳动节：5月1日至5月5日，共5天</p><p>国庆节：10月1日至10月7日，共7天</p>', 1, false),
  createMail('mail-5', contacts[3], 'API v2.0 发布公告', '<p>亲爱的开发者：</p><p>我们很高兴地宣布 API v2.0 正式发布！</p><p>主要更新：</p><ul><li>性能提升50%</li><li>新增GraphQL支持</li><li>改进的错误处理</li></ul>', 4, false),
  createMail('mail-6', contacts[7], '您的阿里云服务器即将到期', '<p>尊敬的用户：</p><p>您的云服务器 ECS (i-abc123) 将在 2026-04-15 到期。</p><p>为避免影响业务，请及时续费。</p>', 5, false),
  createMail('mail-7', contacts[1], 'Re: 上周讨论的技术方案', '<p>Hi，</p><p>关于上周我们讨论的那个技术方案，我整理了一些补充想法：</p><p>1. 关于缓存策略，建议使用 Redis</p><p>2. 数据库分表可以按用户ID hash</p><p>3. 消息队列考虑 Kafka</p>', 14, false),
  createMail('mail-8', contacts[2], '团队聚餐 - 本周五晚', '<p>各位小伙伴，</p><p>本周五晚上一起聚餐吧！</p><p>地点：XX餐厅</p><p>时间：18:30</p><p>请大家准时参加~</p>', 21, false)
]

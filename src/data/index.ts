import { mockMails } from './mails.mock'
import { mockAccounts } from './accounts.mock'
import { mockTemplates } from './templates.mock'
import { mockKnowledge } from './knowledge.mock'
import { mockChatSessions } from './chat-sessions.mock'

export { mockMails } from './mails.mock'
export { mockAccounts } from './accounts.mock'
export { mockTemplates } from './templates.mock'
export { mockKnowledge } from './knowledge.mock'
export { mockChatSessions } from './chat-sessions.mock'

export function getMockData() {
  return {
    mails: mockMails,
    accounts: mockAccounts,
    templates: mockTemplates,
    knowledge: mockKnowledge,
    chatSessions: mockChatSessions
  }
}

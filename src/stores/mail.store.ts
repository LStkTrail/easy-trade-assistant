import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Mail, MailFolder } from '@/types'
import { MailFolder as MailFolderEnum, MailStatus as MailStatusEnum } from '@/types'
// import { mailService } from '@/services'
import { mockMails } from '@/data/mails.mock'

export const useMailStore = defineStore('mail', () => {
  const mails = ref<Map<string, Mail>>(new Map())
  const selectedMailId = ref<string | null>(null)
  const activeFolder = ref<MailFolder>(MailFolderEnum.INBOX)
  const isLoading = ref(false)
  const hasMore = ref(true)
  // const currentOffset = ref(0)
  const mockDataLoaded = ref(false)

  const folderMails = computed(() => {
    return Array.from(mails.value.values())
      .filter(mail => mail.folder === activeFolder.value)
      .sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime())
  })

  const selectedMail = computed(() => {
    return selectedMailId.value ? mails.value.get(selectedMailId.value) : null
  })

  const unreadCount = computed(() => {
    return Array.from(mails.value.values()).filter(
      m => m.folder === MailFolderEnum.INBOX && m.status === MailStatusEnum.UNREAD
    ).length
  })

  function loadMockMails() {
    if (!mockDataLoaded.value) {
      mockMails.forEach(mail => {
        mails.value.set(mail.id, mail)
      })
      mockDataLoaded.value = true
    }
  }

  async function fetchMails(folder: MailFolder, _reset = false) {
    // 始终加载 mock 数据
    loadMockMails()
    activeFolder.value = folder
    selectedMailId.value = null
  }

  function selectMail(mailId: string) {
    selectedMailId.value = mailId
    const mail = mails.value.get(mailId)
    if (mail && mail.status === MailStatusEnum.UNREAD) {
      mail.status = MailStatusEnum.READ
    }
  }

  function setActiveFolder(folder: MailFolder) {
    activeFolder.value = folder
    selectedMailId.value = null
  }

  function toggleStar(mailId: string) {
    const mail = mails.value.get(mailId)
    if (mail) {
      mail.isStarred = !mail.isStarred
    }
  }

  function addMockMail(mail: Mail) {
    mails.value.set(mail.id, mail)
  }

  return {
    mails,
    selectedMailId,
    activeFolder,
    isLoading,
    hasMore,
    folderMails,
    selectedMail,
    unreadCount,
    fetchMails,
    selectMail,
    setActiveFolder,
    toggleStar,
    addMockMail,
    loadMockMails
  }
})

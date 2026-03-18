<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useMailStore } from '@/stores'
import { useTimeGrouping } from './composables/useTimeGrouping'
import MailSearch from './components/MailSearch.vue'
import TimeGroup from './components/TimeGroup.vue'
import Icon from '@/components/common/Icon.vue'
import Button from '@/components/common/Button.vue'

const mailStore = useMailStore()

const { timeGroups } = useTimeGrouping(mailStore.folderMails)

const searchQuery = computed({
  get: () => '',
  set: () => {}
})

function selectMail(mailId: string) {
  mailStore.selectMail(mailId)
}

function toggleStar(mailId: string) {
  mailStore.toggleStar(mailId)
}

// 文件夹名称映射
const folderLabels: Record<string, string> = {
  inbox: '收件箱',
  sent: '发件箱',
  drafts: '草稿箱',
  starred: '星标邮件',
  trash: '垃圾箱'
}

onMounted(() => {
  mailStore.fetchMails(mailStore.activeFolder, true)
})
</script>

<template>
  <div class="mail-list-pane">
    <div class="mail-list-header">
      <h2 class="mail-list-title">{{ folderLabels[mailStore.activeFolder] || '邮件' }}</h2>
      <div class="mail-list-actions">
        <Button variant="ghost" size="sm">
          <Icon name="pen" :size="16" />
        </Button>
      </div>
    </div>

    <div class="mail-list-search">
      <MailSearch v-model="searchQuery" />
    </div>

    <div class="mail-list-scroll">
      <div v-if="mailStore.isLoading" class="mail-list-loading">
        加载中...
      </div>
      <template v-else-if="timeGroups.length > 0">
        <TimeGroup
          v-for="group in timeGroups"
          :key="group.key"
          :group="group"
          :selected-mail-id="mailStore.selectedMailId"
          @select-mail="selectMail"
          @toggle-star="toggleStar"
        />
      </template>
      <div v-else class="mail-list-empty">
        暂无邮件
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mail-list-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-bg);
  border-right: 1px solid var(--color-border);
}

.mail-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 8px;
  border-bottom: 1px solid var(--color-border);
}

.mail-list-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
}

.mail-list-actions {
  display: flex;
  gap: 4px;
}

.mail-list-search {
  padding: 10px 12px;
  border-bottom: 1px solid var(--color-border);
}

.mail-list-scroll {
  flex: 1;
  overflow-y: auto;
}

.mail-list-loading,
.mail-list-empty {
  padding: 40px 20px;
  text-align: center;
  color: var(--color-text-tertiary);
}
</style>

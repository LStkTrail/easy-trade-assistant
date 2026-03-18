<script setup lang="ts">
import { computed } from 'vue'
import { useMailStore, useAIStore } from '@/stores'
import MailHeader from './components/MailHeader.vue'
import MailActions from './components/MailActions.vue'
import MailBody from './components/MailBody.vue'
import AIActionBar from './components/AIActionBar.vue'
import Icon from '@/components/common/Icon.vue'

const mailStore = useMailStore()
const aiStore = useAIStore()

const selectedMail = computed(() => mailStore.selectedMail)

function handleSummarize() {
  if (selectedMail.value) {
    if (!aiStore.isPanelVisible) aiStore.togglePanel()
    aiStore.summarizeMail(selectedMail.value.id)
  }
}

function handleGenerateReply() {
  if (selectedMail.value) {
    if (!aiStore.isPanelVisible) aiStore.togglePanel()
    aiStore.generateReply(selectedMail.value.id)
  }
}

function handleTranslate() {
  if (selectedMail.value) {
    if (!aiStore.isPanelVisible) aiStore.togglePanel()
    aiStore.sendMessage('请将这封邮件翻译成中文', selectedMail.value.id)
  }
}

function handleAskAI() {
  if (selectedMail.value) {
    if (!aiStore.isPanelVisible) aiStore.togglePanel()
    if (!aiStore.currentSession || aiStore.currentSession.currentMailId !== selectedMail.value.id) {
      aiStore.createSession(selectedMail.value.id)
    }
  }
}
</script>

<template>
  <div class="mail-detail-pane">
    <template v-if="selectedMail">
      <MailHeader :mail="selectedMail" />
      <MailActions />
      <div class="mail-detail-scroll">
        <MailBody :mail="selectedMail" />
        <AIActionBar
          :mail-id="selectedMail.id"
          @summarize="handleSummarize"
          @generate-reply="handleGenerateReply"
          @translate="handleTranslate"
          @ask-ai="handleAskAI"
        />
      </div>
    </template>
    <div v-else class="mail-detail-empty">
      <Icon name="inbox" :size="64" />
      <p>选择一封邮件查看详情</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mail-detail-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-bg);
}

.mail-detail-scroll {
  flex: 1;
  overflow-y: auto;
}

.mail-detail-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--color-text-tertiary);

  .icon {
    opacity: 0.4;
  }
}
</style>

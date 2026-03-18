<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import { useAIStore, useMailStore } from '@/stores'
import ChatMessage from './components/ChatMessage.vue'
import QuickPrompts from './components/QuickPrompts.vue'
import ChatInput from './components/ChatInput.vue'
import Icon from '@/components/common/Icon.vue'
import Button from '@/components/common/Button.vue'

const aiStore = useAIStore()
const mailStore = useMailStore()

const scrollContainer = ref<HTMLElement | null>(null)

function scrollToBottom() {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
  })
}

watch(() => aiStore.messages, () => {
  scrollToBottom()
}, { deep: true })

function handleSend(message: string) {
  aiStore.sendMessage(message, mailStore.selectedMailId || undefined)
}

function handleQuickPrompt(prompt: string) {
  aiStore.sendMessage(prompt, mailStore.selectedMailId || undefined)
}

onMounted(() => {
  if (!aiStore.currentSession) {
    aiStore.createSession()
  }
})
</script>

<template>
  <div class="ai-assistant-pane">
    <div class="ai-header">
      <div class="ai-header-left">
        <Icon name="ai" :size="22" />
        <span class="ai-title">AI 助手</span>
      </div>
      <Button variant="ghost" size="sm" @click="aiStore.togglePanel">
        <Icon name="close" :size="18" />
      </Button>
    </div>

    <div ref="scrollContainer" class="ai-messages">
      <div v-if="aiStore.messages.length === 0" class="ai-welcome">
        <div class="ai-welcome-icon">
          <Icon name="sparkles" :size="40" />
        </div>
        <p class="ai-welcome-text">
          我是您的AI邮件助手，有什么可以帮您的？
        </p>
      </div>
      <ChatMessage
        v-for="msg in aiStore.messages"
        :key="msg.id"
        :message="msg"
      />
    </div>

    <QuickPrompts @select="handleQuickPrompt" />
    <ChatInput @send="handleSend" />
  </div>
</template>

<style scoped lang="scss">
.ai-assistant-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-bg);
  border-left: 1px solid var(--color-border);
}

.ai-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}

.ai-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.ai-messages {
  flex: 1;
  overflow-y: auto;
  background: linear-gradient(to bottom, var(--color-bg-secondary) 0%, var(--color-bg) 40px);
}

.ai-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  gap: 16px;
}

.ai-welcome-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary-light), rgba(91, 127, 255, 0.2));
  color: var(--color-primary);
}

.ai-welcome-text {
  text-align: center;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}
</style>

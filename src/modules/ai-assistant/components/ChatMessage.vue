<script setup lang="ts">
import { computed } from 'vue'
import { dayjs } from '@/utils/date'
import { ChatRole } from '@/types'
import type { ChatMessage as ChatMessageType } from '@/types'
import Icon from '@/components/common/Icon.vue'

interface Props {
  message: ChatMessageType
}

const props = defineProps<Props>()

const isUser = computed(() => props.message.role === ChatRole.USER)
</script>

<template>
  <div class="chat-message" :class="{ 'is-user': isUser }">
    <div class="chat-avatar">
      <Icon v-if="!isUser" name="ai" :size="20" />
    </div>
    <div class="chat-content-wrapper">
      <div class="chat-bubble" :class="{ 'is-loading': message.isLoading }">
        <template v-if="message.isLoading">
          <span class="typing-indicator">
            <span />
            <span />
            <span />
          </span>
        </template>
        <div v-else class="chat-text">{{ message.content }}</div>
      </div>
      <div class="chat-time">
        {{ dayjs(message.timestamp).format('HH:mm') }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-message {
  display: flex;
  gap: 10px;
  padding: 10px 16px;

  &.is-user {
    flex-direction: row-reverse;

    .chat-bubble {
      background-color: var(--color-primary);
      color: white;
    }

    .chat-avatar {
      background-color: var(--color-bg-secondary);
    }
  }
}

.chat-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  flex-shrink: 0;
}

.chat-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 80%;
}

.chat-bubble {
  padding: 10px 14px;
  border-radius: var(--radius-lg);
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
  line-height: 1.5;
  word-wrap: break-word;
  word-break: break-word;
}

.chat-text {
  white-space: pre-wrap;
}

.chat-time {
  font-size: 11px;
  color: var(--color-text-tertiary);
  padding: 0 4px;
}

// 打字动画
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 2px 0;

  span {
    width: 6px;
    height: 6px;
    border-radius: var(--radius-full);
    background-color: var(--color-text-tertiary);
    animation: typing 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

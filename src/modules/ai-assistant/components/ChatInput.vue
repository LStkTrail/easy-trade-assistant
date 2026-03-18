<script setup lang="ts">
import { ref } from 'vue'
import Icon from '@/components/common/Icon.vue'
import Button from '@/components/common/Button.vue'

const input = ref('')

const emit = defineEmits<{
  send: [message: string]
}>()

function handleSend() {
  if (input.value.trim()) {
    emit('send', input.value.trim())
    input.value = ''
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="chat-input">
    <div class="chat-input-wrapper">
      <textarea
        v-model="input"
        class="chat-textarea"
        placeholder="输入消息..."
        rows="1"
        @keydown="handleKeydown"
      />
      <Button variant="primary" size="sm" :disabled="!input.trim()" @click="handleSend">
        <Icon name="send" :size="16" />
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-input {
  padding: 12px;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-bg);
}

.chat-input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px 12px;
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.chat-textarea {
  flex: 1;
  min-height: 20px;
  max-height: 120px;
  border: none;
  background: none;
  color: var(--color-text);
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;

  &::placeholder {
    color: var(--color-text-tertiary);
  }
}
</style>

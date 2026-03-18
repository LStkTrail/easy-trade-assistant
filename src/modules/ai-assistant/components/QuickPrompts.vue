<script setup lang="ts">
const prompts = [
  { label: '总结邮件', prompt: '请总结这封邮件的要点' },
  { label: '写回复', prompt: '帮我写一封合适的回复' },
  { label: '提取待办', prompt: '从邮件中提取待办事项' },
  { label: '解释', prompt: '用简单的话解释这封邮件' }
]

defineEmits<{
  select: [prompt: string]
}>()
</script>

<template>
  <div class="quick-prompts">
    <button
      v-for="prompt in prompts"
      :key="prompt.prompt"
      class="quick-prompt-btn"
      @click="$emit('select', prompt.prompt)"
    >
      {{ prompt.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.quick-prompts {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  overflow-x: auto;
  border-top: 1px solid var(--color-border);
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
}

.quick-prompt-btn {
  flex-shrink: 0;
  padding: 6px 12px;
  font-size: 12px;
  color: var(--color-primary);
  background-color: var(--color-primary-light);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background-color: rgba(91, 127, 255, 0.2);
    border-color: var(--color-primary);
  }
}
</style>

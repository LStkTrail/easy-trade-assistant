<script setup lang="ts">
import Icon from '@/components/common/Icon.vue'
import Button from '@/components/common/Button.vue'

interface Props {
  mailId?: string
}

defineProps<Props>()

defineEmits<{
  summarize: []
  generateReply: []
  translate: []
  extractTasks: []
  askAI: []
}>()
</script>

<template>
  <div class="ai-action-bar">
    <div class="ai-action-bar-label">
      <Icon name="ai" :size="18" />
      <span>AI 助手</span>
    </div>
    <div class="ai-action-bar-buttons">
      <Button variant="ghost" size="sm" @click="$emit('summarize')">
        <Icon name="list" :size="16" />
        总结
      </Button>
      <Button variant="ghost" size="sm" @click="$emit('generateReply')">
        <Icon name="sparkles" :size="16" />
        写回复
      </Button>
      <Button variant="ghost" size="sm" @click="$emit('translate')">
        <Icon name="translate" :size="16" />
        翻译
      </Button>
      <Button variant="primary" size="sm" @click="$emit('askAI')">
        <Icon name="ai" :size="16" />
        Ask AI
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ai-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  margin: 16px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-primary-light) 0%, rgba(91, 127, 255, 0.08) 100%);
  border: 1px solid var(--color-border);
}

.ai-action-bar-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
}

.ai-action-bar-buttons {
  display: flex;
  gap: 4px;
}
</style>

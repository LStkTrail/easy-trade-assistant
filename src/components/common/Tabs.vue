<script setup lang="ts">
import Icon from './Icon.vue'

interface Props {
  modelValue?: string
  tabs: Array<{ id: string; label: string; icon?: string }>
}

withDefaults(defineProps<Props>(), {
  modelValue: ''
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="tab-item"
      :class="{ active: modelValue === tab.id }"
      @click="emit('update:modelValue', tab.id)"
    >
      <Icon v-if="tab.icon" :name="tab.icon" :size="18" />
      <span>{{ tab.label }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.tabs {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: none;
  background: none;
  color: var(--color-text-secondary);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);

  &:hover {
    background-color: var(--color-bg-secondary);
    color: var(--color-text);
  }

  &.active {
    background-color: var(--color-primary-light);
    color: var(--color-primary);
    font-weight: 500;
  }
}
</style>

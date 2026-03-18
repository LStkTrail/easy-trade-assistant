<script setup lang="ts">
import Icon from '@/components/common/Icon.vue'

interface Props {
  icon: string
  label?: string
  active?: boolean
  badge?: number
}

withDefaults(defineProps<Props>(), {
  active: false
})

defineEmits(['click'])
</script>

<template>
  <button class="nav-item" :class="{ active }" @click="$emit('click')">
    <Icon :name="icon" :size="22" />
    <span v-if="badge" class="nav-badge">{{ badge > 99 ? '99+' : badge }}</span>
  </button>
</template>

<style scoped lang="scss">
.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  border: none;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    color: var(--color-text);
    background-color: var(--color-bg-tertiary);
  }

  &.active {
    color: var(--color-primary);
    background-color: var(--color-primary-light);
  }
}

.nav-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: white;
  text-align: center;
}
</style>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  size: 'md'
})

defineEmits(['click'])
</script>

<template>
  <button
    class="btn"
    :class="['btn-' + variant, 'btn-' + size]"
    @click="$emit('click', $event)"
  >
    <span v-if="icon" class="btn-icon">{{ icon }}</span>
    <slot />
  </button>
</template>

<style scoped lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  user-select: none;

  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-sm {
  height: 28px;
  padding: 0 10px;
  font-size: 13px;
}

.btn-md {
  height: 36px;
  padding: 0 14px;
}

.btn-lg {
  height: 44px;
  padding: 0 18px;
  font-size: 15px;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;

  &:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
}

.btn-secondary {
  background-color: var(--color-bg-secondary);
  color: var(--color-text);

  &:hover:not(:disabled) {
    background-color: var(--color-bg-tertiary);
  }
}

.btn-ghost {
  background-color: transparent;
  color: var(--color-text);

  &:hover:not(:disabled) {
    background-color: var(--color-bg-secondary);
  }
}

.btn-danger {
  background-color: var(--color-error);
  color: white;

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }
}

.btn-icon {
  font-size: 16px;
  display: flex;
  align-items: center;
}
</style>

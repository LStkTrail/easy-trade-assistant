<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

withDefaults(defineProps<Props>(), {
  variant: 'default'
})
</script>

<template>
  <span class="badge" :class="'badge-' + variant">
    <slot />
  </span>
</template>

<style scoped lang="scss">
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 11px;
  font-weight: 600;
  border-radius: var(--radius-full);
}

.badge-default {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}

.badge-primary {
  background-color: var(--color-primary);
  color: white;
}

.badge-success {
  background-color: var(--color-success);
  color: white;
}

.badge-warning {
  background-color: var(--color-warning);
  color: #5d4e00;
}

.badge-danger {
  background-color: var(--color-error);
  color: white;
}
</style>

<script setup lang="ts">
interface Props {
  modelValue?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <button
    class="switch"
    :class="{ 'is-on': modelValue, 'is-disabled': disabled }"
    :disabled="disabled"
    @click="!disabled && emit('update:modelValue', !modelValue)"
  >
    <span class="switch-handle" />
  </button>
</template>

<style scoped lang="scss">
.switch {
  position: relative;
  width: 44px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  background-color: var(--color-bg-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover:not(.is-disabled) {
    background-color: var(--color-border-hover);
  }

  &.is-on {
    background-color: var(--color-primary);
  }

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.switch-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  background-color: white;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);

  .is-on & {
    transform: translateX(20px);
  }
}
</style>

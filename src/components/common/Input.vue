<script setup lang="ts">
interface Props {
  modelValue?: string
  placeholder?: string
  type?: 'text' | 'search' | 'email' | 'password'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  size: 'md',
  disabled: false
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    class="input"
    :class="'input-' + size"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<style scoped lang="scss">
.input {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg);
  color: var(--color-text);
  font-size: 14px;
  transition: all var(--transition-fast);

  &::placeholder {
    color: var(--color-text-tertiary);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.input-sm {
  height: 32px;
  padding: 0 10px;
  font-size: 13px;
}

.input-md {
  height: 40px;
  padding: 0 12px;
}

.input-lg {
  height: 48px;
  padding: 0 14px;
  font-size: 15px;
}
</style>

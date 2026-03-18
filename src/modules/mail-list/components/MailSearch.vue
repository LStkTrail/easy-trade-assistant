<script setup lang="ts">
import Icon from '@/components/common/Icon.vue'
import Input from '@/components/common/Input.vue'

interface Props {
  modelValue?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: ''
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="mail-search">
    <Icon name="search" :size="18" />
    <Input
      :model-value="modelValue"
      placeholder="搜索邮件"
      size="sm"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
.mail-search {
  position: relative;
  display: flex;
  align-items: center;

  .icon {
    position: absolute;
    left: 10px;
    color: var(--color-text-tertiary);
    pointer-events: none;
    z-index: 1;
  }

  .input {
    padding-left: 34px;
  }
}
</style>

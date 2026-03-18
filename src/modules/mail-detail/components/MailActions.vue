<script setup lang="ts">
import Icon from '@/components/common/Icon.vue'
import Button from '@/components/common/Button.vue'

defineEmits(['reply', 'replyAll', 'forward', 'delete'])
</script>

<template>
  <div class="mail-actions">
    <div class="mail-actions-left">
      <Button variant="secondary" size="sm" @click="$emit('reply')">
        <Icon name="reply" :size="16" />
        回复
      </Button>
      <Button variant="ghost" size="sm" @click="$emit('replyAll')">
        <Icon name="replyAll" :size="16" />
      </Button>
      <Button variant="ghost" size="sm" @click="$emit('forward')">
        <Icon name="forward" :size="16" />
      </Button>
    </div>
    <div class="mail-actions-right">
      <Button variant="ghost" size="sm" @click="$emit('delete')">
        <Icon name="trash" :size="16" />
      </Button>
      <Button variant="ghost" size="sm">
        <Icon name="more" :size="16" />
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mail-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 12px;
  border-bottom: 1px solid var(--color-border);
}

.mail-actions-left,
.mail-actions-right {
  display: flex;
  gap: 4px;
}
</style>

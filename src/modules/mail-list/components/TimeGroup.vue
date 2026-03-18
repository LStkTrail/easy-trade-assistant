<script setup lang="ts">
import type { TimeGroup as TimeGroupType } from '@/types'
import MailItem from './MailItem.vue'

interface Props {
  group: TimeGroupType
  selectedMailId: string | null
}

defineProps<Props>()

const emit = defineEmits<{
  selectMail: [mailId: string]
  toggleStar: [mailId: string]
}>()
</script>

<template>
  <div class="time-group">
    <div class="time-group-header">{{ group.label }}</div>
    <div class="time-group-mails">
      <MailItem
        v-for="mail in group.mails"
        :key="mail.id"
        :mail="mail"
        :selected="selectedMailId === mail.id"
        @click="emit('selectMail', mail.id)"
        @star="emit('toggleStar', mail.id)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.time-group {
  display: flex;
  flex-direction: column;
}

.time-group-header {
  padding: 10px 12px 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  background-color: var(--color-bg);
  z-index: 1;
}

.time-group-mails {
  display: flex;
  flex-direction: column;
}
</style>

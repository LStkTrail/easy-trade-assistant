<script setup lang="ts">
import Avatar from '@/components/common/Avatar.vue'
import { dayjs } from '@/utils/date'
import type { Mail } from '@/types'

interface Props {
  mail: Mail
}

defineProps<Props>()
</script>

<template>
  <div class="mail-header">
    <Avatar :name="mail.from.name" :email="mail.from.email" :size="44" />
    <div class="mail-header-info">
      <div class="mail-header-top">
        <span class="mail-from-name">{{ mail.from.name }}</span>
        <span class="mail-from-email">&lt;{{ mail.from.email }}&gt;</span>
      </div>
      <div class="mail-header-bottom">
        <span class="mail-to">
          收件人: {{ mail.to.map(t => t.name).join(', ') }}
        </span>
        <span class="mail-date">{{ dayjs(mail.receivedAt).format('YYYY年M月D日 HH:mm') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mail-header {
  display: flex;
  gap: 14px;
  padding: 16px 20px;
}

.mail-header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mail-header-top {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.mail-from-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.mail-from-email {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.mail-header-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.mail-to {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.mail-date {
  font-size: 13px;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}
</style>

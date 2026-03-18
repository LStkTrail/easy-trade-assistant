<script setup lang="ts">
import type { Mail } from '@/types'

interface Props {
  mail: Mail
}

defineProps<Props>()
</script>

<template>
  <div class="mail-body">
    <h1 class="mail-subject">{{ mail.subject }}</h1>
    <div class="mail-content" v-html="mail.body" />
  </div>
</template>

<style scoped lang="scss">
.mail-body {
  padding: 20px;
}

.mail-subject {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 16px;
  line-height: 1.4;
}

.mail-content {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text);

  :deep(p) {
    margin-bottom: 12px;
  }

  :deep(a) {
    color: var(--color-primary);
  }
}
</style>

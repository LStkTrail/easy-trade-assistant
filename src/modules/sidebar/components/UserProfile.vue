<script setup lang="ts">
import { useSettingsStore } from '@/stores'
import Avatar from '@/components/common/Avatar.vue'

interface Props {
  name?: string
  email?: string
  avatar?: string
}

withDefaults(defineProps<Props>(), {
  name: '用户',
  email: 'user@example.com'
})

const settingsStore = useSettingsStore()

function openSettings() {
  settingsStore.openModal('accounts')
}
</script>

<template>
  <div class="user-profile" @click="openSettings">
    <Avatar :name="name" :email="email" :src="avatar" :size="36" />
  </div>
</template>

<style scoped lang="scss">
.user-profile {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  cursor: pointer;
  transition: all var(--transition-fast);
  border-radius: var(--radius-md);

  &:hover {
    background-color: var(--color-bg-tertiary);
  }
}
</style>

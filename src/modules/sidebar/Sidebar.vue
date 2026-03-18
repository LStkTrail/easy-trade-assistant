<script setup lang="ts">
import { useMailStore } from '@/stores'
import { MailFolder } from '@/types'
import UserProfile from './components/UserProfile.vue'
import NavItem from './components/NavItem.vue'

const mailStore = useMailStore()

const navItems = [
  { folder: MailFolder.INBOX, icon: 'inbox', label: '收件箱' },
  { folder: MailFolder.SENT, icon: 'sent', label: '发件箱' },
  { folder: MailFolder.DRAFTS, icon: 'drafts', label: '草稿箱' },
  { folder: MailFolder.STARRED, icon: 'star', label: '星标' },
  { folder: MailFolder.TRASH, icon: 'trash', label: '垃圾箱' }
]

function selectFolder(folder: MailFolder) {
  mailStore.setActiveFolder(folder)
}
</script>

<template>
  <div class="sidebar">
    <UserProfile />

    <div class="nav-list">
      <NavItem
        v-for="item in navItems"
        :key="item.folder"
        :icon="item.icon"
        :active="mailStore.activeFolder === item.folder"
        :badge="item.folder === MailFolder.INBOX ? mailStore.unreadCount : 0"
        @click="selectFolder(item.folder)"
      />
    </div>

    <div class="sidebar-footer">
      <NavItem icon="settings" @click="() => {}" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px 0;
}

.nav-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0;
}

.sidebar-footer {
  padding-top: 8px;
  border-top: 1px solid var(--color-border);
}
</style>

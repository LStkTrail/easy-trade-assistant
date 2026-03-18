<script setup lang="ts">
import { onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import SettingsOverlay from '@/modules/settings/SettingsOverlay.vue'
import { useSettingsStore, useAIStore } from '@/stores'
import type { EmailAccount, EmailTemplate, KnowledgeTerm, ChatSession } from '@/types'
import { mockAccounts, mockTemplates, mockKnowledge, mockChatSessions } from '@/data'

const settingsStore = useSettingsStore()
const aiStore = useAIStore()

onMounted(() => {
  // 直接加载 mock 数据
  mockAccounts.forEach((acc: EmailAccount) => settingsStore.addAccount(acc))
  mockTemplates.forEach((tpl: EmailTemplate) => settingsStore.addTemplate(tpl))
  mockKnowledge.forEach((term: KnowledgeTerm) => settingsStore.addKnowledgeTerm(term))
  mockChatSessions.forEach((session: ChatSession) => {
    aiStore.sessions.push(session)
  })
  if (mockChatSessions.length > 0) {
    aiStore.currentSessionId = mockChatSessions[0].id
  }
})
</script>

<template>
  <MainLayout />
  <SettingsOverlay />
</template>

<style>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/reset.scss';
</style>

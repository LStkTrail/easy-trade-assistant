<script setup lang="ts">
import { useUIStore, useAIStore } from '@/stores'
import ResizablePane from '@/components/layout/ResizablePane.vue'
import Sidebar from '@/modules/sidebar/Sidebar.vue'
import MailListPane from '@/modules/mail-list/MailListPane.vue'
import MailDetailPane from '@/modules/mail-detail/MailDetailPane.vue'
import AIAssistantPane from '@/modules/ai-assistant/AIAssistantPane.vue'
import Icon from '@/components/common/Icon.vue'

const uiStore = useUIStore()
const aiStore = useAIStore()
</script>

<template>
  <div class="main-layout">
    <div class="sidebar-wrapper" :style="{ width: uiStore.sidebarWidth + 'px' }">
      <Sidebar />
    </div>

    <ResizablePane
      v-model:width="uiStore.mailListWidth"
      :min-width="240"
      :max-width="500"
      position="left"
    >
      <MailListPane />
    </ResizablePane>

    <div class="mail-detail-wrapper">
      <MailDetailPane />
    </div>

    <Transition name="panel-slide">
      <ResizablePane
        v-if="aiStore.isPanelVisible"
        v-model:width="uiStore.aiPanelWidth"
        :min-width="280"
        :max-width="500"
        position="right"
      >
        <AIAssistantPane />
      </ResizablePane>
    </Transition>

    <!-- AI 面板展开按钮（当面板隐藏时显示） -->
    <Transition name="toggle-btn">
      <button v-if="!aiStore.isPanelVisible" key="toggle-btn" class="ai-toggle-btn" @click="aiStore.togglePanel">
        <Icon name="ai" :size="22" />
      </button>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.main-layout {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--color-bg);
  position: relative;
}

.sidebar-wrapper {
  flex-shrink: 0;
  height: 100%;
  border-right: 1px solid var(--color-border);
  background-color: var(--color-bg-secondary);
}

.mail-detail-wrapper {
  flex: 1;
  min-width: 0;
  height: 100%;
  border-right: 1px solid var(--color-border);
  background-color: var(--color-bg);
}

.ai-toggle-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 80px;
  border: none;
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
  background: linear-gradient(to left, var(--color-primary-light), rgba(91, 127, 255, 0.2));
  color: var(--color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-md);
  z-index: 50;

  &:hover {
    width: 56px;
    background: linear-gradient(to left, var(--color-primary-light), rgba(91, 127, 255, 0.4));
  }
}

/* AI 面板过渡动画 */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  width: 0 !important;
  opacity: 0;
  margin-left: 0;
  margin-right: 0;
}

/* 切换按钮过渡动画 */
.toggle-btn-enter-active,
.toggle-btn-leave-active {
  transition: all 0.2s ease;
}

.toggle-btn-enter-from,
.toggle-btn-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(20px);
}
</style>

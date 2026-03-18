<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import Icon from './Icon.vue'

interface Props {
  modelValue?: boolean
  title?: string
  closable?: boolean
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  closable: true,
  width: '720px'
})

const emit = defineEmits(['update:modelValue', 'close'])

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function handleOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
    close()
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  }
}

watch(() => props.modelValue, (val) => {
  if (val) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal" :style="{ maxWidth: width }">
          <div class="modal-header">
            <slot name="header">
              <h2 v-if="title" class="modal-title">{{ title }}</h2>
            </slot>
            <button v-if="closable" class="modal-close" @click="close">
              <Icon name="close" :size="20" />
            </button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  padding: 20px;
  overflow: auto;
}

.modal {
  position: relative;
  width: 100%;
  max-height: calc(100vh - 40px);
  background-color: var(--color-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);

  &:hover {
    background-color: var(--color-bg-secondary);
    color: var(--color-text);
  }
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 200ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal {
    transform: scale(0.95);
  }
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;

  .modal {
    transform: scale(1);
  }
}
</style>

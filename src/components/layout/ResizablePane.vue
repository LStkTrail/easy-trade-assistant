<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

interface Props {
  width: number
  minWidth?: number
  maxWidth?: number
  resizable?: boolean
  position?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  minWidth: 200,
  maxWidth: 600,
  resizable: true,
  position: 'left'
})

const emit = defineEmits(['update:width'])

const isDragging = ref(false)
const startX = ref(0)
const startWidth = ref(0)

function startResize(e: MouseEvent) {
  if (!props.resizable) return
  isDragging.value = true
  startX.value = e.clientX
  startWidth.value = props.width
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = props.position === 'left' ? 'ew-resize' : 'ew-resize'
  document.body.style.userSelect = 'none'
}

function onResize(e: MouseEvent) {
  if (!isDragging.value) return
  const diff = e.clientX - startX.value
  let newWidth = props.position === 'left'
    ? startWidth.value + diff
    : startWidth.value - diff
  newWidth = Math.max(props.minWidth, Math.min(props.maxWidth, newWidth))
  emit('update:width', newWidth)
}

function stopResize() {
  isDragging.value = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<template>
  <div class="resizable-pane" :style="{ width: width + 'px' }">
    <slot />
    <div
      v-if="resizable"
      class="resize-handle"
      :class="['resize-' + position, { 'is-dragging': isDragging }]"
      @mousedown="startResize"
    />
  </div>
</template>

<style scoped lang="scss">
.resizable-pane {
  position: relative;
  height: 100%;
  flex-shrink: 0;
  overflow: hidden;
}

.resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  z-index: 10;
  cursor: ew-resize;
  transition: background-color var(--transition-fast);

  &:hover,
  &.is-dragging {
    background-color: var(--color-primary);
  }
}

.resize-left {
  right: -2px;
}

.resize-right {
  left: -2px;
}
</style>

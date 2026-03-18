<script setup lang="ts">
import { computed } from 'vue'
import { getAvatarColor, getInitials } from '@/utils/email'

interface Props {
  name?: string
  email?: string
  src?: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  email: '',
  size: 40
})

const initials = computed(() => getInitials(props.name || props.email || '?'))
const bgColor = computed(() => getAvatarColor(props.email || props.name || 'default'))
</script>

<template>
  <div
    class="avatar"
    :style="{
      width: size + 'px',
      height: size + 'px',
      fontSize: (size * 0.4) + 'px',
      backgroundColor: src ? 'transparent' : bgColor
    }"
  >
    <img v-if="src" :src="src" :alt="name" class="avatar-img" />
    <span v-else class="avatar-text">{{ initials }}</span>
  </div>
</template>

<style scoped lang="scss">
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  overflow: hidden;
  flex-shrink: 0;
  color: white;
  font-weight: 600;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-text {
  user-select: none;
}
</style>

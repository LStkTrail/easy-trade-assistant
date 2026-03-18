<script setup lang="ts">
import { computed } from 'vue'
import Avatar from '@/components/common/Avatar.vue'
import Icon from '@/components/common/Icon.vue'
import { formatRelativeTime } from '@/utils/date'
import { truncate } from '@/utils/format'
import { MailStatus } from '@/types'
import type { Mail } from '@/types'

interface Props {
  mail: Mail
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false
})

const emit = defineEmits(['click', 'star'])

const isUnread = computed(() => props.mail.status === MailStatus.UNREAD)

function handleStar(e: Event) {
  e.stopPropagation()
  emit('star')
}
</script>

<template>
  <div
    class="mail-item"
    :class="{ 'is-unread': isUnread, 'is-selected': selected }"
    @click="$emit('click')"
  >
    <div class="mail-item-left">
      <div class="mail-status" :class="{ 'is-unread': isUnread }" />
      <button class="mail-star" @click="handleStar">
        <Icon :name="mail.isStarred ? 'starFilled' : 'star'" :size="16" />
      </button>
    </div>

    <div class="mail-item-content">
      <Avatar :name="mail.from.name" :email="mail.from.email" :size="36" />
      <div class="mail-info">
        <div class="mail-header">
          <span class="mail-from" :class="{ 'is-unread': isUnread }">
            {{ mail.from.name }}
          </span>
          <span class="mail-time">{{ formatRelativeTime(mail.receivedAt) }}</span>
        </div>
        <div class="mail-subject" :class="{ 'is-unread': isUnread }">
          {{ mail.subject }}
        </div>
        <div class="mail-snippet">
          {{ truncate(mail.body.replace(/<[^>]*>/g, ''), 60) }}
        </div>
      </div>
    </div>

    <div v-if="mail.attachments.length > 0" class="mail-item-right">
      <Icon name="paperclip" :size="14" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.mail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: var(--color-bg-secondary);
  }

  &.is-selected {
    background-color: var(--color-primary-light);
  }
}

.mail-item-left {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.mail-status {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background-color: transparent;

  &.is-unread {
    background-color: var(--color-unread);
  }
}

.mail-star {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);

  &:hover {
    color: var(--color-warning);
    background-color: var(--color-bg-tertiary);
  }

  .icon {
    color: inherit;
  }
}

.mail-item-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.mail-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.mail-from {
  font-size: 13px;
  color: var(--color-text-secondary);
  white-space: nowrap;

  &.is-unread {
    font-weight: 600;
    color: var(--color-text);
  }
}

.mail-time {
  font-size: 12px;
  color: var(--color-text-tertiary);
  white-space: nowrap;
  flex-shrink: 0;
}

.mail-subject {
  font-size: 13px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.is-unread {
    font-weight: 500;
    color: var(--color-text);
  }
}

.mail-snippet {
  font-size: 12px;
  color: var(--color-text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mail-item-right {
  flex-shrink: 0;
  color: var(--color-text-tertiary);
}
</style>

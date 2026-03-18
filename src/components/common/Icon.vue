<script setup lang="ts">
interface Props {
  name: string
  size?: number | string
  color?: string
}

withDefaults(defineProps<Props>(), {
  size: 20
})

const iconMap: Record<string, string> = {
  inbox: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7.5V16.5A2.25 2.25 0 0 1 17.75 18.75H6.25A2.25 2.25 0 0 1 4 16.5V7.5m16 0A2.25 2.25 0 0 0 17.75 5.25H6.25A2.25 2.25 0 0 0 4 7.5m16 0V9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7.5m8 4.5v4.5" /></svg>',
  sent: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25 12 12.75M12 3.75 7.5 8.25M12 3.75v9m0 0 4.5 4.5M12 12.75 7.5 12.75" /></svg>',
  drafts: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487A1.875 1.875 0 0 1 19.513 7.138L8.25 18.4H5.25V15.388L16.862 4.487Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 19.5H6" /></svg>',
  trash: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6m2 0v13.5A1.5 1.5 0 0 1 15.5 21h-7A1.5 1.5 0 0 1 7 19.5V6" /></svg>',
  star: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 3.516c.417-1.357 2.485-1.357 2.902 0l1.055 3.438a1.53 1.53 0 0 0 1.451 1.056h3.617c1.418 0 2.006 1.817.882 2.784l-2.925 2.553a1.53 1.53 0 0 0-.552 1.7l1.117 3.637c.44 1.432-1.243 2.556-2.479 1.654l-3.089-2.26a1.53 1.53 0 0 0-1.788 0l-3.089 2.26c-1.236.902-2.919-.222-2.479-1.654l1.117-3.637a1.53 1.53 0 0 0-.552-1.7L2.044 10.794c-.844-.967-.536-2.784.882-2.784h3.617c.613 0 1.162-.39 1.451-1.056l1.055-3.438Z" /></svg>',
  starFilled: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.083 5.003c.165.397.568.675 1.008.744l5.396.822c1.163.177 1.632 1.558.788 2.413l-4.143 4.007c-.328.318-.479.779-.401 1.235l1.042 5.687c.225 1.229-1.078 2.191-2.191 1.599l-4.869-2.572c-.444-.235-.986-.235-1.43 0l-4.869 2.572c-1.113.588-2.416-.37-2.191-1.599l1.042-5.687c.078-.456-.073-.917-.401-1.235L2.513 12.195c-.844-.855-.375-2.236.788-2.413l5.396-.822c.44-.069.843-.347 1.008-.744l2.083-5.003Z" /></svg>',
  ai: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 21l3-2.25 3 2.25-.813-5.096M6.75 7.5h10.5M5.25 12h13.5M6.75 16.5h10.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 6.75a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM14.25 6.75a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z" /></svg>',
  sparkles: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 21l3-2.25 3 2.25-.813-5.096a3 3 0 0 0-4.374 0ZM4.575 4.575 3 6.75l1.575 2.175a3 3 0 0 0 4.85 0L11 6.75 9.425 4.575a3 3 0 0 0-4.85 0ZM15 6.75l1.575-2.175a3 3 0 0 1 4.85 0L23 6.75l-1.575 2.175a3 3 0 0 1-4.85 0L15 6.75Z" /></svg>',
  close: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75 3 3m-2.25-4.5a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z" /></svg>',
  settings: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>',
  pen: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487A1.875 1.875 0 0 1 19.513 7.138L8.25 18.4H5.25V15.388L16.862 4.487Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75 12 21" /></svg>',
  translate: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m10.5 21-3-7.5m0 0L6 9m1.5 4.5 3 1.5M6 9 7.5 3m0 0L9 9m-1.5-6h6m1.5 13.5 1.5-4.5m0 0L16.5 9m-1.5 3 1.5 1.5m-1.5-1.5L18 9m-1.5-6L18 9m0 0 1.5 4.5M21 21l-3-7.5m0 0L16.5 9m3 4.5-3 1.5" /></svg>',
  list: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6h12M9 12h12M9 18h12" /></svg>',
  reply: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 5 11m0 0 4-4M5 11h10.5a4.5 4.5 0 0 1 4.5 4.5v.75" /></svg>',
  replyAll: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 16.5 3 12m0 0 4.5-4.5M3 12h6m4.5 4.5L18 12m0 0-4.5-4.5M18 12h-6" /></svg>',
  forward: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 8.25 19.5 12m0 0-4.5 3.75M19.5 12H9A4.5 4.5 0 0 0 4.5 16.5V18" /></svg>',
  more: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h.01M12 12h.01M19 12h.01" /></svg>',
  send: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5 19.5 12 4.5 4.5 4.5 9l9 3-9 3 0 4.5Z" /></svg>',
  paperclip: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739 10.5 20.614a4.5 4.5 0 0 1-6.364-6.364l8.625-8.625a3 3 0 0 1 4.243 4.243l-7.5 7.5a1.5 1.5 0 1 1-2.121-2.121l6.364-6.364" /></svg>',
  chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 18 9 12l6-6" /></svg>',
  chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6" /></svg>',
  menu: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>',
  folder: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12V6.75A2.25 2.25 0 0 1 4.5 4.5h5.25a.75.75 0 0 1 .53.22l2.25 2.25a.75.75 0 0 0 .53.22H19.5a2.25 2.25 0 0 1 2.25 2.25v1.5M2.25 12v5.25A2.25 2.25 0 0 0 4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V12M2.25 12h19.5" /></svg>',
  plus: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>',
  edit: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487A1.875 1.875 0 0 1 19.513 7.138L8.25 18.4H5.25V15.388L16.862 4.487Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75 12 21" /></svg>',
  messageSquare: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12M3.75 6.75A2.25 2.25 0 0 1 6 4.5h12a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-7.5l-4.5 4.5v-6.75H6A2.25 2.25 0 0 1 3.75 15.75v-9Z" /></svg>',
  sidebar: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75A2.25 2.25 0 0 1 6 4.5h12A2.25 2.25 0 0 1 20.25 6.75v10.5A2.25 2.25 0 0 1 18 19.5H6A2.25 2.25 0 0 1 3.75 17.25V6.75ZM8.25 4.5v15" /></svg>',
  user: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.5a6 6 0 0 1 15 0" /></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75 9 17.25 19.5 6.75" /></svg>',
}
</script>

<template>
  <span
    class="icon"
    :style="{
      width: typeof size === 'number' ? size + 'px' : size,
      height: typeof size === 'number' ? size + 'px' : size,
      color: color || 'currentColor'
    }"
    v-html="iconMap[name] || ''"
  />
</template>

<style scoped>
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
}
</style>

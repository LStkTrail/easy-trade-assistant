import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Options {
  itemHeight: number
  containerHeight: number
  buffer?: number
}

export function useVirtualList<T>(items: T[], options: Options) {
  const { itemHeight, containerHeight, buffer = 5 } = options

  const scrollTop = ref(0)
  const containerRef = ref<HTMLElement | null>(null)

  const totalHeight = computed(() => items.length * itemHeight)

  const visibleCount = Math.ceil(containerHeight / itemHeight) + buffer * 2

  const startIndex = computed(() => {
    return Math.max(0, Math.floor(scrollTop.value / itemHeight) - buffer)
  })

  const endIndex = computed(() => {
    return Math.min(items.length, startIndex.value + visibleCount)
  })

  const visibleItems = computed(() => {
    return items.slice(startIndex.value, endIndex.value)
  })

  const offsetY = computed(() => {
    return startIndex.value * itemHeight
  })

  function handleScroll(e: Event) {
    const target = e.target as HTMLElement
    scrollTop.value = target.scrollTop
  }

  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.addEventListener('scroll', handleScroll, { passive: true })
    }
  })

  onUnmounted(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('scroll', handleScroll)
    }
  })

  return {
    containerRef,
    totalHeight,
    visibleItems,
    offsetY,
    startIndex,
    endIndex
  }
}

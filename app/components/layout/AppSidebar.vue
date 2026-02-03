<script setup lang="ts">
interface Props {
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false
})

const emit = defineEmits<{
  toggle: []
}>()

const route = useRoute()

const navigation = [
  {
    name: 'Dashboard',
    to: '/',
    icon: 'i-heroicons-chart-bar-square'
  },
  {
    name: 'Lokale',
    to: '/locations',
    icon: 'i-heroicons-building-storefront'
  },
  {
    name: 'Newsletter',
    to: '/newsletter',
    icon: 'i-heroicons-envelope'
  }
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Logo -->
    <div class="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
          <UIcon name="i-heroicons-building-storefront" class="w-6 h-6 text-white" />
        </div>
        <Transition name="fade">
          <span v-if="!props.collapsed" class="font-semibold text-gray-900 dark:text-white">
            Dwell Properties
          </span>
        </Transition>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1">
      <NuxtLink
        v-for="item in navigation"
        :key="item.to"
        :to="item.to"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
          isActive(item.to)
            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        ]"
      >
        <UIcon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
        <Transition name="fade">
          <span v-if="!props.collapsed" class="font-medium">{{ item.name }}</span>
        </Transition>
      </NuxtLink>
    </nav>

    <!-- Toggle button -->
    <div class="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
      <UButton
        color="neutral"
        variant="ghost"
        :icon="props.collapsed ? 'i-heroicons-chevron-right' : 'i-heroicons-chevron-left'"
        block
        @click="emit('toggle')"
      />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

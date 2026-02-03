<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  icon: string
  trend?: number
  trendLabel?: string
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  trend: undefined,
  trendLabel: '',
  color: 'primary'
})

const colorClasses = computed(() => {
  const colors: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
    success: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    error: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  }
  return colors[props.color]
})
</script>

<template>
  <UCard>
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ label }}</p>
        <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
        <p v-if="trend !== undefined" class="mt-2 flex items-center text-sm">
          <span
            :class="[
              'flex items-center',
              trend >= 0 ? 'text-green-600' : 'text-red-600'
            ]"
          >
            <UIcon
              :name="trend >= 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'"
              class="w-4 h-4 mr-1"
            />
            {{ Math.abs(trend) }}%
          </span>
          <span v-if="trendLabel" class="ml-2 text-gray-500 dark:text-gray-400">{{ trendLabel }}</span>
        </p>
      </div>
      <div :class="['p-3 rounded-xl', colorClasses]">
        <UIcon :name="icon" class="w-6 h-6" />
      </div>
    </div>
  </UCard>
</template>

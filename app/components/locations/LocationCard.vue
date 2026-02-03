<script setup lang="ts">
import type { Location } from '~/composables/useLocations'

interface Props {
  location: Location
  isSelected?: boolean
  isHovered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  isHovered: false
})

const emit = defineEmits<{
  click: [location: Location]
  hover: [location: Location | null]
}>()

const getStatusBadge = (status: string) => {
  const statuses: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'neutral' }> = {
    new: { label: 'Nowy', color: 'info' },
    evaluated: { label: 'Oceniony', color: 'warning' },
    verified: { label: 'Zweryfikowany', color: 'success' }
  }
  return statuses[status] || { label: status, color: 'neutral' }
}

const formatRent = (rent: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0
  }).format(rent)
}
</script>

<template>
  <div
    :class="[
      'bg-white dark:bg-gray-800 rounded-lg border transition-all duration-200 cursor-pointer p-4',
      isSelected
        ? 'border-primary-500 ring-2 ring-primary-500/20'
        : isHovered
          ? 'border-primary-300 dark:border-primary-700'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
    ]"
    @click="emit('click', location)"
    @mouseenter="emit('hover', location)"
    @mouseleave="emit('hover', null)"
  >
    <div class="flex items-center justify-between gap-4">
      <!-- Left: Address and location -->
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <h3 class="font-semibold text-gray-900 dark:text-white truncate">
            {{ location.address }}
          </h3>
          <UBadge
            :color="getStatusBadge(location.status).color"
            variant="subtle"
            size="xs"
          >
            {{ getStatusBadge(location.status).label }}
          </UBadge>
          <UBadge v-if="location.inNewsletter" color="primary" variant="subtle" size="xs">
            <UIcon name="i-heroicons-envelope" class="w-3 h-3 mr-1" />
            Newsletter
          </UBadge>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ location.district }}, {{ location.city }}
        </p>
      </div>

      <!-- Middle: Details -->
      <div class="hidden sm:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
        <div class="flex items-center gap-1.5">
          <UIcon name="i-heroicons-square-3-stack-3d" class="w-4 h-4 text-gray-400" />
          <span class="font-medium">{{ location.area }} m²</span>
        </div>
        <div class="flex items-center gap-1.5">
          <UIcon name="i-heroicons-banknotes" class="w-4 h-4 text-gray-400" />
          <span class="font-medium">{{ formatRent(location.rent) }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <UIcon name="i-heroicons-window" class="w-4 h-4 text-gray-400" />
          <span>{{ location.storefrontWidth }}m</span>
        </div>
        <div class="text-gray-400">
          {{ location.rentPerSqm }} zł/m²
        </div>
      </div>

      <!-- Right: AI Score -->
      <div class="flex items-center gap-3">
        <div class="hidden md:flex items-center gap-2">
          <UBadge color="neutral" variant="subtle" size="xs">
            {{ location.type === 'retail' ? 'Handel' : 'Usługi' }}
          </UBadge>
          <UBadge color="neutral" variant="subtle" size="xs">
            {{ location.condition === 'ready' ? 'Gotowy' : 'Do adaptacji' }}
          </UBadge>
        </div>
        <div v-if="location.aiScore !== null" class="flex-shrink-0">
          <div
            :class="[
              'flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold',
              location.aiScore >= 8 ? 'bg-green-500 text-white' :
              location.aiScore >= 6 ? 'bg-amber-500 text-white' :
              'bg-red-500 text-white'
            ]"
          >
            <UIcon name="i-heroicons-star-solid" class="w-3.5 h-3.5" />
            {{ location.aiScore.toFixed(1) }}
          </div>
        </div>
        <div v-else class="flex-shrink-0">
          <UBadge color="neutral" variant="outline" size="sm">
            Brak oceny
          </UBadge>
        </div>
        <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400" />
      </div>
    </div>

    <!-- Mobile details -->
    <div class="sm:hidden mt-3 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
      <span>{{ location.area }} m²</span>
      <span>{{ formatRent(location.rent) }}</span>
      <span>{{ location.rentPerSqm }} zł/m²</span>
    </div>
  </div>
</template>

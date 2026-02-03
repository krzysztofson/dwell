<script setup lang="ts">
import type { Location } from '~/composables/useLocations'

interface Props {
  locations: Location[]
  selectedId?: string | null
  hoveredId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  selectedId: null,
  hoveredId: null
})

const emit = defineEmits<{
  select: [location: Location]
  hover: [location: Location | null]
}>()
</script>

<template>
  <div class="space-y-3">
    <!-- Results count -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Znaleziono <span class="font-semibold text-gray-900 dark:text-white">{{ locations.length }}</span> lokali
      </p>
    </div>

    <!-- Empty state -->
    <div v-if="locations.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-building-storefront" class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Brak wyników</h3>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Spróbuj zmienić filtry wyszukiwania
      </p>
    </div>

    <!-- List -->
    <div v-else class="space-y-2">
      <LocationsLocationCard
        v-for="location in locations"
        :key="location.id"
        :location="location"
        :is-selected="selectedId === location.id"
        :is-hovered="hoveredId === location.id"
        @click="emit('select', location)"
        @hover="emit('hover', $event)"
      />
    </div>
  </div>
</template>

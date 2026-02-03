import { defineStore } from 'pinia'
import type { Location } from '~/composables/useLocations'

export const useLocationsStore = defineStore('locations', () => {
  const selectedLocationId = ref<string | null>(null)
  const hoveredLocationId = ref<string | null>(null)
  const isDetailOpen = ref(false)

  const selectLocation = (location: Location | null) => {
    selectedLocationId.value = location?.id ?? null
    if (location) {
      isDetailOpen.value = true
    }
  }

  const hoverLocation = (location: Location | null) => {
    hoveredLocationId.value = location?.id ?? null
  }

  const closeDetail = () => {
    isDetailOpen.value = false
  }

  return {
    selectedLocationId,
    hoveredLocationId,
    isDetailOpen,
    selectLocation,
    hoverLocation,
    closeDetail
  }
})

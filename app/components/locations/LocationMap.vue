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

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<any>(null)
const markers = ref<any[]>([])

const getMarkerColor = (location: Location) => {
  if (location.id === props.selectedId) return '#6366f1'
  if (location.id === props.hoveredId) return '#8b5cf6'
  if (location.aiScore === null) return '#9ca3af'
  if (location.aiScore >= 8) return '#22c55e'
  if (location.aiScore >= 6) return '#eab308'
  return '#ef4444'
}

const createMarkerIcon = (color: string, isSelected: boolean) => {
  const size = isSelected ? 32 : 24
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="9" r="2.5" fill="white"/>
    </svg>
  `
}

const initMap = async () => {
  if (!mapContainer.value || map.value) return

  const L = await import('leaflet')

  map.value = L.map(mapContainer.value).setView([52.23, 21.01], 11)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map.value)

  updateMarkers()
}

const updateMarkers = async () => {
  if (!map.value) return

  const L = await import('leaflet')

  markers.value.forEach(marker => marker.remove())
  markers.value = []

  props.locations.forEach(location => {
    const color = getMarkerColor(location)
    const isSelected = location.id === props.selectedId

    const icon = L.divIcon({
      html: createMarkerIcon(color, isSelected),
      className: 'custom-marker',
      iconSize: isSelected ? [32, 32] : [24, 24],
      iconAnchor: isSelected ? [16, 32] : [12, 24]
    })

    const marker = L.marker([location.coordinates.lat, location.coordinates.lng], { icon })
      .addTo(map.value)

    marker.on('click', () => emit('select', location))
    marker.on('mouseover', () => emit('hover', location))
    marker.on('mouseout', () => emit('hover', null))

    const popupContent = `
      <div class="p-2 min-w-[180px]">
        <p class="font-semibold">${location.address}</p>
        <p class="text-sm text-gray-500">${location.district}</p>
        <div class="mt-2 flex items-center gap-2">
          <span class="text-sm">${location.area} m²</span>
          <span class="text-sm">•</span>
          <span class="text-sm">${location.rent.toLocaleString('pl-PL')} zł</span>
        </div>
        ${location.aiScore !== null ? `
          <div class="mt-2">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" style="background-color: ${color}; color: white;">
              Ocena: ${location.aiScore.toFixed(1)}
            </span>
          </div>
        ` : ''}
      </div>
    `

    marker.bindPopup(popupContent, {
      closeButton: false,
      className: 'custom-popup'
    })

    markers.value.push(marker)
  })

  if (props.locations.length > 0) {
    const bounds = L.latLngBounds(props.locations.map(l => [l.coordinates.lat, l.coordinates.lng]))
    map.value.fitBounds(bounds, { padding: [30, 30] })
  }
}

watch(() => props.locations, updateMarkers, { deep: true })
watch(() => props.selectedId, updateMarkers)
watch(() => props.hoveredId, updateMarkers)

onMounted(initMap)
</script>

<template>
  <div class="relative w-full h-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
    <div ref="mapContainer" class="w-full h-full min-h-[400px]" />

    <!-- Legend -->
    <div class="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-[1000]">
      <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Ocena AI</p>
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-green-500" />
          <span class="text-xs text-gray-600 dark:text-gray-300">8.0+</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-amber-500" />
          <span class="text-xs text-gray-600 dark:text-gray-300">6.0 - 7.9</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-red-500" />
          <span class="text-xs text-gray-600 dark:text-gray-300">&lt; 6.0</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-gray-400" />
          <span class="text-xs text-gray-600 dark:text-gray-300">Brak oceny</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.custom-marker {
  background: transparent;
  border: none;
}

.custom-popup .leaflet-popup-content-wrapper {
  border-radius: 8px;
  padding: 0;
}

.custom-popup .leaflet-popup-content {
  margin: 0;
}
</style>

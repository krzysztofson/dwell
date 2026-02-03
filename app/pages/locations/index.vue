<script setup lang="ts">
import type { Location } from '~/composables/useLocations'

const router = useRouter()
const { filters, filteredLocations, resetFilters } = useLocations()

const route = useRoute()

onMounted(() => {
  if (route.query.status) {
    filters.value.status = [route.query.status as string]
  }
})

const selectedLocation = ref<Location | null>(null)
const hoveredLocation = ref<Location | null>(null)

const handleSelectLocation = (location: Location) => {
  router.push(`/locations/${location.id}`)
}

const handleHoverLocation = (location: Location | null) => {
  hoveredLocation.value = location
  selectedLocation.value = location
}

const viewMode = ref<'split' | 'list' | 'map'>('split')
</script>

<template>
  <div class="h-[calc(100vh-8rem)]">
    <!-- Page header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Lokale</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Przeglądaj i zarządzaj lokalami usługowymi
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButtonGroup>
          <UButton
            :color="viewMode === 'split' ? 'primary' : 'neutral'"
            :variant="viewMode === 'split' ? 'solid' : 'outline'"
            icon="i-heroicons-view-columns"
            @click="viewMode = 'split'"
          />
          <UButton
            :color="viewMode === 'list' ? 'primary' : 'neutral'"
            :variant="viewMode === 'list' ? 'solid' : 'outline'"
            icon="i-heroicons-list-bullet"
            @click="viewMode = 'list'"
          />
          <UButton
            :color="viewMode === 'map' ? 'primary' : 'neutral'"
            :variant="viewMode === 'map' ? 'solid' : 'outline'"
            icon="i-heroicons-map"
            @click="viewMode = 'map'"
          />
        </UButtonGroup>
        <UButton color="primary" icon="i-heroicons-plus">
          Dodaj lokal
        </UButton>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6">
      <LocationsLocationFilters
        v-model="filters"
        @reset="resetFilters"
      />
    </div>

    <!-- Content -->
    <div
      :class="[
        'h-[calc(100%-10rem)]',
        viewMode === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''
      ]"
    >
      <!-- List -->
      <div
        v-if="viewMode !== 'map'"
        :class="[
          'overflow-y-auto pr-2',
          viewMode === 'split' ? 'h-full' : ''
        ]"
      >
        <LocationsLocationList
          :locations="filteredLocations"
          :selected-id="selectedLocation?.id"
          :hovered-id="hoveredLocation?.id"
          @select="handleSelectLocation"
          @hover="handleHoverLocation"
        />
      </div>

      <!-- Map -->
      <div
        v-if="viewMode !== 'list'"
        :class="[
          viewMode === 'split' ? 'h-full hidden lg:block' : 'h-full'
        ]"
      >
        <ClientOnly>
          <LocationsLocationMap
            :locations="filteredLocations"
            :selected-id="selectedLocation?.id"
            :hovered-id="hoveredLocation?.id"
            @select="handleSelectLocation"
            @hover="handleHoverLocation"
          />
        </ClientOnly>
      </div>
    </div>

  </div>
</template>

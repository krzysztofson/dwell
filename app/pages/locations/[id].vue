<script setup lang="ts">
import { useLocations } from '~/composables/useLocations'

const route = useRoute()
const { getLocationById } = useLocations()

const location = computed(() => getLocationById(route.params.id as string))

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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getOwnerTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    private: 'Osoba prywatna',
    company: 'Firma',
    agency: 'Agencja'
  }
  return types[type] || type
}

const specificationItems = computed(() => {
  if (!location.value) return []
  const specs = location.value.specifications
  return [
    { label: 'Moc przyłączeniowa', value: `${specs.electricPower} kW`, icon: 'i-heroicons-bolt' },
    { label: 'Przyłącze wodne', value: specs.waterConnection ? 'Tak' : 'Nie', icon: 'i-heroicons-beaker' },
    { label: 'Przyłącze gazowe', value: specs.gasConnection ? 'Tak' : 'Nie', icon: 'i-heroicons-fire' },
    { label: 'Klimatyzacja', value: specs.airConditioning ? 'Tak' : 'Nie', icon: 'i-heroicons-sun' },
    { label: 'Ogrzewanie', value: specs.heating, icon: 'i-heroicons-home-modern' },
    { label: 'Wysokość sufitu', value: `${specs.ceilingHeight} m`, icon: 'i-heroicons-arrows-up-down' },
    { label: 'Toalety', value: specs.toilets.toString(), icon: 'i-heroicons-user' },
    { label: 'Miejsca parkingowe', value: specs.parkingSpots.toString(), icon: 'i-heroicons-truck' },
    { label: 'Dostęp dla niepełnosprawnych', value: specs.accessibility ? 'Tak' : 'Nie', icon: 'i-heroicons-heart' },
    { label: 'Alarm', value: specs.alarm ? 'Tak' : 'Nie', icon: 'i-heroicons-bell-alert' },
    { label: 'Internet', value: specs.internet ? 'Tak' : 'Nie', icon: 'i-heroicons-wifi' }
  ]
})

// Map initialization
const mapContainer = ref<HTMLElement | null>(null)
const map = ref<any>(null)

const initMap = async () => {
  if (!mapContainer.value || map.value || !location.value) return

  const L = await import('leaflet')

  const coords = location.value.coordinates
  map.value = L.map(mapContainer.value).setView([coords.lat, coords.lng], 15)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map.value)

  const icon = L.divIcon({
    html: `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#6366f1" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="9" r="2.5" fill="white"/>
      </svg>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  })

  L.marker([coords.lat, coords.lng], { icon })
    .addTo(map.value)
    .bindPopup(location.value.address)
}

onMounted(() => {
  nextTick(() => {
    initMap()
  })
})
</script>

<template>
  <div v-if="!location" class="p-8 text-center">
    <UIcon name="i-heroicons-exclamation-circle" class="w-12 h-12 mx-auto text-gray-400" />
    <h2 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Lokal nie znaleziony</h2>
    <p class="mt-2 text-sm text-gray-500">Nie znaleziono lokalu o podanym ID.</p>
    <UButton to="/locations" class="mt-4" variant="soft">
      Powrót do listy
    </UButton>
  </div>

  <div v-else class="p-6 space-y-6">
    <!-- Header with back button -->
    <div class="flex items-center gap-4">
      <UButton to="/locations" variant="ghost" icon="i-heroicons-arrow-left" size="sm">
        Powrót
      </UButton>
    </div>

    <!-- Main header -->
    <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 flex-wrap">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ location.address }}
          </h1>
          <UBadge
            :color="getStatusBadge(location.status).color"
            variant="subtle"
          >
            {{ getStatusBadge(location.status).label }}
          </UBadge>
          <UBadge v-if="location.inNewsletter" color="primary" variant="subtle">
            <UIcon name="i-heroicons-envelope" class="w-3 h-3 mr-1" />
            W newsletterze
          </UBadge>
        </div>
        <p class="mt-1 text-gray-500 dark:text-gray-400">
          {{ location.district }}, {{ location.city }}
        </p>
        <p class="mt-1 text-sm text-gray-400 dark:text-gray-500">
          Dodano: {{ formatDate(location.createdAt) }} | Źródło:
          <a v-if="location.sourceUrl" :href="location.sourceUrl" target="_blank" class="text-primary-500 hover:underline">
            {{ location.source }}
          </a>
          <span v-else>{{ location.source }}</span>
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div v-if="location.aiScore !== null" class="flex items-center gap-2">
          <div
            :class="[
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-lg font-bold',
              location.aiScore >= 8 ? 'bg-green-500 text-white' :
              location.aiScore >= 6 ? 'bg-amber-500 text-white' :
              'bg-red-500 text-white'
            ]"
          >
            <UIcon name="i-heroicons-star-solid" class="w-5 h-5" />
            {{ location.aiScore.toFixed(1) }}
          </div>
        </div>
        <UButton icon="i-heroicons-pencil" variant="soft">
          Edytuj
        </UButton>
      </div>
    </div>

    <!-- Key metrics -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">Powierzchnia</p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">{{ location.area }} m²</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">Czynsz</p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatRent(location.rent) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">Cena za m²</p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">{{ location.rentPerSqm }} zł</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">Witryna</p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">{{ location.storefrontWidth }} m</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">Typ</p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">{{ location.type === 'retail' ? 'Handel' : 'Usługi' }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">Stan</p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">{{ location.condition === 'ready' ? 'Gotowy' : 'Do adaptacji' }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left column: Descriptions -->
      <div class="lg:col-span-2 space-y-6">
        <!-- AI Summary -->
        <div v-if="location.aiSummary" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-primary-500" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Ocena AI</h2>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-4">{{ location.aiSummary }}</p>

          <div v-if="location.aiPros && location.aiPros.length" class="mb-4">
            <h3 class="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Zalety</h3>
            <ul class="space-y-1">
              <li v-for="pro in location.aiPros" :key="pro" class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                {{ pro }}
              </li>
            </ul>
          </div>

          <div v-if="location.aiCons && location.aiCons.length">
            <h3 class="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Wady</h3>
            <ul class="space-y-1">
              <li v-for="con in location.aiCons" :key="con" class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                <UIcon name="i-heroicons-x-circle" class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                {{ con }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Public description -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-gray-400" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Opis publiczny</h2>
            <UBadge color="success" variant="subtle" size="xs">Do newslettera</UBadge>
          </div>
          <p class="text-gray-600 dark:text-gray-300 whitespace-pre-line">{{ location.publicDescription }}</p>
        </div>

        <!-- Private description -->
        <div class="bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 p-6">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-heroicons-lock-closed" class="w-5 h-5 text-amber-500" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Notatki prywatne</h2>
            <UBadge color="warning" variant="subtle" size="xs">Tylko dla zespołu</UBadge>
          </div>
          <p class="text-gray-600 dark:text-gray-300 whitespace-pre-line">{{ location.privateDescription }}</p>
        </div>

        <!-- Technical specifications -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-gray-400" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Specyfikacja techniczna</h2>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="spec in specificationItems"
              :key="spec.label"
              class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <UIcon :name="spec.icon" class="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ spec.label }}</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ spec.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Prompt Builder -->
        <LocationsPromptBuilder :location="location" />
      </div>

      <!-- Right column: Map, Owner, Actions -->
      <div class="space-y-6">
        <!-- Map -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="font-semibold text-gray-900 dark:text-white">Lokalizacja</h2>
          </div>
          <ClientOnly>
            <div ref="mapContainer" class="h-64 w-full" />
          </ClientOnly>
          <div class="p-4 bg-gray-50 dark:bg-gray-700/50">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              <UIcon name="i-heroicons-map-pin" class="w-4 h-4 inline mr-1" />
              {{ location.address }}, {{ location.district }}, {{ location.city }}
            </p>
            <p class="text-xs text-gray-400 mt-1">
              {{ location.coordinates.lat.toFixed(6) }}, {{ location.coordinates.lng.toFixed(6) }}
            </p>
          </div>
        </div>

        <!-- Owner info -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-gray-400" />
            <h2 class="font-semibold text-gray-900 dark:text-white">Właściciel / Kontakt</h2>
          </div>
          <div class="space-y-3">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Nazwa</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ location.owner.name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Typ</p>
              <UBadge color="neutral" variant="subtle">{{ getOwnerTypeLabel(location.owner.type) }}</UBadge>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Telefon</p>
              <a :href="`tel:${location.owner.phone}`" class="font-medium text-primary-500 hover:underline">
                {{ location.owner.phone }}
              </a>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <a :href="`mailto:${location.owner.email}`" class="font-medium text-primary-500 hover:underline">
                {{ location.owner.email }}
              </a>
            </div>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="font-semibold text-gray-900 dark:text-white mb-4">Akcje</h2>
          <div class="space-y-2">
            <UButton block variant="soft" icon="i-heroicons-envelope">
              Dodaj do newslettera
            </UButton>
            <UButton block variant="soft" icon="i-heroicons-document-duplicate">
              Kopiuj opis publiczny
            </UButton>
            <UButton block variant="soft" icon="i-heroicons-arrow-top-right-on-square">
              Otwórz źródło
            </UButton>
            <UButton block variant="soft" color="red" icon="i-heroicons-trash">
              Usuń lokal
            </UButton>
          </div>
        </div>

        <!-- Location details -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="font-semibold text-gray-900 dark:text-white mb-4">Szczegóły</h2>
          <dl class="space-y-3">
            <div class="flex justify-between">
              <dt class="text-sm text-gray-500 dark:text-gray-400">ID</dt>
              <dd class="text-sm font-mono text-gray-900 dark:text-white">{{ location.id }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-gray-500 dark:text-gray-400">Piętro</dt>
              <dd class="text-sm text-gray-900 dark:text-white">{{ location.floor }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-gray-500 dark:text-gray-400">Witryna</dt>
              <dd class="text-sm text-gray-900 dark:text-white">{{ location.hasStorefront ? 'Tak' : 'Nie' }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-gray-500 dark:text-gray-400">W newsletterze</dt>
              <dd class="text-sm text-gray-900 dark:text-white">{{ location.inNewsletter ? 'Tak' : 'Nie' }}</dd>
            </div>
          </dl>
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
</style>

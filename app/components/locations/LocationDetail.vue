<script setup lang="ts">
import type { Location } from '~/composables/useLocations'

interface Props {
  location: Location | null
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const isGeneratingDescription = ref(false)
const generatedDescription = ref<string | null>(null)

const formatRent = (rent: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0
  }).format(rent)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getStatusBadge = (status: string) => {
  const statuses: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'neutral' }> = {
    new: { label: 'Nowy', color: 'info' },
    evaluated: { label: 'Oceniony', color: 'warning' },
    verified: { label: 'Zweryfikowany', color: 'success' }
  }
  return statuses[status] || { label: status, color: 'neutral' }
}

const getScoreColor = (score: number | null) => {
  if (score === null) return 'gray'
  if (score >= 8) return 'green'
  if (score >= 6) return 'amber'
  return 'red'
}

const imageUrl = computed(() => {
  if (!props.location) return ''
  if (props.location.images.length > 0) {
    return props.location.images[0]
  }
  return 'https://placehold.co/800x600/e2e8f0/64748b?text=Brak+zdjęcia'
})

const floorPlanUrl = computed(() => {
  if (!props.location?.floorPlan) {
    return 'https://placehold.co/600x400/e2e8f0/64748b?text=Brak+rzutu'
  }
  return props.location.floorPlan
})

const generateDescription = async () => {
  isGeneratingDescription.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  generatedDescription.value = `Wyjątkowy lokal usługowy w doskonałej lokalizacji! ${props.location?.area}m² powierzchni użytkowej z ${props.location?.storefrontWidth}-metrową witryną. Idealne miejsce na ${props.location?.type === 'retail' ? 'sklep, showroom lub punkt handlowy' : 'gabinet, salon lub punkt usługowy'}. ${props.location?.condition === 'ready' ? 'Lokal gotowy do prowadzenia działalności.' : 'Lokal wymaga adaptacji - możliwość dostosowania do własnych potrzeb.'} Lokalizacja w dzielnicy ${props.location?.district} zapewnia doskonałą widoczność i dostęp dla klientów.`
  isGeneratingDescription.value = false
}

const historyItems = [
  { date: '2025-01-28', action: 'Dodano do systemu', user: 'System' },
  { date: '2025-01-27', action: 'Ocena AI zakończona', user: 'AI Assistant' },
  { date: '2025-01-26', action: 'Weryfikacja Marcina', user: 'Marcin Kowalski' },
  { date: '2025-01-25', action: 'Dodano do newslettera', user: 'Anna Nowak' }
]
</script>

<template>
  <USlideover v-model:open="props.open" :ui="{ width: 'max-w-2xl' }">
    <template v-if="location">
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div class="flex items-center gap-2 mb-2">
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
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ location.address }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ location.district }}, {{ location.city }}
            </p>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            @click="emit('update:open', false)"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto">
          <!-- Image gallery -->
          <div class="relative h-64 bg-gray-100 dark:bg-gray-800">
            <img
              :src="imageUrl"
              :alt="location.address"
              class="w-full h-full object-cover"
            >
          </div>

          <div class="p-6 space-y-6">
            <!-- Quick stats -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ location.area }}</p>
                <p class="text-xs text-gray-500">m²</p>
              </div>
              <div class="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatRent(location.rent) }}</p>
                <p class="text-xs text-gray-500">czynsz</p>
              </div>
              <div class="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ location.rentPerSqm }}</p>
                <p class="text-xs text-gray-500">zł/m²</p>
              </div>
              <div class="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ location.storefrontWidth }}</p>
                <p class="text-xs text-gray-500">m witryny</p>
              </div>
            </div>

            <!-- AI Score Section -->
            <div v-if="location.aiScore !== null" class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-cpu-chip" class="w-5 h-5 text-primary-500" />
                  <h3 class="font-semibold text-gray-900 dark:text-white">Ocena AI</h3>
                </div>
                <div
                  :class="[
                    'text-3xl font-bold',
                    location.aiScore >= 8 ? 'text-green-500' :
                    location.aiScore >= 6 ? 'text-amber-500' : 'text-red-500'
                  ]"
                >
                  {{ location.aiScore.toFixed(1) }}
                </div>
              </div>

              <!-- Score bar -->
              <div class="mb-4">
                <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    :class="[
                      'h-full transition-all duration-500',
                      location.aiScore >= 8 ? 'bg-green-500' :
                      location.aiScore >= 6 ? 'bg-amber-500' : 'bg-red-500'
                    ]"
                    :style="{ width: `${location.aiScore * 10}%` }"
                  />
                </div>
              </div>

              <!-- Summary -->
              <p v-if="location.aiSummary" class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {{ location.aiSummary }}
              </p>

              <!-- Pros and Cons -->
              <div v-if="location.aiPros || location.aiCons" class="grid grid-cols-2 gap-4">
                <div v-if="location.aiPros">
                  <p class="text-xs font-medium text-green-600 dark:text-green-400 mb-2">Zalety</p>
                  <ul class="space-y-1">
                    <li
                      v-for="pro in location.aiPros"
                      :key="pro"
                      class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500 flex-shrink-0" />
                      {{ pro }}
                    </li>
                  </ul>
                </div>
                <div v-if="location.aiCons">
                  <p class="text-xs font-medium text-red-600 dark:text-red-400 mb-2">Wady</p>
                  <ul class="space-y-1">
                    <li
                      v-for="con in location.aiCons"
                      :key="con"
                      class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <UIcon name="i-heroicons-x-circle" class="w-4 h-4 text-red-500 flex-shrink-0" />
                      {{ con }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- No AI score -->
            <div v-else class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
              <UIcon name="i-heroicons-cpu-chip" class="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Ten lokal nie został jeszcze oceniony przez AI
              </p>
              <UButton color="primary" icon="i-heroicons-sparkles">
                Oceń teraz
              </UButton>
            </div>

            <!-- Marketing description -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-semibold text-gray-900 dark:text-white">Opis marketingowy</h3>
              </div>
              <div v-if="location.aiDescription || generatedDescription" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  {{ generatedDescription || location.aiDescription }}
                </p>
                <div class="mt-3 flex gap-2">
                  <UButton color="neutral" variant="soft" size="xs" icon="i-heroicons-clipboard">
                    Kopiuj
                  </UButton>
                  <UButton color="neutral" variant="soft" size="xs" icon="i-heroicons-pencil">
                    Edytuj
                  </UButton>
                </div>
              </div>
              <div v-else class="text-center py-4">
                <UButton
                  color="primary"
                  variant="soft"
                  icon="i-heroicons-sparkles"
                  :loading="isGeneratingDescription"
                  @click="generateDescription"
                >
                  {{ isGeneratingDescription ? 'Generowanie...' : 'Wygeneruj opis' }}
                </UButton>
              </div>
            </div>

            <!-- Floor plan -->
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Rzut lokalu</h3>
              <div class="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img
                  :src="floorPlanUrl"
                  alt="Rzut lokalu"
                  class="w-full h-48 object-contain"
                >
              </div>
            </div>

            <!-- Details -->
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Szczegóły</h3>
              <dl class="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt class="text-gray-500 dark:text-gray-400">Typ</dt>
                  <dd class="font-medium text-gray-900 dark:text-white">
                    {{ location.type === 'retail' ? 'Handel' : 'Usługi' }}
                  </dd>
                </div>
                <div>
                  <dt class="text-gray-500 dark:text-gray-400">Stan</dt>
                  <dd class="font-medium text-gray-900 dark:text-white">
                    {{ location.condition === 'ready' ? 'Gotowy' : 'Do adaptacji' }}
                  </dd>
                </div>
                <div>
                  <dt class="text-gray-500 dark:text-gray-400">Piętro</dt>
                  <dd class="font-medium text-gray-900 dark:text-white">
                    {{ location.floor === 'ground' ? 'Parter' : location.floor }}
                  </dd>
                </div>
                <div>
                  <dt class="text-gray-500 dark:text-gray-400">Witryna</dt>
                  <dd class="font-medium text-gray-900 dark:text-white">
                    {{ location.hasStorefront ? `Tak, ${location.storefrontWidth}m` : 'Nie' }}
                  </dd>
                </div>
                <div>
                  <dt class="text-gray-500 dark:text-gray-400">Dodano</dt>
                  <dd class="font-medium text-gray-900 dark:text-white">
                    {{ formatDate(location.createdAt) }}
                  </dd>
                </div>
              </dl>
            </div>

            <!-- History -->
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Historia</h3>
              <div class="space-y-3">
                <div
                  v-for="(item, index) in historyItems"
                  :key="index"
                  class="flex items-start gap-3 text-sm"
                >
                  <div class="w-2 h-2 mt-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <div>
                    <p class="text-gray-900 dark:text-white">{{ item.action }}</p>
                    <p class="text-xs text-gray-500">{{ item.date }} • {{ item.user }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer actions -->
        <div class="flex items-center justify-between gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <UButton color="neutral" variant="ghost" icon="i-heroicons-trash">
            Usuń
          </UButton>
          <div class="flex gap-2">
            <UButton color="neutral" variant="soft" icon="i-heroicons-envelope">
              Do newslettera
            </UButton>
            <UButton color="primary" icon="i-heroicons-pencil-square">
              Edytuj
            </UButton>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import type { Location } from '~/composables/useLocations'

interface Props {
  locations: Location[]
}

defineProps<Props>()

const getScoreColor = (score: number | null) => {
  if (score === null) return 'neutral'
  if (score >= 8) return 'success'
  if (score >= 6) return 'warning'
  return 'error'
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
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-trophy" class="w-5 h-5 text-amber-500" />
          <h3 class="font-semibold text-gray-900 dark:text-white">Top 5 Lokali</h3>
        </div>
        <UButton to="/locations" variant="link" size="xs" trailing-icon="i-heroicons-arrow-right">
          Zobacz wszystkie
        </UButton>
      </div>
    </template>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lokal
            </th>
            <th class="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dzielnica
            </th>
            <th class="text-right py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Czynsz
            </th>
            <th class="text-right py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ocena AI
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="(loc, index) in locations"
            :key="loc.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <td class="py-3 px-2">
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium">
                  {{ index + 1 }}
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ loc.address }}</p>
                  <p class="text-xs text-gray-500">{{ loc.area }} m²</p>
                </div>
              </div>
            </td>
            <td class="py-3 px-2 text-sm text-gray-600 dark:text-gray-300">
              {{ loc.district }}
            </td>
            <td class="py-3 px-2 text-right text-sm font-medium text-gray-900 dark:text-white">
              {{ formatRent(loc.rent) }}
            </td>
            <td class="py-3 px-2 text-right">
              <UBadge :color="getScoreColor(loc.aiScore)" variant="subtle" class="font-semibold">
                {{ loc.aiScore?.toFixed(1) }}
              </UBadge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </UCard>
</template>

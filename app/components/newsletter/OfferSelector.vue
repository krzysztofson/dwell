<script setup lang="ts">
import type { Location } from '~/composables/useLocations'

const open = defineModel<boolean>('open', { default: false })
const modelValue = defineModel<string[]>({ default: () => [] })

const { filteredLocations, filters } = useLocations()

const toggleLocation = (id: string) => {
  if (modelValue.value.includes(id)) {
    modelValue.value = modelValue.value.filter(i => i !== id)
  } else {
    modelValue.value = [...modelValue.value, id]
  }
}

const selectAll = () => {
  modelValue.value = filteredLocations.value.map(l => l.id)
}

const deselectAll = () => {
  modelValue.value = []
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
  <UModal v-model:open="open" :ui="{ width: 'max-w-4xl' }">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Wybierz lokale do newslettera
        </h3>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-x-mark"
          @click="open = false"
        />
      </div>
    </template>

    <div class="p-4">
      <!-- Search and filters -->
      <div class="flex flex-col sm:flex-row gap-4 mb-4">
        <UInput
          v-model="filters.search"
          placeholder="Szukaj lokalu..."
          icon="i-heroicons-magnifying-glass"
          class="flex-1"
        />
        <div class="flex gap-2">
          <UButton color="neutral" variant="soft" size="sm" @click="selectAll">
            Zaznacz wszystkie
          </UButton>
          <UButton color="neutral" variant="soft" size="sm" @click="deselectAll">
            Odznacz wszystkie
          </UButton>
        </div>
      </div>

      <!-- Selected count -->
      <div class="mb-4 flex items-center gap-2">
        <UBadge color="primary" variant="subtle">
          Wybrano: {{ modelValue.length }}
        </UBadge>
        <span v-if="modelValue.length > 0" class="text-sm text-gray-500">
          z {{ filteredLocations.length }} wyświetlanych
        </span>
      </div>

      <!-- Locations list -->
      <div class="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="location in filteredLocations"
          :key="location.id"
          :class="[
            'flex items-center gap-4 p-3 cursor-pointer transition-colors',
            modelValue.includes(location.id)
              ? 'bg-primary-50 dark:bg-primary-900/20'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          ]"
          @click="toggleLocation(location.id)"
        >
          <UCheckbox
            :model-value="modelValue.includes(location.id)"
            @click.stop
            @update:model-value="toggleLocation(location.id)"
          />

          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 dark:text-white truncate">
              {{ location.address }}
            </p>
            <p class="text-sm text-gray-500">
              {{ location.district }} • {{ location.area }} m² • {{ formatRent(location.rent) }}
            </p>
          </div>

          <div v-if="location.aiScore !== null" class="flex-shrink-0">
            <UBadge
              :color="location.aiScore >= 8 ? 'success' : location.aiScore >= 6 ? 'warning' : 'error'"
              variant="subtle"
            >
              {{ location.aiScore.toFixed(1) }}
            </UBadge>
          </div>

          <div class="flex-shrink-0">
            <UBadge
              :color="location.status === 'verified' ? 'success' : location.status === 'evaluated' ? 'warning' : 'info'"
              variant="subtle"
              size="xs"
            >
              {{ location.status === 'verified' ? 'Zweryfikowany' : location.status === 'evaluated' ? 'Oceniony' : 'Nowy' }}
            </UBadge>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredLocations.length === 0" class="p-8 text-center">
          <UIcon name="i-heroicons-building-storefront" class="w-8 h-8 mx-auto text-gray-300" />
          <p class="mt-2 text-sm text-gray-500">Brak lokali spełniających kryteria</p>
        </div>
      </div>
    </div>
  </UModal>
</template>

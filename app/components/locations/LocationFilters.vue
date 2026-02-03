<script setup lang="ts">
import type { LocationFilters } from '~/composables/useLocations'

interface Props {
  modelValue: LocationFilters
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [filters: LocationFilters]
  reset: []
}>()

const { districts, typeOptions, statusOptions } = useLocations()

const localFilters = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const districtOptions = computed(() =>
  districts.value.map(d => ({ label: d.name, value: d.name }))
)

const hasActiveFilters = computed(() => {
  const f = localFilters.value
  return (
    f.search !== '' ||
    f.district.length > 0 ||
    f.type.length > 0 ||
    f.status.length > 0 ||
    f.minRent !== null ||
    f.maxRent !== null ||
    f.minArea !== null ||
    f.maxArea !== null ||
    f.minScore !== null ||
    f.hasStorefront !== null
  )
})

const activeFiltersCount = computed(() => {
  let count = 0
  const f = localFilters.value
  if (f.search) count++
  if (f.district.length) count++
  if (f.type.length) count++
  if (f.status.length) count++
  if (f.minRent || f.maxRent) count++
  if (f.minArea || f.maxArea) count++
  if (f.minScore) count++
  if (f.hasStorefront !== null) count++
  return count
})

const isExpanded = ref(false)
</script>

<template>
  <UCard>
    <!-- Search and toggle -->
    <div class="flex flex-col sm:flex-row gap-4">
      <UInput
        v-model="localFilters.search"
        placeholder="Szukaj po adresie lub dzielnicy..."
        icon="i-heroicons-magnifying-glass"
        class="flex-1"
        size="lg"
      />
      <div class="flex gap-2">
        <UButton
          :color="isExpanded ? 'primary' : 'neutral'"
          :variant="isExpanded ? 'soft' : 'outline'"
          icon="i-heroicons-adjustments-horizontal"
          @click="isExpanded = !isExpanded"
        >
          Filtry
          <UBadge v-if="activeFiltersCount > 0" color="primary" size="xs" class="ml-1">
            {{ activeFiltersCount }}
          </UBadge>
        </UButton>
        <UButton
          v-if="hasActiveFilters"
          color="neutral"
          variant="ghost"
          icon="i-heroicons-x-mark"
          @click="emit('reset')"
        >
          Wyczyść
        </UButton>
      </div>
    </div>

    <!-- Expanded filters -->
    <Transition name="slide">
      <div v-if="isExpanded" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- District -->
          <UFormField label="Dzielnica">
            <USelectMenu
              v-model="localFilters.district"
              :items="districtOptions"
              value-key="value"
              multiple
              placeholder="Wszystkie"
              class="w-full"
            />
          </UFormField>

          <!-- Type -->
          <UFormField label="Typ">
            <USelectMenu
              v-model="localFilters.type"
              :items="typeOptions"
              value-key="value"
              multiple
              placeholder="Wszystkie"
              class="w-full"
            />
          </UFormField>

          <!-- Status -->
          <UFormField label="Status">
            <USelectMenu
              v-model="localFilters.status"
              :items="statusOptions"
              value-key="value"
              multiple
              placeholder="Wszystkie"
              class="w-full"
            />
          </UFormField>

          <!-- Min score -->
          <UFormField label="Min. ocena AI">
            <UInput
              v-model.number="localFilters.minScore"
              type="number"
              min="0"
              max="10"
              step="0.1"
              placeholder="0"
            />
          </UFormField>

          <!-- Rent range -->
          <UFormField label="Czynsz od">
            <UInput
              v-model.number="localFilters.minRent"
              type="number"
              min="0"
              step="1000"
              placeholder="0 zł"
            />
          </UFormField>

          <UFormField label="Czynsz do">
            <UInput
              v-model.number="localFilters.maxRent"
              type="number"
              min="0"
              step="1000"
              placeholder="bez limitu"
            />
          </UFormField>

          <!-- Area range -->
          <UFormField label="Powierzchnia od">
            <UInput
              v-model.number="localFilters.minArea"
              type="number"
              min="0"
              placeholder="0 m²"
            />
          </UFormField>

          <UFormField label="Powierzchnia do">
            <UInput
              v-model.number="localFilters.maxArea"
              type="number"
              min="0"
              placeholder="bez limitu"
            />
          </UFormField>
        </div>

        <!-- Storefront checkbox -->
        <div class="mt-4">
          <UCheckbox
            :model-value="localFilters.hasStorefront === true"
            label="Tylko z witryną"
            @update:model-value="localFilters.hasStorefront = $event ? true : null"
          />
        </div>
      </div>
    </Transition>
  </UCard>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

<script setup lang="ts">
import type { Location } from '~/composables/useLocations'

interface Props {
  location: Location
}

const props = defineProps<Props>()

interface FieldOption {
  id: string
  label: string
  getValue: () => string
}

const fieldOptions = computed<FieldOption[]>(() => {
  const loc = props.location
  return [
    { id: 'address', label: 'Adres', getValue: () => `${loc.address}, ${loc.district}` },
    { id: 'area', label: 'Powierzchnia', getValue: () => `${loc.area} m²` },
    { id: 'rent', label: 'Czynsz', getValue: () => `${loc.rent.toLocaleString('pl-PL')} zł/mies.` },
    { id: 'rentPerSqm', label: 'Cena za m²', getValue: () => `${loc.rentPerSqm} zł/m²` },
    { id: 'type', label: 'Typ lokalu', getValue: () => loc.type === 'retail' ? 'Handel' : 'Usługi' },
    { id: 'floor', label: 'Piętro', getValue: () => loc.floor },
    { id: 'condition', label: 'Stan', getValue: () => loc.condition === 'ready' ? 'Gotowy do użytku' : 'Do adaptacji' },
    { id: 'storefront', label: 'Witryna', getValue: () => loc.hasStorefront ? `Tak (${loc.storefrontWidth}m)` : 'Brak' },
    { id: 'electricPower', label: 'Moc przyłączeniowa', getValue: () => `${loc.specifications.electricPower} kW` },
    { id: 'water', label: 'Przyłącze wodne', getValue: () => loc.specifications.waterConnection ? 'Tak' : 'Nie' },
    { id: 'gas', label: 'Przyłącze gazowe', getValue: () => loc.specifications.gasConnection ? 'Tak' : 'Nie' },
    { id: 'airConditioning', label: 'Klimatyzacja', getValue: () => loc.specifications.airConditioning ? 'Tak' : 'Nie' },
    { id: 'heating', label: 'Ogrzewanie', getValue: () => loc.specifications.heating },
    { id: 'ceilingHeight', label: 'Wysokość sufitu', getValue: () => `${loc.specifications.ceilingHeight} m` },
    { id: 'toilets', label: 'Toalety', getValue: () => `${loc.specifications.toilets}` },
    { id: 'parking', label: 'Miejsca parkingowe', getValue: () => `${loc.specifications.parkingSpots}` },
    { id: 'accessibility', label: 'Dostępność dla niepełnosprawnych', getValue: () => loc.specifications.accessibility ? 'Tak' : 'Nie' },
    { id: 'alarm', label: 'Alarm', getValue: () => loc.specifications.alarm ? 'Tak' : 'Nie' },
    { id: 'internet', label: 'Internet', getValue: () => loc.specifications.internet ? 'Tak' : 'Nie' },
    { id: 'aiScore', label: 'Ocena AI', getValue: () => loc.aiScore ? `${loc.aiScore.toFixed(1)}/10` : 'Brak' }
  ]
})

type SelectionMode = 'none' | 'include' | 'exclude'

const selectionMode = ref<SelectionMode>('none')
const includedFields = ref<Set<string>>(new Set())
const excludedFields = ref<Set<string>>(new Set())
const descriptionLength = ref<number>(120)

const lengthOptions = [
  { value: 80, label: '80 znaków', description: 'Bardzo krótki' },
  { value: 120, label: '120 znaków', description: 'Krótki' },
  { value: 160, label: '160 znaków', description: 'Średni' },
  { value: 200, label: '200 znaków', description: 'Długi' }
]

const toggleField = (fieldId: string) => {
  if (selectionMode.value === 'include') {
    excludedFields.value.delete(fieldId)
    if (includedFields.value.has(fieldId)) {
      includedFields.value.delete(fieldId)
    } else {
      includedFields.value.add(fieldId)
    }
  } else if (selectionMode.value === 'exclude') {
    includedFields.value.delete(fieldId)
    if (excludedFields.value.has(fieldId)) {
      excludedFields.value.delete(fieldId)
    } else {
      excludedFields.value.add(fieldId)
    }
  }
}

const getFieldStatus = (fieldId: string): 'included' | 'excluded' | 'neutral' => {
  if (includedFields.value.has(fieldId)) return 'included'
  if (excludedFields.value.has(fieldId)) return 'excluded'
  return 'neutral'
}

const setMode = (mode: SelectionMode) => {
  selectionMode.value = selectionMode.value === mode ? 'none' : mode
}

const generatedPrompt = computed(() => {
  const includedList = Array.from(includedFields.value)
    .map(id => {
      const field = fieldOptions.value.find(f => f.id === id)
      return field ? `- ${field.label}: ${field.getValue()}` : null
    })
    .filter(Boolean)
    .join('\n')

  const excludedList = Array.from(excludedFields.value)
    .map(id => {
      const field = fieldOptions.value.find(f => f.id === id)
      return field ? `- ${field.label}` : null
    })
    .filter(Boolean)
    .join('\n')

  let prompt = `Przygotuj marketingowy opis oferty dla tego ogłoszenia lokalu usługowego.\n\nDługość opisu: około ${descriptionLength.value} znaków.`

  if (includedList) {
    prompt += `\n\nKoniecznie zawrzyj w opisie:\n${includedList}`
  }

  if (excludedList) {
    prompt += `\n\nPomiń w opisie:\n${excludedList}`
  }

  return prompt
})

const copyPrompt = async () => {
  try {
    await navigator.clipboard.writeText(generatedPrompt.value)
  } catch (e) {
    console.error('Failed to copy:', e)
  }
}

const clearSelections = () => {
  includedFields.value.clear()
  excludedFields.value.clear()
  selectionMode.value = 'none'
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center gap-2 mb-4">
      <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-purple-500" />
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Generator promptu</h2>
    </div>

    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
      Przygotuj marketingowy opis oferty dla tego ogłoszenia
    </p>

    <!-- Mode selector -->
    <div class="flex items-center gap-2 mb-4">
      <UButton
        :color="selectionMode === 'include' ? 'success' : 'neutral'"
        :variant="selectionMode === 'include' ? 'solid' : 'outline'"
        size="sm"
        icon="i-heroicons-check-circle"
        @click="setMode('include')"
      >
        Zawrzyj
      </UButton>
      <UButton
        :color="selectionMode === 'exclude' ? 'error' : 'neutral'"
        :variant="selectionMode === 'exclude' ? 'solid' : 'outline'"
        size="sm"
        icon="i-heroicons-x-circle"
        @click="setMode('exclude')"
      >
        Pomiń
      </UButton>
      <UButton
        v-if="includedFields.size > 0 || excludedFields.size > 0"
        color="neutral"
        variant="ghost"
        size="sm"
        icon="i-heroicons-trash"
        @click="clearSelections"
      >
        Wyczyść
      </UButton>
    </div>

    <!-- Instruction -->
    <div v-if="selectionMode !== 'none'" class="mb-4 p-3 rounded-lg" :class="selectionMode === 'include' ? 'bg-green-50 dark:bg-green-950/30' : 'bg-red-50 dark:bg-red-950/30'">
      <p class="text-sm" :class="selectionMode === 'include' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
        <UIcon :name="selectionMode === 'include' ? 'i-heroicons-cursor-arrow-rays' : 'i-heroicons-cursor-arrow-rays'" class="w-4 h-4 inline mr-1" />
        Kliknij na pola poniżej, aby {{ selectionMode === 'include' ? 'dodać je do listy wymaganych' : 'dodać je do listy pomijanych' }}
      </p>
    </div>

    <!-- Field selector grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
      <button
        v-for="field in fieldOptions"
        :key="field.id"
        type="button"
        :disabled="selectionMode === 'none'"
        :class="[
          'p-3 rounded-lg border text-left transition-all text-sm',
          selectionMode === 'none' ? 'cursor-default opacity-60' : 'cursor-pointer hover:shadow-md',
          getFieldStatus(field.id) === 'included'
            ? 'bg-green-100 dark:bg-green-900/40 border-green-500 text-green-800 dark:text-green-200'
            : getFieldStatus(field.id) === 'excluded'
            ? 'bg-red-100 dark:bg-red-900/40 border-red-500 text-red-800 dark:text-red-200'
            : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
        ]"
        @click="toggleField(field.id)"
      >
        <div class="flex items-center justify-between">
          <span class="font-medium">{{ field.label }}</span>
          <UIcon
            v-if="getFieldStatus(field.id) === 'included'"
            name="i-heroicons-check-circle-solid"
            class="w-4 h-4 text-green-600 dark:text-green-400"
          />
          <UIcon
            v-else-if="getFieldStatus(field.id) === 'excluded'"
            name="i-heroicons-x-circle-solid"
            class="w-4 h-4 text-red-600 dark:text-red-400"
          />
        </div>
        <p class="text-xs mt-1 opacity-75">{{ field.getValue() }}</p>
      </button>
    </div>

    <!-- Description length selector -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Długość opisu
      </label>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="option in lengthOptions"
          :key="option.value"
          type="button"
          :class="[
            'p-3 rounded-lg border text-center transition-all',
            descriptionLength === option.value
              ? 'bg-primary-100 dark:bg-primary-900/40 border-primary-500 text-primary-800 dark:text-primary-200'
              : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
          ]"
          @click="descriptionLength = option.value"
        >
          <p class="font-bold text-lg">{{ option.value }}</p>
          <p class="text-xs opacity-75">{{ option.description }}</p>
        </button>
      </div>
    </div>

    <!-- Generated prompt preview -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Wygenerowany prompt
      </label>
      <div class="relative">
        <pre class="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm whitespace-pre-wrap overflow-x-auto font-mono">{{ generatedPrompt }}</pre>
      </div>
    </div>

    <!-- Copy button -->
    <UButton
      color="primary"
      icon="i-heroicons-clipboard-document"
      block
      @click="copyPrompt"
    >
      Kopiuj prompt
    </UButton>
  </div>
</template>

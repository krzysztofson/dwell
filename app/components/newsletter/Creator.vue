<script setup lang="ts">
import type { Location } from '~/composables/useLocations'

interface Props {
  modelValue: {
    title: string
    subject: string
    intro: string
    locationIds: string[]
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: Props['modelValue']]
}>()

const newsletter = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isGeneratingIntro = ref(false)
const isSelectorOpen = ref(false)

const { getLocationById } = useLocations()

const selectedLocations = computed(() => {
  return newsletter.value.locationIds
    .map(id => getLocationById(id))
    .filter((l): l is Location => l !== undefined)
})

const generateIntro = async () => {
  isGeneratingIntro.value = true
  await new Promise(resolve => setTimeout(resolve, 1500))
  newsletter.value = {
    ...newsletter.value,
    intro: `Cześć! Mamy dla Ciebie ${selectedLocations.value.length} wyjątkowych propozycji lokali usługowych. Każdy z nich został starannie wyselekcjonowany i oceniony przez nasz system AI, aby dopasować się do Twoich potrzeb biznesowych.`
  }
  isGeneratingIntro.value = false
}

const removeLocation = (id: string) => {
  newsletter.value = {
    ...newsletter.value,
    locationIds: newsletter.value.locationIds.filter(i => i !== id)
  }
}

const formatRent = (rent: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0
  }).format(rent)
}

const segmentOptions = [
  { label: 'Wszyscy subskrybenci', id: 'all' },
  { label: 'Aktywni (otworzyli ostatnie 3 newslettery)', id: 'active' },
  { label: 'Zainteresowani Śródmieściem', id: 'centrum' },
  { label: 'Szukający dużych powierzchni (>100m²)', id: 'large' }
]

const selectedSegment = ref(segmentOptions[0])
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h3 class="font-semibold text-gray-900 dark:text-white">Szczegóły newslettera</h3>
    </div>

    <div class="p-4 space-y-6">
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tytuł wewnętrzny
        </label>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Nazwa widoczna tylko w systemie</p>
        <UInput
          v-model="newsletter.title"
          placeholder="np. Najlepsze oferty tygodnia #14"
          class="w-full"
        />
      </div>

      <!-- Subject -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Temat wiadomości
        </label>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">To zobaczy odbiorca w skrzynce</p>
        <UInput
          v-model="newsletter.subject"
          placeholder="np. Odkryj najlepsze lokale usługowe w Warszawie"
          class="w-full"
        />
      </div>

      <!-- Segment -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Segment odbiorców
        </label>
        <USelectMenu
          v-model="selectedSegment"
          :items="segmentOptions"
          value-key="id"
          class="w-full"
        />
      </div>

      <!-- Intro -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Wstęp
        </label>
        <div class="space-y-2">
          <UTextarea
            v-model="newsletter.intro"
            placeholder="Wstęp do newslettera..."
            :rows="3"
            class="w-full"
          />
          <UButton
            color="neutral"
            variant="soft"
            size="sm"
            icon="i-heroicons-sparkles"
            :loading="isGeneratingIntro"
            @click="generateIntro"
          >
            {{ isGeneratingIntro ? 'Generowanie...' : 'Wygeneruj AI' }}
          </UButton>
        </div>
      </div>

      <!-- Selected locations -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Wybrane lokale ({{ selectedLocations.length }})
          </label>
          <UButton
            color="primary"
            variant="soft"
            size="sm"
            icon="i-heroicons-plus"
            @click="isSelectorOpen = true"
          >
            Dodaj lokale
          </UButton>
        </div>

        <div v-if="selectedLocations.length > 0" class="space-y-2">
          <div
            v-for="location in selectedLocations"
            :key="location.id"
            class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 dark:text-white text-sm truncate">
                {{ location.address }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ location.district }} • {{ location.area }}m² • {{ formatRent(location.rent) }}
              </p>
            </div>
            <UButton
              color="neutral"
              variant="ghost"
              size="xs"
              icon="i-heroicons-x-mark"
              @click="removeLocation(location.id)"
            />
          </div>
        </div>

        <div v-else class="text-center py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          <UIcon name="i-heroicons-building-storefront" class="w-8 h-8 mx-auto text-gray-300" />
          <p class="mt-2 text-sm text-gray-500">Nie wybrano żadnych lokali</p>
          <UButton
            color="primary"
            variant="soft"
            size="sm"
            class="mt-3"
            icon="i-heroicons-plus"
            @click="isSelectorOpen = true"
          >
            Wybierz lokale
          </UButton>
        </div>
      </div>
    </div>

    <!-- Location selector modal -->
    <NewsletterOfferSelector
      v-model="newsletter.locationIds"
      v-model:open="isSelectorOpen"
    />
  </div>
</template>

<script setup lang="ts">
import type { Location } from '~/composables/useLocations'

interface Props {
  title: string
  subject: string
  intro: string
  locations: Location[]
}

const props = defineProps<Props>()

const formatRent = (rent: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0
  }).format(rent)
}
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="font-semibold text-gray-900 dark:text-white">Podgląd emaila</h3>
      <UBadge color="info" variant="subtle">Wersja desktopowa</UBadge>
    </div>

    <!-- Email preview -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
      <!-- Email header -->
      <div class="bg-gradient-to-r from-primary-600 to-primary-500 p-6 text-white">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <UIcon name="i-heroicons-building-storefront" class="w-6 h-6" />
          </div>
          <span class="font-semibold">Portal Lokali</span>
        </div>
        <h1 class="text-2xl font-bold">{{ title || 'Tytuł newslettera' }}</h1>
        <p class="mt-2 text-white/80">{{ subject || 'Temat wiadomości' }}</p>
      </div>

      <!-- Email content -->
      <div class="p-6">
        <!-- Intro -->
        <p class="text-gray-600 mb-6">
          {{ intro || 'Cześć! Mamy dla Ciebie nowe propozycje lokali usługowych dopasowane do Twoich preferencji.' }}
        </p>

        <!-- Locations -->
        <div v-if="locations.length > 0" class="space-y-4">
          <div
            v-for="location in locations"
            :key="location.id"
            class="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div class="flex">
              <div class="w-32 h-24 bg-gray-100 flex-shrink-0">
                <img
                  :src="location.images[0] || 'https://placehold.co/150x100/e2e8f0/64748b?text=Lokal'"
                  :alt="location.address"
                  class="w-full h-full object-cover"
                >
              </div>
              <div class="p-3 flex-1">
                <h3 class="font-semibold text-gray-900">{{ location.address }}</h3>
                <p class="text-sm text-gray-500">{{ location.district }}, {{ location.city }}</p>
                <div class="mt-2 flex items-center gap-3 text-sm">
                  <span class="text-gray-600">{{ location.area }} m²</span>
                  <span class="text-gray-400">•</span>
                  <span class="font-semibold text-primary-600">{{ formatRent(location.rent) }}/mies.</span>
                </div>
                <div v-if="location.aiScore !== null" class="mt-1">
                  <span
                    :class="[
                      'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium',
                      location.aiScore >= 8 ? 'bg-green-100 text-green-700' :
                      location.aiScore >= 6 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    ]"
                  >
                    Ocena: {{ location.aiScore.toFixed(1) }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="location.aiDescription" class="px-3 pb-3">
              <p class="text-sm text-gray-600 line-clamp-2">{{ location.aiDescription }}</p>
            </div>
            <div class="px-3 pb-3">
              <a href="#" class="text-sm font-medium text-primary-600 hover:text-primary-700">
                Zobacz szczegóły →
              </a>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <UIcon name="i-heroicons-building-storefront" class="w-8 h-8 mx-auto text-gray-300" />
          <p class="mt-2 text-sm text-gray-500">Wybierz lokale do newslettera</p>
        </div>

        <!-- CTA -->
        <div class="mt-6 text-center">
          <a
            href="#"
            class="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Zobacz wszystkie oferty
          </a>
        </div>
      </div>

      <!-- Email footer -->
      <div class="bg-gray-50 p-6 text-center text-sm text-gray-500">
        <p>Portal Lokali Usługowych</p>
        <p class="mt-1">ul. Przykładowa 123, 00-001 Warszawa</p>
        <p class="mt-3">
          <a href="#" class="text-primary-600 hover:underline">Wypisz się</a>
          <span class="mx-2">•</span>
          <a href="#" class="text-primary-600 hover:underline">Polityka prywatności</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { newsletters, totalStats } = useNewsletters()
</script>

<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Newsletter</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Zarządzaj i wysyłaj newslettery z ofertami lokali
        </p>
      </div>
      <UButton to="/newsletter/create" color="primary" icon="i-heroicons-plus">
        Nowy newsletter
      </UButton>
    </div>

    <!-- Stats -->
    <div v-if="totalStats" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <UCard>
        <div class="text-center">
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ totalStats.totalNewsletters }}
          </p>
          <p class="text-sm text-gray-500">Wysłanych newsletterów</p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ totalStats.totalSent.toLocaleString('pl-PL') }}
          </p>
          <p class="text-sm text-gray-500">Łącznie wysłano</p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <p
            :class="[
              'text-3xl font-bold',
              totalStats.avgOpenRate >= 40 ? 'text-green-600' :
              totalStats.avgOpenRate >= 25 ? 'text-amber-600' : 'text-red-600'
            ]"
          >
            {{ totalStats.avgOpenRate }}%
          </p>
          <p class="text-sm text-gray-500">Średni open rate</p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <p
            :class="[
              'text-3xl font-bold',
              totalStats.avgClickRate >= 15 ? 'text-green-600' :
              totalStats.avgClickRate >= 10 ? 'text-amber-600' : 'text-red-600'
            ]"
          >
            {{ totalStats.avgClickRate }}%
          </p>
          <p class="text-sm text-gray-500">Średni click rate</p>
        </div>
      </UCard>
    </div>

    <!-- Newsletter list -->
    <NewsletterList :newsletters="newsletters" />
  </div>
</template>

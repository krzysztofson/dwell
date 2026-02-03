<script setup lang="ts">
import type { Newsletter } from '~/composables/useNewsletters'

interface Props {
  newsletters: Newsletter[]
}

defineProps<Props>()

const formatDate = (date: string | null) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getStatusBadge = (status: string) => {
  if (status === 'sent') {
    return { label: 'Wysłany', color: 'success' as const }
  }
  return { label: 'Szkic', color: 'warning' as const }
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-gray-900 dark:text-white">Historia newsletterów</h3>
        <UButton to="/newsletter/create" color="primary" size="sm" icon="i-heroicons-plus">
          Nowy newsletter
        </UButton>
      </div>
    </template>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tytuł
            </th>
            <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Wysłano
            </th>
            <th class="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lokale
            </th>
            <th class="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Wysłano do
            </th>
            <th class="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Open Rate
            </th>
            <th class="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Click Rate
            </th>
            <th class="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Akcje
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="newsletter in newsletters"
            :key="newsletter.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <td class="py-4 px-4">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ newsletter.title }}</p>
                <p v-if="newsletter.subject" class="text-sm text-gray-500 truncate max-w-xs">
                  {{ newsletter.subject }}
                </p>
              </div>
            </td>
            <td class="py-4 px-4">
              <UBadge
                :color="getStatusBadge(newsletter.status).color"
                variant="subtle"
              >
                {{ getStatusBadge(newsletter.status).label }}
              </UBadge>
            </td>
            <td class="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">
              {{ formatDate(newsletter.sentAt) }}
            </td>
            <td class="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-300">
              {{ newsletter.locationIds.length }}
            </td>
            <td class="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-300">
              {{ newsletter.stats?.sent?.toLocaleString('pl-PL') || '-' }}
            </td>
            <td class="py-4 px-4 text-center">
              <span
                v-if="newsletter.stats"
                :class="[
                  'text-sm font-medium',
                  newsletter.stats.openRate >= 40 ? 'text-green-600' :
                  newsletter.stats.openRate >= 25 ? 'text-amber-600' : 'text-red-600'
                ]"
              >
                {{ newsletter.stats.openRate }}%
              </span>
              <span v-else class="text-sm text-gray-400">-</span>
            </td>
            <td class="py-4 px-4 text-center">
              <span
                v-if="newsletter.stats"
                :class="[
                  'text-sm font-medium',
                  newsletter.stats.clickRate >= 15 ? 'text-green-600' :
                  newsletter.stats.clickRate >= 10 ? 'text-amber-600' : 'text-red-600'
                ]"
              >
                {{ newsletter.stats.clickRate }}%
              </span>
              <span v-else class="text-sm text-gray-400">-</span>
            </td>
            <td class="py-4 px-4 text-right">
              <UDropdownMenu
                :items="[[
                  { label: 'Podgląd', icon: 'i-heroicons-eye' },
                  { label: 'Duplikuj', icon: 'i-heroicons-document-duplicate' }
                ], [
                  { label: 'Usuń', icon: 'i-heroicons-trash', color: 'error' as const }
                ]]"
              >
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-ellipsis-vertical"
                  size="sm"
                />
              </UDropdownMenu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-if="newsletters.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-envelope" class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Brak newsletterów</h3>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Stwórz swój pierwszy newsletter
      </p>
      <UButton to="/newsletter/create" color="primary" class="mt-4" icon="i-heroicons-plus">
        Nowy newsletter
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Alert {
  id: string
  type: 'warning' | 'info' | 'success' | 'error'
  message: string
  action: string
  link: string
}

interface Props {
  alerts: Alert[]
}

defineProps<Props>()

const getAlertColor = (type: string) => {
  const colors: Record<string, 'warning' | 'info' | 'success' | 'error'> = {
    warning: 'warning',
    info: 'info',
    success: 'success',
    error: 'error'
  }
  return colors[type] || 'info'
}

const getAlertIcon = (type: string) => {
  const icons: Record<string, string> = {
    warning: 'i-heroicons-exclamation-triangle',
    info: 'i-heroicons-information-circle',
    success: 'i-heroicons-check-circle',
    error: 'i-heroicons-x-circle'
  }
  return icons[type] || 'i-heroicons-information-circle'
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-bell-alert" class="w-5 h-5 text-gray-500" />
        <h3 class="font-semibold text-gray-900 dark:text-white">Alerty</h3>
      </div>
    </template>

    <div class="space-y-3">
      <UAlert
        v-for="alert in alerts"
        :key="alert.id"
        :color="getAlertColor(alert.type)"
        :icon="getAlertIcon(alert.type)"
        :title="alert.message"
        variant="subtle"
      >
        <template #actions>
          <UButton
            :to="alert.link"
            :color="getAlertColor(alert.type)"
            variant="link"
            size="xs"
            class="font-medium"
          >
            {{ alert.action }}
          </UButton>
        </template>
      </UAlert>
    </div>
  </UCard>
</template>

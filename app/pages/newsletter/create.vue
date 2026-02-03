<script setup lang="ts">
import type { Location } from '~/composables/useLocations'

const router = useRouter()

const newsletter = ref({
  title: '',
  subject: '',
  intro: '',
  locationIds: [] as string[]
})

const { getLocationById } = useLocations()

const selectedLocations = computed(() => {
  return newsletter.value.locationIds
    .map(id => getLocationById(id))
    .filter((l): l is Location => l !== undefined)
})

const isSending = ref(false)
const isSavingDraft = ref(false)

const canSend = computed(() => {
  return (
    newsletter.value.title.trim() !== '' &&
    newsletter.value.subject.trim() !== '' &&
    newsletter.value.locationIds.length > 0
  )
})

const saveDraft = async () => {
  isSavingDraft.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  isSavingDraft.value = false
  useToast().add({
    title: 'Zapisano szkic',
    description: 'Newsletter został zapisany jako szkic',
    color: 'success'
  })
}

const sendNewsletter = async () => {
  isSending.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  isSending.value = false
  useToast().add({
    title: 'Newsletter wysłany!',
    description: 'Newsletter został pomyślnie wysłany do subskrybentów',
    color: 'success'
  })
  router.push('/newsletter')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <UButton
          to="/newsletter"
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-left"
        />
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Nowy newsletter</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Stwórz i wyślij newsletter z wybranymi lokalami
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          color="neutral"
          variant="outline"
          :loading="isSavingDraft"
          icon="i-heroicons-document"
          @click="saveDraft"
        >
          Zapisz szkic
        </UButton>
        <UButton
          color="primary"
          :loading="isSending"
          :disabled="!canSend"
          icon="i-heroicons-paper-airplane"
          @click="sendNewsletter"
        >
          Wyślij newsletter
        </UButton>
      </div>
    </div>

    <!-- Validation alert -->
    <UAlert
      v-if="!canSend"
      color="warning"
      icon="i-heroicons-exclamation-triangle"
      title="Uzupełnij wymagane pola"
      description="Aby wysłać newsletter, uzupełnij tytuł, temat i wybierz przynajmniej jeden lokal."
    />

    <!-- Two column layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left: Creator form -->
      <div>
        <NewsletterCreator v-model="newsletter" />
      </div>

      <!-- Right: Preview -->
      <div class="lg:sticky lg:top-24 lg:self-start">
        <NewsletterEmailPreview
          :title="newsletter.title"
          :subject="newsletter.subject"
          :intro="newsletter.intro"
          :locations="selectedLocations"
        />
      </div>
    </div>
  </div>
</template>

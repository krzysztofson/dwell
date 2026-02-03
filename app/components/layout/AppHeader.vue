<script setup lang="ts">
const emit = defineEmits<{
  toggleMobileMenu: []
}>()

const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (value) => {
    colorMode.preference = value ? 'dark' : 'light'
  }
})

const user = {
  name: 'Marcin Kowalski',
  email: 'marcin@dwell.pl',
  avatar: null
}

const userMenuItems = [
  [{
    label: 'Ustawienia',
    icon: 'i-heroicons-cog-6-tooth',
    click: () => {}
  }],
  [{
    label: 'Wyloguj',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: () => {}
  }]
]
</script>

<template>
  <div class="flex items-center justify-between h-16 px-4 lg:px-6">
    <!-- Mobile menu button -->
    <UButton
      class="lg:hidden"
      color="neutral"
      variant="ghost"
      icon="i-heroicons-bars-3"
      @click="emit('toggleMobileMenu')"
    />

    <!-- Breadcrumb / Page title (optional) -->
    <div class="hidden lg:block" />

    <!-- Right side -->
    <div class="flex items-center gap-4">
      <!-- Search -->
      <UInput
        placeholder="Szukaj lokalu..."
        icon="i-heroicons-magnifying-glass"
        class="hidden md:block w-64"
      />

      <!-- Dark mode toggle -->
      <UButton
        color="neutral"
        variant="ghost"
        :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
        @click="isDark = !isDark"
      />

      <!-- Notifications -->
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-heroicons-bell"
      >
        <template #trailing>
          <UBadge color="error" size="xs" variant="solid">3</UBadge>
        </template>
      </UButton>

      <!-- User menu -->
      <UDropdownMenu :items="userMenuItems">
        <UButton color="neutral" variant="ghost" class="p-1">
          <UAvatar
            :alt="user.name"
            size="sm"
          />
          <span class="hidden md:inline ml-2 text-sm font-medium">{{ user.name }}</span>
          <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 ml-1" />
        </UButton>
      </UDropdownMenu>
    </div>
  </div>
</template>

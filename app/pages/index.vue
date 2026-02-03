<script setup lang="ts">
const { kpis, alerts, scoreHistory, topLocations } = useDashboard()
</script>

<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Przegląd portalu lokali usługowych
      </p>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardKpiCard
        label="Wszystkie lokale"
        :value="kpis.totalLocations"
        icon="i-heroicons-building-storefront"
        color="primary"
      />
      <DashboardKpiCard
        label="Ocenione przez AI"
        :value="`${kpis.evaluatedCount} (${kpis.evaluatedPercent}%)`"
        icon="i-heroicons-cpu-chip"
        color="info"
        :trend="5"
        trend-label="vs poprzedni tydzień"
      />
      <DashboardKpiCard
        label="Średnia ocena AI"
        :value="kpis.avgScore.toFixed(1)"
        icon="i-heroicons-star"
        color="success"
        :trend="2"
        trend-label="vs poprzedni miesiąc"
      />
      <DashboardKpiCard
        label="Newslettery w tym miesiącu"
        :value="kpis.newslettersSentThisMonth"
        icon="i-heroicons-envelope"
        color="warning"
      />
    </div>

    <!-- Alerts and Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1">
        <DashboardAlertsList :alerts="alerts" />
      </div>
      <div class="lg:col-span-2">
        <DashboardScoreChart :data="scoreHistory" />
      </div>
    </div>

    <!-- Revenue and Transactions Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DashboardRevenueChart />
      <DashboardTransactionsChart />
    </div>

    <!-- Top locations and Quick actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <DashboardTopLocationsTable :locations="topLocations" />
      </div>
      <div class="lg:col-span-1">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-bolt" class="w-5 h-5 text-gray-500" />
              <h3 class="font-semibold text-gray-900 dark:text-white">Szybkie akcje</h3>
            </div>
          </template>

          <div class="space-y-3">
            <UButton
              to="/locations?status=new"
              color="primary"
              variant="soft"
              block
              size="lg"
              icon="i-heroicons-sparkles"
            >
              Oceń nowe lokale
            </UButton>
            <UButton
              to="/newsletter/create"
              color="success"
              variant="soft"
              block
              size="lg"
              icon="i-heroicons-paper-airplane"
            >
              Stwórz newsletter
            </UButton>
            <UButton
              to="/locations"
              color="neutral"
              variant="soft"
              block
              size="lg"
              icon="i-heroicons-magnifying-glass"
            >
              Przeglądaj lokale
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

import dashboardData from '~/data/dashboard.json'
import locationsData from '~/data/locations.json'

export function useDashboard() {
  const kpis = ref(dashboardData.kpis)
  const alerts = ref(dashboardData.alerts)
  const scoreHistory = ref(dashboardData.scoreHistory)

  const topLocations = computed(() => {
    return locationsData
      .filter(loc => loc.aiScore !== null)
      .sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))
      .slice(0, 5)
  })

  return {
    kpis,
    alerts,
    scoreHistory,
    topLocations
  }
}

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const colorMode = useColorMode()

const months = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru']
const yearlyTarget = 50

// Current date info
const now = new Date()
const currentMonth = now.getMonth()
const currentDay = now.getDate()
const daysInCurrentMonth = new Date(now.getFullYear(), currentMonth + 1, 0).getDate()
const currentDate = now.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })

// Pozycja w roku jako ułamek (0-11 dla indeksów)
const dayProgress = currentDay / daysInCurrentMonth
const currentPosition = currentMonth + dayProgress

// Target line - równomierny wzrost do 50 transakcji
// Używamy {x, y} format dla linear x-axis, x: 1-12 odpowiada końcowi każdego miesiąca
const targetData = months.map((_, i) => ({ x: i + 1, y: Math.round((yearlyTarget / 12) * (i + 1) * 10) / 10 }))

// Actual transactions na koniec każdego pełnego miesiąca
const monthlyTransactions = [14, 15, 14, 15, 14, 15, 14, 14, 15, 14, 14, 14]
const cumulativeTransactions: number[] = []
monthlyTransactions.reduce((acc, val, i) => {
  cumulativeTransactions[i] = acc + val
  return cumulativeTransactions[i]
}, 0)

// Aktualna wartość (proporcjonalna do dnia w miesiącu)
const previousMonthTotal = currentMonth > 0 ? cumulativeTransactions[currentMonth - 1] : 0
const currentMonthProgress = monthlyTransactions[currentMonth] * dayProgress
const currentTransactions = Math.round(previousMonthTotal + currentMonthProgress)

// Dane dla wykresu z {x, y} - punkt startowy + pełne miesiące + aktualny punkt na dokładnej pozycji
const actualData: { x: number; y: number }[] = []
// Zawsze zaczynamy od 0
actualData.push({ x: 0, y: 0 })
// Dodaj pełne miesiące
for (let i = 0; i < currentMonth; i++) {
  actualData.push({ x: i + 1, y: cumulativeTransactions[i] })
}
// Dodaj aktualny punkt na proporcjonalnej pozycji w bieżącym miesiącu
actualData.push({ x: currentPosition + 1, y: currentTransactions })

// Point radius - większy dla aktualnego punktu
const pointRadiusData = actualData.map((_, i) => i === actualData.length - 1 ? 8 : 4)
const pointBorderWidthData = actualData.map((_, i) => i === actualData.length - 1 ? 3 : 2)

const chartData = computed(() => ({
  datasets: [
    {
      label: 'Cel roczny',
      data: targetData,
      borderColor: '#9ca3af',
      backgroundColor: 'transparent',
      borderDash: [5, 5],
      tension: 0,
      pointRadius: 0,
      borderWidth: 2
    },
    {
      label: 'Transakcje',
      data: actualData,
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      fill: 'origin',
      tension: 0.3,
      pointBackgroundColor: '#6366f1',
      pointBorderColor: '#fff',
      pointBorderWidth: pointBorderWidthData,
      pointRadius: pointRadiusData,
      borderWidth: 3
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: colorMode.value === 'dark' ? '#9ca3af' : '#6b7280',
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: colorMode.value === 'dark' ? '#1f2937' : '#fff',
      titleColor: colorMode.value === 'dark' ? '#fff' : '#111827',
      bodyColor: colorMode.value === 'dark' ? '#9ca3af' : '#6b7280',
      borderColor: colorMode.value === 'dark' ? '#374151' : '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        title: (items: any[]) => {
          if (!items.length) return ''
          const x = items[0].raw.x
          const monthIndex = Math.floor(x) - 1
          return monthIndex >= 0 ? months[monthIndex] || '' : ''
        },
        label: (context: any) => {
          const value = context.raw?.y
          if (value === null || value === undefined) return ''
          return `${context.dataset.label}: ${value}`
        }
      }
    }
  },
  scales: {
    x: {
      type: 'linear' as const,
      min: 0,
      max: 12,
      grid: {
        display: false
      },
      ticks: {
        color: colorMode.value === 'dark' ? '#9ca3af' : '#6b7280',
        stepSize: 1,
        callback: (value: number) => value === 0 ? '' : months[value - 1] || ''
      }
    },
    y: {
      min: 0,
      max: 55,
      grid: {
        color: colorMode.value === 'dark' ? '#374151' : '#f3f4f6'
      },
      ticks: {
        color: colorMode.value === 'dark' ? '#9ca3af' : '#6b7280',
        stepSize: 10
      }
    }
  }
}))

const targetAtCurrentPosition = Math.round((yearlyTarget / 12) * (currentPosition + 1) * 10) / 10
const percentOfTarget = Math.round((currentTransactions / targetAtCurrentPosition) * 100)
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-document-check" class="w-5 h-5 text-gray-500" />
          <h3 class="font-semibold text-gray-900 dark:text-white">Transakcje</h3>
        </div>
        <div class="flex items-center gap-2">
          <UBadge :color="percentOfTarget >= 100 ? 'success' : percentOfTarget >= 90 ? 'warning' : 'error'" variant="subtle">
            {{ percentOfTarget }}% celu
          </UBadge>
        </div>
      </div>
    </template>

    <div class="h-64">
      <Line :data="chartData" :options="chartOptions" />
    </div>

    <template #footer>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <p class="text-xs text-indigo-600 dark:text-indigo-400">{{ currentDate }}</p>
            <p class="text-lg font-bold text-indigo-700 dark:text-indigo-300">{{ currentTransactions }} transakcji</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-xs text-gray-500 dark:text-gray-400">Cel roczny</p>
          <p class="text-lg font-semibold text-gray-900 dark:text-white">50 transakcji</p>
        </div>
      </div>
    </template>
  </UCard>
</template>

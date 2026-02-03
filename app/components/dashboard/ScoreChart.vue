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

interface ScoreData {
  week: string
  avgScore: number
  count: number
}

interface Props {
  data: ScoreData[]
}

const props = defineProps<Props>()

const colorMode = useColorMode()

const chartData = computed(() => ({
  labels: props.data.map(d => d.week),
  datasets: [
    {
      label: 'Średnia ocena AI',
      data: props.data.map(d => d.avgScore),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5
    },
    {
      label: 'Liczba ocen',
      data: props.data.map(d => d.count),
      borderColor: '#6366f1',
      backgroundColor: 'transparent',
      borderDash: [5, 5],
      tension: 0.4,
      pointBackgroundColor: '#6366f1',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      yAxisID: 'y1'
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
      cornerRadius: 8
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: colorMode.value === 'dark' ? '#9ca3af' : '#6b7280'
      }
    },
    y: {
      position: 'left' as const,
      min: 0,
      max: 10,
      grid: {
        color: colorMode.value === 'dark' ? '#374151' : '#f3f4f6'
      },
      ticks: {
        color: colorMode.value === 'dark' ? '#9ca3af' : '#6b7280'
      }
    },
    y1: {
      position: 'right' as const,
      min: 0,
      grid: {
        display: false
      },
      ticks: {
        color: colorMode.value === 'dark' ? '#9ca3af' : '#6b7280'
      }
    }
  }
}))
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-gray-500" />
          <h3 class="font-semibold text-gray-900 dark:text-white">Oceny AI w czasie</h3>
        </div>
        <UBadge color="success" variant="subtle">Ostatnie 4 tygodnie</UBadge>
      </div>
    </template>

    <div class="h-64">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </UCard>
</template>

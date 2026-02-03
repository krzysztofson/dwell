import locationsData from '~/data/locations.json'
import districtsData from '~/data/districts.json'

export interface LocationSpecifications {
  electricPower: number
  waterConnection: boolean
  gasConnection: boolean
  airConditioning: boolean
  heating: string
  ceilingHeight: number
  toilets: number
  parkingSpots: number
  accessibility: boolean
  alarm: boolean
  internet: boolean
}

export interface LocationOwner {
  name: string
  phone: string
  email: string
  type: 'private' | 'company' | 'agency'
}

export interface Location {
  id: string
  address: string
  district: string
  city: string
  coordinates: { lat: number; lng: number }
  area: number
  rent: number
  rentPerSqm: number
  type: string
  floor: string
  hasStorefront: boolean
  storefrontWidth: number
  condition: string
  images: string[]
  floorPlan: string | null
  aiScore: number | null
  aiSummary: string | null
  aiPros: string[] | null
  aiCons: string[] | null
  aiDescription: string | null
  status: string
  inNewsletter: boolean
  createdAt: string
  specifications: LocationSpecifications
  privateDescription: string
  publicDescription: string
  source: string
  sourceUrl: string
  owner: LocationOwner
}

export interface LocationFilters {
  search: string
  district: string[]
  type: string[]
  status: string[]
  minRent: number | null
  maxRent: number | null
  minArea: number | null
  maxArea: number | null
  minScore: number | null
  hasStorefront: boolean | null
}

export function useLocations() {
  const locations = ref<Location[]>(locationsData as Location[])
  const districts = ref(districtsData)

  const filters = ref<LocationFilters>({
    search: '',
    district: [],
    type: [],
    status: [],
    minRent: null,
    maxRent: null,
    minArea: null,
    maxArea: null,
    minScore: null,
    hasStorefront: null
  })

  const filteredLocations = computed(() => {
    return locations.value.filter(loc => {
      if (filters.value.search) {
        const search = filters.value.search.toLowerCase()
        if (!loc.address.toLowerCase().includes(search) && !loc.district.toLowerCase().includes(search)) {
          return false
        }
      }
      if (filters.value.district.length && !filters.value.district.includes(loc.district)) return false
      if (filters.value.type.length && !filters.value.type.includes(loc.type)) return false
      if (filters.value.status.length && !filters.value.status.includes(loc.status)) return false
      if (filters.value.minRent && loc.rent < filters.value.minRent) return false
      if (filters.value.maxRent && loc.rent > filters.value.maxRent) return false
      if (filters.value.minArea && loc.area < filters.value.minArea) return false
      if (filters.value.maxArea && loc.area > filters.value.maxArea) return false
      if (filters.value.minScore && (!loc.aiScore || loc.aiScore < filters.value.minScore)) return false
      if (filters.value.hasStorefront !== null && loc.hasStorefront !== filters.value.hasStorefront) return false
      return true
    })
  })

  const getLocationById = (id: string): Location | undefined => {
    return locations.value.find(loc => loc.id === id)
  }

  const resetFilters = () => {
    filters.value = {
      search: '',
      district: [],
      type: [],
      status: [],
      minRent: null,
      maxRent: null,
      minArea: null,
      maxArea: null,
      minScore: null,
      hasStorefront: null
    }
  }

  const typeOptions = [
    { label: 'Handel', value: 'retail' },
    { label: 'Usługi', value: 'service' }
  ]

  const statusOptions = [
    { label: 'Nowy', value: 'new' },
    { label: 'Oceniony', value: 'evaluated' },
    { label: 'Zweryfikowany', value: 'verified' }
  ]

  const conditionOptions = [
    { label: 'Gotowy', value: 'ready' },
    { label: 'Do adaptacji', value: 'to_adapt' }
  ]

  return {
    locations,
    districts,
    filters,
    filteredLocations,
    getLocationById,
    resetFilters,
    typeOptions,
    statusOptions,
    conditionOptions
  }
}

import newslettersData from '~/data/newsletters.json'
import locationsData from '~/data/locations.json'

export interface Newsletter {
  id: string
  title: string
  subject: string
  status: 'draft' | 'sent'
  sentAt: string | null
  locationIds: string[]
  stats: {
    sent: number
    opens: number
    clicks: number
    openRate: number
    clickRate: number
  } | null
}

export function useNewsletters() {
  const newsletters = ref<Newsletter[]>(newslettersData as Newsletter[])

  const sentNewsletters = computed(() => {
    return newsletters.value.filter(n => n.status === 'sent')
  })

  const draftNewsletters = computed(() => {
    return newsletters.value.filter(n => n.status === 'draft')
  })

  const getNewsletterById = (id: string): Newsletter | undefined => {
    return newsletters.value.find(n => n.id === id)
  }

  const getLocationsForNewsletter = (newsletter: Newsletter) => {
    return newsletter.locationIds
      .map(id => locationsData.find(loc => loc.id === id))
      .filter(Boolean)
  }

  const totalStats = computed(() => {
    const sent = sentNewsletters.value
    if (sent.length === 0) return null

    const totalSent = sent.reduce((sum, n) => sum + (n.stats?.sent ?? 0), 0)
    const totalOpens = sent.reduce((sum, n) => sum + (n.stats?.opens ?? 0), 0)
    const totalClicks = sent.reduce((sum, n) => sum + (n.stats?.clicks ?? 0), 0)

    return {
      totalNewsletters: sent.length,
      totalSent,
      avgOpenRate: totalSent > 0 ? Math.round((totalOpens / totalSent) * 100) : 0,
      avgClickRate: totalSent > 0 ? Math.round((totalClicks / totalSent) * 100 * 10) / 10 : 0
    }
  })

  return {
    newsletters,
    sentNewsletters,
    draftNewsletters,
    getNewsletterById,
    getLocationsForNewsletter,
    totalStats
  }
}

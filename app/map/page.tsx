import { prisma } from '@/lib/prisma'
import InteractiveMapSearch from '@/components/map/InteractiveMapSearch'

export const dynamic = 'force-dynamic'

async function getProperties() {
  const properties = await prisma.property.findMany({
    where: {
      status: 'ACTIVE'
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return properties
}

export default async function MapSearchPage() {
  const properties = await getProperties()

  return <InteractiveMapSearch initialProperties={properties} />
}

export const metadata = {
  title: 'Map Search - Find Properties',
  description: 'Search for properties using our interactive map with clustering, layers, and street view.',
}

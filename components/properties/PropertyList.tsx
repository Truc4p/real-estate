'use client'

import { useQuery } from '@tanstack/react-query'
import PropertyCard from './PropertyCard'
import { Property } from '@/types'

async function fetchProperties(): Promise<Property[]> {
  const res = await fetch('/api/properties')
  if (!res.ok) throw new Error('Failed to fetch properties')
  return res.json()
}

export default function PropertyList() {
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load properties. Please try again later.</p>
      </div>
    )
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No properties found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { useFavorites } from '@/lib/hooks/useFavorites'
import { Property } from '@/types'
import PropertyCard from '@/components/properties/PropertyCard'
import PropertyCardSkeleton from '@/components/skeletons/PropertyCardSkeleton'
import { Heart, Trash2 } from 'lucide-react'
import Link from 'next/link'

async function fetchPropertiesByIds(ids: string[]): Promise<Property[]> {
  if (ids.length === 0) return []
  const res = await fetch(`/api/properties?ids=${ids.join(',')}`)
  if (!res.ok) throw new Error('Failed to fetch properties')
  const data = await res.json()
  return data.properties || data
}

export default function FavoritesPage() {
  const { favorites, clearFavorites, isLoaded } = useFavorites()

  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['favoriteProperties', favorites],
    queryFn: () => fetchPropertiesByIds(favorites),
    enabled: isLoaded && favorites.length > 0,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
                My Favorites
              </h1>
              <p className="text-gray-600 mt-1">
                {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
              </p>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={clearFavorites}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            Error loading properties: {(error as Error).message}
          </div>
        )}
        
        {!isLoaded || isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">
              Start exploring properties and click the heart icon to save your favorites.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">No properties found</div>
          </div>
        )}
      </div>
    </div>
  )
}

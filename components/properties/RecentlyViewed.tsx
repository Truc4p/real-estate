'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRecentlyViewed } from '@/lib/hooks/useRecentlyViewed'
import { Property } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Clock, ChevronLeft, ChevronRight, X } from 'lucide-react'

interface RecentlyViewedProps {
  currentPropertyId?: string
}

async function fetchPropertiesByIds(ids: string[]): Promise<Property[]> {
  if (ids.length === 0) return []
  const res = await fetch(`/api/properties?ids=${ids.join(',')}`)
  if (!res.ok) throw new Error('Failed to fetch properties')
  const data = await res.json()
  return data.properties || data
}

export default function RecentlyViewed({ currentPropertyId }: RecentlyViewedProps) {
  const { getRecentPropertyIds, clearRecentProperties, isLoaded } = useRecentlyViewed()
  const [scrollPosition, setScrollPosition] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [contentWidth, setContentWidth] = useState(0)

  const recentIds = getRecentPropertyIds().filter((id) => id !== currentPropertyId)

  const { data: properties, isLoading } = useQuery({
    queryKey: ['recentProperties', recentIds],
    queryFn: () => fetchPropertiesByIds(recentIds),
    enabled: isLoaded && recentIds.length > 0,
  })

  const handleScroll = (direction: 'left' | 'right') => {
    const scrollAmount = 300
    if (direction === 'left') {
      setScrollPosition(Math.max(0, scrollPosition - scrollAmount))
    } else {
      setScrollPosition(Math.min(contentWidth - containerWidth, scrollPosition + scrollAmount))
    }
  }

  if (!isLoaded || recentIds.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">Recently Viewed</h3>
        </div>
        <button
          onClick={clearRecentProperties}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      </div>

      <div className="relative">
        {/* Navigation Buttons */}
        {scrollPosition > 0 && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        {contentWidth > containerWidth && scrollPosition < contentWidth - containerWidth && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Scrollable Container */}
        <div 
          className="overflow-hidden"
          ref={(el) => {
            if (el) setContainerWidth(el.offsetWidth)
          }}
        >
          <div 
            className="flex gap-4 transition-transform duration-300"
            style={{ transform: `translateX(-${scrollPosition}px)` }}
            ref={(el) => {
              if (el) setContentWidth(el.scrollWidth)
            }}
          >
            {isLoading ? (
              // Skeleton loaders
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-64 bg-gray-100 rounded-lg animate-pulse"
                >
                  <div className="h-36 bg-gray-200 rounded-t-lg" />
                  <div className="p-3">
                    <div className="h-5 bg-gray-200 rounded w-20 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))
            ) : (
              properties?.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="flex-shrink-0 w-64 bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="relative h-36">
                    <Image
                      src={property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={property.title}
                      fill
                      sizes="256px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        property.listingType === 'FOR_SALE'
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {property.listingType === 'FOR_SALE' ? 'Sale' : 'Rent'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-gray-900 mb-1">
                      {formatPrice(property.price)}
                      {property.listingType === 'FOR_RENT' && (
                        <span className="text-sm font-normal text-gray-600">/mo</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {property.address}, {property.city}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{property.bedrooms} bd</span>
                      <span>{property.bathrooms} ba</span>
                      <span>{property.squareFeet?.toLocaleString()} sqft</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

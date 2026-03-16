'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import PropertyCard from './PropertyCard'
import PropertyCardSkeleton from '@/components/skeletons/PropertyCardSkeleton'
import { Property } from '@/types'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

interface PropertiesResponse {
  properties: Property[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

async function fetchProperties({ pageParam = 1, queryKey }: any): Promise<PropertiesResponse> {
  const [_key, searchParamsStr] = queryKey;
  const res = await fetch(`/api/properties?page=${pageParam}&limit=12${searchParamsStr ? `&${searchParamsStr}` : ''}`)
  if (!res.ok) throw new Error('Failed to fetch properties')
  return res.json()
}

export default function PropertyList() {
  const observerRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const searchParamsStr = searchParams.toString()
  
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['properties', searchParamsStr],
    queryFn: fetchProperties,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined
    },
  })

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <PropertyCardSkeleton key={i} />
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

  const allProperties = data?.pages.flatMap((page) => page.properties) || []

  if (allProperties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No properties found.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(3)].map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={observerRef} className="h-10 mt-6" />

      {!hasNextPage && allProperties.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          You&apos;ve reached the end of the listings
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Property } from '@/types'

interface RecentProperty {
  id: string
  viewedAt: number
}

const MAX_RECENT = 10

export function useRecentlyViewed() {
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed')
    if (stored) {
      try {
        setRecentProperties(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading recently viewed:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever recent properties change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('recentlyViewed', JSON.stringify(recentProperties))
    }
  }, [recentProperties, isLoaded])

  const addRecentProperty = useCallback((propertyId: string) => {
    setRecentProperties((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p.id !== propertyId)
      
      // Add to beginning with current timestamp
      const updated = [{ id: propertyId, viewedAt: Date.now() }, ...filtered]
      
      // Keep only MAX_RECENT items
      return updated.slice(0, MAX_RECENT)
    })
  }, [])

  const clearRecentProperties = useCallback(() => {
    setRecentProperties([])
  }, [])

  const getRecentPropertyIds = useCallback(() => {
    return recentProperties.map((p) => p.id)
  }, [recentProperties])

  return {
    recentProperties,
    addRecentProperty,
    clearRecentProperties,
    getRecentPropertyIds,
    isLoaded,
  }
}

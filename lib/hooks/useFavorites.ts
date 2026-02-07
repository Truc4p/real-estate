'use client'

import { useState, useEffect, useCallback } from 'react'
import { Property } from '@/types'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('favorites')
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }
  }, [favorites, isLoaded])

  const toggleFavorite = useCallback((propertyId: string) => {
    setFavorites((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId)
      } else {
        return [...prev, propertyId]
      }
    })
  }, [])

  const isFavorite = useCallback((propertyId: string) => {
    return favorites.includes(propertyId)
  }, [favorites])

  const addFavorite = useCallback((propertyId: string) => {
    setFavorites((prev) => {
      if (!prev.includes(propertyId)) {
        return [...prev, propertyId]
      }
      return prev
    })
  }, [])

  const removeFavorite = useCallback((propertyId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== propertyId))
  }, [])

  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    isLoaded,
  }
}

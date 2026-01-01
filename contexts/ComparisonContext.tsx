'use client'

import { Property } from '@/types'
import { createContext, useContext, useState, ReactNode } from 'react'

interface ComparisonContextType {
  selectedProperties: Property[]
  addProperty: (property: Property) => void
  removeProperty: (propertyId: string) => void
  clearAll: () => void
  isSelected: (propertyId: string) => boolean
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([])

  const addProperty = (property: Property) => {
    setSelectedProperties((prev) => {
      if (prev.length >= 4) {
        alert('You can compare up to 4 properties at once')
        return prev
      }
      if (prev.some(p => p.id === property.id)) {
        return prev
      }
      return [...prev, property]
    })
  }

  const removeProperty = (propertyId: string) => {
    setSelectedProperties((prev) => prev.filter(p => p.id !== propertyId))
  }

  const clearAll = () => {
    setSelectedProperties([])
  }

  const isSelected = (propertyId: string) => {
    return selectedProperties.some(p => p.id === propertyId)
  }

  return (
    <ComparisonContext.Provider
      value={{
        selectedProperties,
        addProperty,
        removeProperty,
        clearAll,
        isSelected,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }
  return context
}

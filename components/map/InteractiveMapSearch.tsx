'use client'

import { useState } from 'react'
import { Property } from '@/types'
import MapView from './MapView'
import PropertyCard from '@/components/properties/PropertyCard'
import { X, Map as MapIcon, List } from 'lucide-react'

interface InteractiveMapSearchProps {
  initialProperties: Property[]
}

export default function InteractiveMapSearch({ initialProperties }: InteractiveMapSearchProps) {
  const [properties, setProperties] = useState(initialProperties)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split')
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(initialProperties)

  const handleBoundsChange = (bounds: mapboxgl.LngLatBounds) => {
    // Filter properties within the visible bounds
    const filtered = properties.filter(property => {
      const sw = bounds.getSouthWest()
      const ne = bounds.getNorthEast()
      return (
        property.latitude >= sw.lat &&
        property.latitude <= ne.lat &&
        property.longitude >= sw.lng &&
        property.longitude <= ne.lng
      )
    })
    setFilteredProperties(filtered)
  }

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property)
  }

  return (
    <div className="relative h-[calc(100vh-64px)]">
      {/* View Mode Toggle */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white rounded-lg shadow-lg p-1 flex gap-1">
        <button
          onClick={() => setViewMode('map')}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
            viewMode === 'map' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Map</span>
        </button>
        <button
          onClick={() => setViewMode('split')}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
            viewMode === 'split' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4v16m6-16v16" />
          </svg>
          <span className="text-sm font-medium">Split</span>
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
            viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <List className="w-4 h-4" />
          <span className="text-sm font-medium">List</span>
        </button>
      </div>

      <div className="flex h-full">
        {/* Property List Sidebar */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} h-full overflow-y-auto bg-gray-50 p-4`}>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {filteredProperties.length} Properties Found
              </h2>
              <p className="text-sm text-gray-600">
                Move the map to see properties in different areas
              </p>
            </div>

            <div className="space-y-4">
              {filteredProperties.map(property => (
                <div
                  key={property.id}
                  className={`bg-white rounded-lg overflow-hidden transition-all cursor-pointer ${
                    selectedProperty?.id === property.id
                      ? 'ring-2 ring-primary-500 shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handlePropertyClick(property)}
                >
                  <PropertyCard property={property} />
                </div>
              ))}

              {filteredProperties.length === 0 && (
                <div className="text-center py-12">
                  <MapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-600">Try zooming out or moving the map to see more properties</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Map View */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} h-full relative`}>
            <MapView
              properties={filteredProperties}
              interactive={true}
              showControls={true}
              zoom={12}
              onBoundsChange={handleBoundsChange}
              onPropertyClick={handlePropertyClick}
            />

            {/* Selected Property Card */}
            {selectedProperty && (
              <div className="absolute bottom-6 left-6 right-6 max-w-md mx-auto z-20">
                <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                  <div className="relative">
                    <button
                      onClick={() => setSelectedProperty(null)}
                      className="absolute top-2 right-2 z-10 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <PropertyCard property={selectedProperty} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

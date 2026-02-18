'use client'

import { useState } from 'react'
import { Property } from '@/types'
import MapView from './MapView'
import PropertyCard from '@/components/properties/PropertyCard'
import { X, Map as MapIcon, List, Bed, Bath, Square, MapPin, Heart } from 'lucide-react'
import { formatPrice, formatNumber } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useFavorites } from '@/lib/hooks/useFavorites'

interface InteractiveMapSearchProps {
  initialProperties: Property[]
}

// Compact list item component for list view
function PropertyListItem({ property, isSelected, onClick }: { property: Property; isSelected: boolean; onClick: () => void }) {
  const { toggleFavorite, isFavorite, isLoaded } = useFavorites()
  const favorite = isLoaded ? isFavorite(property.id) : false
  const mainImage = property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(property.id)
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer border-2 ${
        isSelected ? 'border-primary-500 shadow-md' : 'border-transparent hover:border-gray-200'
      }`}
    >
      <div className="flex gap-4 p-3">
        {/* Image */}
        <Link href={`/properties/${property.id}`} className="relative flex-shrink-0 w-48 h-36 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            sizes="200px"
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded text-xs font-bold shadow ${
              property.listingType === 'FOR_SALE' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
            }`}>
              {property.listingType === 'FOR_SALE' ? 'For Sale' : 'For Rent'}
            </span>
          </div>
          {property.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded text-xs">
              +{property.images.length - 1}
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link href={`/properties/${property.id}`} className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
                {formatPrice(property.price)}
                {property.listingType === 'FOR_RENT' && <span className="text-sm text-gray-600 font-normal">/mo</span>}
              </h3>
            </Link>
            <button
              onClick={handleFavoriteClick}
              className={`flex-shrink-0 p-2 rounded-full transition-all ${
                favorite ? 'bg-red-50 text-red-500' : 'hover:bg-gray-100 text-gray-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-2 text-gray-700">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">{property.bedrooms}</span>
              <span className="text-sm text-gray-600">bd</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">{property.bathrooms}</span>
              <span className="text-sm text-gray-600">ba</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">{formatNumber(property.squareFeet)}</span>
              <span className="text-sm text-gray-600">sqft</span>
            </div>
          </div>

          <div className="flex items-start gap-1 text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
            <span className="text-sm line-clamp-1">{property.address}, {property.city}, {property.state}</span>
          </div>

          <Link href={`/properties/${property.id}`}>
            <p className="text-sm text-gray-600 line-clamp-2 hover:text-gray-900 transition-colors">
              {property.description}
            </p>
          </Link>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
              {property.propertyType.replace('_', ' ')}
            </span>
            {property.parking && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                {property.parking}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
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
            <div className="mb-4 sticky top-0 bg-gray-50 pb-2 z-10">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {filteredProperties.length} Properties Found
              </h2>
              <p className="text-sm text-gray-600">
                Move the map to see properties in different areas
              </p>
            </div>

            <div className="space-y-3">
              {viewMode === 'list' ? (
                // List view with compact horizontal cards
                filteredProperties.map(property => (
                  <PropertyListItem
                    key={property.id}
                    property={property}
                    isSelected={selectedProperty?.id === property.id}
                    onClick={() => handlePropertyClick(property)}
                  />
                ))
              ) : (
                // Split view with vertical cards
                filteredProperties.map(property => (
                  <div
                    key={property.id}
                    className={`transition-all cursor-pointer ${
                      selectedProperty?.id === property.id
                        ? 'ring-2 ring-primary-500 rounded-lg'
                        : ''
                    }`}
                    onClick={() => handlePropertyClick(property)}
                  >
                    <PropertyCard property={property} />
                  </div>
                ))
              )}

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

'use client'

import { Property } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Bed, Bath, Square, MapPin, Eye } from 'lucide-react'
import { formatPrice, formatNumber } from '@/lib/utils'
import { useState } from 'react'
import { useComparison } from '@/contexts/ComparisonContext'
import { useFavorites } from '@/lib/hooks/useFavorites'
import QuickViewModal from './QuickViewModal'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [showQuickView, setShowQuickView] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { addProperty, removeProperty, isSelected } = useComparison()
  const { toggleFavorite, isFavorite, isLoaded } = useFavorites()
  const isCompareSelected = isSelected(property.id)
  const favorite = isLoaded ? isFavorite(property.id) : false
  const mainImage = property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'

  const handleCompareToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (e.target.checked) {
      addProperty(property)
    } else {
      removeProperty(property.id)
    }
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(property.id)
    
    // Trigger animation
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)
  }

  return (
    <>
      <div className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-56 bg-gray-200 overflow-hidden">
          <Link href={`/properties/${property.id}`} className="block w-full h-full relative">
            <Image
              src={mainImage}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={85}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </Link>
          
          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setShowQuickView(true)
            }}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <div className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:bg-gray-100 transition-colors">
              <Eye className="w-4 h-4" />
              Quick View
            </div>
          </button>
          
          {/* Favorite Button with Animation */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all z-10 ${
              favorite 
                ? 'bg-red-500 text-white scale-110' 
                : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:scale-105'
            } ${isAnimating ? 'animate-heart-beat' : ''}`}
          >
            <Heart className={`w-5 h-5 transition-transform ${favorite ? 'fill-current' : ''} ${isAnimating ? 'scale-125' : ''}`} />
          </button>
          
          {/* Compare Checkbox */}
          <div 
            className="absolute top-3 left-3"
            onClick={(e) => e.preventDefault()}
          >
            <label className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-lg cursor-pointer hover:bg-white transition-colors">
              <input
                type="checkbox"
                checked={isCompareSelected}
                onChange={handleCompareToggle}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Compare</span>
            </label>
          </div>
          
          <div className="absolute bottom-3 left-3">
            <span className={`px-3 py-1.5 rounded-md text-sm font-bold shadow-lg ${
              property.listingType === 'FOR_SALE'
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white'
            }`}>
              {property.listingType === 'FOR_SALE' ? 'For Sale' : 'For Rent'}
            </span>
          </div>
          {property.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
              +{property.images.length - 1} photos
            </div>
          )}
        </div>

        {/* Content */}
        <Link href={`/properties/${property.id}`}>
          <div className="p-4">
            <div className="mb-3">
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(property.price)}
                {property.listingType === 'FOR_RENT' && <span className="text-base text-gray-600 font-normal">/mo</span>}
              </p>
            </div>

          {/* Property Stats */}
          <div className="flex items-center gap-4 mb-3 text-gray-700">
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

          <div className="flex items-start gap-1.5 text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
            <span className="line-clamp-1">
              {property.address}, {property.city}, {property.state}
            </span>
          </div>

          {/* Property Type */}
          <div className="pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              {property.propertyType.replace('_', ' ')}
            </span>
          </div>
        </div>
        </Link>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal 
          property={property} 
          onClose={() => setShowQuickView(false)} 
        />
      )}
    </>
  )
}

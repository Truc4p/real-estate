'use client'

import { Property } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Bed, Bath, Square, MapPin } from 'lucide-react'
import { formatPrice, formatNumber } from '@/lib/utils'
import { useState } from 'react'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const mainImage = property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-56 bg-gray-200 overflow-hidden">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
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
      </div>
    </Link>
  )
}

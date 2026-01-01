'use client'

import { Property } from '@/types'
import { X, Bed, Bath, Square, MapPin, Calendar, DollarSign } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, formatNumber } from '@/lib/utils'
import { useEffect } from 'react'

interface QuickViewModalProps {
  property: Property
  onClose: () => void
}

export default function QuickViewModal({ property, onClose }: QuickViewModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const mainImage = property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Quick View</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image
                src={mainImage}
                alt={property.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
                className="object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1.5 rounded-md text-sm font-bold shadow-lg ${
                  property.listingType === 'FOR_SALE'
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}>
                  {property.listingType === 'FOR_SALE' ? 'For Sale' : 'For Rent'}
                </span>
              </div>
            </div>

            {/* Image Gallery */}
            {property.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {property.images.slice(1, 4).map((image, idx) => (
                  <div key={idx} className="relative h-24 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${property.title} ${idx + 2}`}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-4">
            {/* Price */}
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {formatPrice(property.price)}
                {property.listingType === 'FOR_RENT' && (
                  <span className="text-lg text-gray-600 font-normal">/mo</span>
                )}
              </p>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
              {property.title}
            </h3>

            {/* Location */}
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                <Bed className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="font-semibold text-gray-900">{property.bedrooms}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                <Bath className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="font-semibold text-gray-900">{property.bathrooms}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                <Square className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Square Feet</p>
                  <p className="font-semibold text-gray-900">{formatNumber(property.squareFeet)}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Year Built</p>
                  <p className="font-semibold text-gray-900">{property.yearBuilt || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600 text-sm line-clamp-4">
                {property.description}
              </p>
            </div>

            {/* Property Type */}
            <div className="pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                {property.propertyType.replace('_', ' ')}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Link
                href={`/properties/${property.id}`}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                View Full Details
              </Link>
              <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                Contact Agent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

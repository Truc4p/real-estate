'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Property } from '@/types'
import { formatPrice, formatNumber } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Bed, Bath, Square, MapPin, Calendar, DollarSign, Home, Check, X } from 'lucide-react'
import PriceComparisonChart from '@/components/properties/PriceComparisonChart'

export default function ComparePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const propertyIds = searchParams.get('properties')?.split(',') || []
    
    if (propertyIds.length < 2) {
      router.push('/properties')
      return
    }

    // Fetch properties
    Promise.all(
      propertyIds.map(id =>
        fetch(`/api/properties/${id}`).then(res => res.json())
      )
    )
      .then(data => {
        setProperties(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching properties:', error)
        setLoading(false)
      })
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading comparison...</p>
        </div>
      </div>
    )
  }

  if (properties.length < 2) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Not enough properties to compare</p>
          <Link href="/properties" className="mt-4 inline-block text-blue-600 hover:underline">
            Go back to properties
          </Link>
        </div>
      </div>
    )
  }

  const comparisonRows = [
    {
      label: 'Price',
      icon: DollarSign,
      getValue: (p: Property) => formatPrice(p.price) + (p.listingType === 'FOR_RENT' ? '/mo' : ''),
    },
    {
      label: 'Price per sqft',
      icon: DollarSign,
      getValue: (p: Property) => formatPrice(Math.round(p.price / p.squareFeet)) + '/sqft',
    },
    {
      label: 'Bedrooms',
      icon: Bed,
      getValue: (p: Property) => p.bedrooms.toString(),
    },
    {
      label: 'Bathrooms',
      icon: Bath,
      getValue: (p: Property) => p.bathrooms.toString(),
    },
    {
      label: 'Square Feet',
      icon: Square,
      getValue: (p: Property) => formatNumber(p.squareFeet) + ' sqft',
    },
    {
      label: 'Property Type',
      icon: Home,
      getValue: (p: Property) => p.propertyType.replace('_', ' '),
    },
    {
      label: 'Year Built',
      icon: Calendar,
      getValue: (p: Property) => p.yearBuilt.toString(),
    },
    {
      label: 'Listing Type',
      icon: Home,
      getValue: (p: Property) => p.listingType === 'FOR_SALE' ? 'For Sale' : 'For Rent',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Property Comparison</h1>
          <p className="text-gray-600 mt-2">Comparing {properties.length} properties</p>
        </div>

        {/* Price Charts */}
        <div className="mb-8">
          <PriceComparisonChart properties={properties} />
        </div>

        {/* Side-by-side comparison */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Property Images & Names Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
            {properties.map((property) => (
              <div key={property.id} className="space-y-3">
                <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{property.title}</h3>
                  <p className="text-sm text-gray-600 flex items-start gap-1 mt-1">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{property.address}, {property.city}</span>
                  </p>
                  <Link
                    href={`/properties/${property.id}`}
                    className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="divide-y divide-gray-200">
            {comparisonRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 ${
                  rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {properties.map((property, colIndex) => (
                  <div key={property.id} className="flex items-start gap-3">
                    {colIndex === 0 && (
                      <div className="flex items-center gap-2 min-w-[140px] text-gray-700 font-medium">
                        <row.icon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{row.label}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <span className="text-gray-900 font-semibold">{row.getValue(property)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="space-y-2">
                  <h4 className="font-medium text-gray-900 text-sm mb-3">
                    {property.address.split(',')[0]}
                  </h4>
                  <ul className="space-y-1.5">
                    {property.features.slice(0, 8).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {property.features.length > 8 && (
                    <p className="text-xs text-gray-500 mt-2">
                      +{property.features.length - 8} more features
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Amenities Comparison */}
          {properties.some(p => p.amenities.length > 0) && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property) => (
                  <div key={property.id} className="space-y-2">
                    <h4 className="font-medium text-gray-900 text-sm mb-3">
                      {property.address.split(',')[0]}
                    </h4>
                    {property.amenities.length > 0 ? (
                      <ul className="space-y-1.5">
                        {property.amenities.slice(0, 6).map((amenity, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{amenity}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No amenities listed</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

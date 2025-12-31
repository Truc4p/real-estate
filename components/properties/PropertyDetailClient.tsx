'use client'

import { Property } from '@/types'
import Image from 'next/image'
import { useState } from 'react'
import { 
  Heart, Share2, Bed, Bath, Square, Calendar, MapPin, 
  Phone, Mail, ChevronLeft, ChevronRight, X, Building2,
  Check, DollarSign, Clock, Ruler
} from 'lucide-react'
import { formatPrice, formatNumber } from '@/lib/utils'
import MapView from '@/components/map/MapView'

interface PropertyDetailClientProps {
  property: Property & {
    user: {
      id: string
      name: string | null
      email: string
      phone: string | null
      role: string
      image: string | null
    }
  }
}

export default function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const images = property.images.length > 0 
    ? property.images 
    : ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800']

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery - Redfin Style */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 relative">
          <div className="grid grid-cols-4 gap-1 h-[400px] md:h-[500px]">
            {/* Main Image */}
            <div 
              className="col-span-4 md:col-span-2 relative cursor-pointer group overflow-hidden"
              onClick={() => setShowImageModal(true)}
            >
              <Image
                src={images[0]}
                alt={property.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                priority
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity" />
            </div>

            {/* Right Grid - 4 smaller images */}
            <div className="hidden md:grid md:col-span-2 grid-cols-2 grid-rows-2 gap-1">
              {images.slice(1, 5).concat(Array(4 - Math.min(4, images.length - 1)).fill('https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800')).slice(0, 4).map((img, idx) => (
                <div 
                  key={idx}
                  className="relative cursor-pointer group overflow-hidden"
                  onClick={() => {
                    setCurrentImageIndex(idx + 1)
                    setShowImageModal(true)
                  }}
                >
                  <Image
                    src={img}
                    alt={`${property.title} ${idx + 2}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity" />
                  {idx === 3 && images.length > 5 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold">
                      +{images.length - 5} more
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* View Photos Button */}
          <button 
            onClick={() => setShowImageModal(true)}
            className="absolute top-6 right-6 bg-white px-4 py-2 rounded-md shadow-lg hover:bg-gray-50 transition-colors font-medium text-sm border border-gray-300"
          >
            View all {images.length} photos
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-4 text-white p-3 hover:bg-white/10 rounded-full"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-8">
            <Image
              src={images[currentImageIndex]}
              alt={property.title}
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white p-3 hover:bg-white/10 rounded-full"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header - Redfin Style */}
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-4xl font-bold text-gray-900">
                      {formatPrice(property.price)}
                      {property.listingType === 'FOR_RENT' && <span className="text-2xl text-gray-600 font-normal">/mo</span>}
                    </h1>
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${
                      property.listingType === 'FOR_SALE' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {property.listingType === 'FOR_SALE' ? 'For Sale' : 'For Rent'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 text-gray-700 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-5 h-5 text-gray-500" />
                      <span className="font-semibold">{property.bedrooms}</span>
                      <span className="text-gray-600">bed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-5 h-5 text-gray-500" />
                      <span className="font-semibold">{property.bathrooms}</span>
                      <span className="text-gray-600">bath</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Square className="w-5 h-5 text-gray-500" />
                      <span className="font-semibold">{formatNumber(property.squareFeet)}</span>
                      <span className="text-gray-600">sqft</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-lg">{property.address}, {property.city}, {property.state} {property.zipCode}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2.5 rounded-lg border transition-all ${
                      isFavorite 
                        ? 'bg-red-50 border-red-300 text-red-600' 
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About This Property</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Features & Amenities */}
            {property.features.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-[15px]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Property Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Property Type</p>
                    <p className="font-semibold text-gray-900">{property.propertyType.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Year Built</p>
                    <p className="font-semibold text-gray-900">{property.yearBuilt}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Listed On</p>
                    <p className="font-semibold text-gray-900">{new Date(property.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Ruler className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Lot Size</p>
                    <p className="font-semibold text-gray-900">{formatNumber(property.squareFeet)} sqft</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Location & Map</h3>
              <p className="text-gray-600 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {property.city}, {property.state}
              </p>
              <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
                <MapView 
                  latitude={property.latitude} 
                  longitude={property.longitude}
                  zoom={15}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card - Redfin Style */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sticky top-4 shadow-sm">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Contact about this property</p>
                <h3 className="text-2xl font-bold text-gray-900">Get More Information</h3>
              </div>

              {/* Agent Info */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-200">
                <div className="relative">
                  {property.user.image ? (
                    <Image
                      src={property.user.image}
                      alt={property.user.name || 'Agent'}
                      width={56}
                      height={56}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-xl">
                        {property.user.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{property.user.name || 'Real Estate Agent'}</p>
                  <p className="text-sm text-gray-600 capitalize">{property.user.role.toLowerCase()}</p>
                </div>
              </div>

              {showContactForm ? (
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      rows={4}
                      placeholder="I&apos;m interested in this property and would like more information..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-lg font-bold text-base transition-colors shadow-sm hover:shadow-md"
                  >
                    Send Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-lg font-bold text-base flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
                  >
                    <Mail className="w-5 h-5" />
                    Request Information
                  </button>
                  
                  {property.user.phone && (
                    <a
                      href={`tel:${property.user.phone}`}
                      className="block w-full border-2 border-primary-600 text-primary-600 hover:bg-primary-50 py-3.5 rounded-lg font-bold text-base text-center transition-colors"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="w-5 h-5" />
                        <span>{property.user.phone}</span>
                      </div>
                    </a>
                  )}

                  <button className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3.5 rounded-lg font-bold text-base flex items-center justify-center gap-2 transition-colors">
                    <Calendar className="w-5 h-5" />
                    Schedule a Tour
                  </button>
                </div>
              )}
            </div>

            {/* Affordability Calculator - Enhanced */}
            {property.listingType === 'FOR_RENT' && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Rental Calculator</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                    <p className="text-3xl font-bold text-gray-900">{formatPrice(property.price)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Recommended Income</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatPrice(property.price * 3)}<span className="text-base text-gray-600">/mo</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1.5">Based on 3x monthly rent guideline</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Estimated Move-in Costs</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">First Month&apos;s Rent</span>
                        <span className="font-semibold text-gray-900">{formatPrice(property.price)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Security Deposit</span>
                        <span className="font-semibold text-gray-900">{formatPrice(property.price)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">Total Due</span>
                          <span className="text-xl font-bold text-blue-600">
                            {formatPrice(property.price * 2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

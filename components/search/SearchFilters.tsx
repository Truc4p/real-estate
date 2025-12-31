'use client'

import { useState } from 'react'
import { PropertyType, ListingType, ParkingType } from '@prisma/client'

// Common amenities for real estate
const AMENITIES = [
  'Pool',
  'Gym',
  'Doorman',
  'Elevator',
  'Laundry',
  'Storage',
  'Balcony',
  'Parking',
  'Pet Friendly',
  'Security System',
  'Concierge',
  'Rooftop Access',
]

export default function SearchFilters() {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    listingType: '',
    parking: '',
    amenities: [] as string[],
    moveInDate: '',
    leaseTerm: '',
    minIncome: '',
    minCredit: '',
    hasOpenHouse: false,
    priceReduced: false,
    hasVirtualTour: false,
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      listingType: '',
      parking: '',
      amenities: [],
      moveInDate: '',
      leaseTerm: '',
      minIncome: '',
      minCredit: '',
      hasOpenHouse: false,
      priceReduced: false,
      hasVirtualTour: false,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      {/* Listing Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Listing Type
        </label>
        <select
          value={filters.listingType}
          onChange={(e) => handleFilterChange('listingType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All</option>
          <option value={ListingType.FOR_SALE}>For Sale</option>
          <option value={ListingType.FOR_RENT}>For Rent</option>
        </select>
      </div>

      {/* Property Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type
        </label>
        <select
          value={filters.propertyType}
          onChange={(e) => handleFilterChange('propertyType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Types</option>
          <option value={PropertyType.HOUSE}>House</option>
          <option value={PropertyType.APARTMENT}>Apartment</option>
          <option value={PropertyType.CONDO}>Condo</option>
          <option value={PropertyType.TOWNHOUSE}>Townhouse</option>
          <option value={PropertyType.LAND}>Land</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bedrooms
        </label>
        <select
          value={filters.bedrooms}
          onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>

      {/* Bathrooms */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bathrooms
        </label>
        <select
          value={filters.bathrooms}
          onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full mb-4 text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center"
      >
        {showAdvanced ? '− Hide' : '+ Show'} Advanced Filters
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4 pb-4 border-b border-gray-200 mb-4">
          {/* Parking */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parking
            </label>
            <select
              value={filters.parking}
              onChange={(e) => handleFilterChange('parking', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Any</option>
              <option value={ParkingType.GARAGE}>Garage</option>
              <option value={ParkingType.COVERED}>Covered</option>
              <option value={ParkingType.CARPORT}>Carport</option>
              <option value={ParkingType.STREET}>Street</option>
              <option value={ParkingType.NONE}>None</option>
            </select>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {AMENITIES.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Move-in Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Move-in Date
            </label>
            <input
              type="date"
              value={filters.moveInDate}
              onChange={(e) => handleFilterChange('moveInDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Lease Term */}
          {filters.listingType === ListingType.FOR_RENT && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lease Term (months)
              </label>
              <select
                value={filters.leaseTerm}
                onChange={(e) => handleFilterChange('leaseTerm', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Any</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="18">18 months</option>
                <option value="24">24 months</option>
              </select>
            </div>
          )}

          {/* Income Requirement */}
          {filters.listingType === ListingType.FOR_RENT && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Income Requirement
              </label>
              <input
                type="number"
                placeholder="e.g., 5000"
                value={filters.minIncome}
                onChange={(e) => handleFilterChange('minIncome', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}

          {/* Credit Score Requirement */}
          {filters.listingType === ListingType.FOR_RENT && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Credit Score Requirement
              </label>
              <input
                type="number"
                placeholder="e.g., 650"
                value={filters.minCredit}
                onChange={(e) => handleFilterChange('minCredit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}

          {/* Special Filters */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters.hasOpenHouse}
                onChange={(e) => handleFilterChange('hasOpenHouse', e.target.checked)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span>Has Open House</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters.priceReduced}
                onChange={(e) => handleFilterChange('priceReduced', e.target.checked)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span>Recently Reduced Price</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters.hasVirtualTour}
                onChange={(e) => handleFilterChange('hasVirtualTour', e.target.checked)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span>Virtual Tour Available</span>
            </label>
          </div>
        </div>
      )}

      <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md font-semibold transition-colors">
        Apply Filters
      </button>
      
      <button 
        onClick={clearFilters}
        className="w-full mt-2 text-gray-600 hover:text-gray-900 py-2"
      >
        Clear All
      </button>
    </div>
  )
}

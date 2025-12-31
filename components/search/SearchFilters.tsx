'use client'

import { useState } from 'react'
import { PropertyType, ListingType } from '@prisma/client'

export default function SearchFilters() {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    listingType: '',
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
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

      <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md font-semibold transition-colors">
        Apply Filters
      </button>
      
      <button 
        onClick={() => setFilters({
          minPrice: '',
          maxPrice: '',
          bedrooms: '',
          bathrooms: '',
          propertyType: '',
          listingType: '',
        })}
        className="w-full mt-2 text-gray-600 hover:text-gray-900 py-2"
      >
        Clear All
      </button>
    </div>
  )
}

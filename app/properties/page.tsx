import { Suspense } from 'react'
import PropertyList from '@/components/properties/PropertyList'
import SearchFilters from '@/components/search/SearchFilters'
import MapView from '@/components/map/MapView'

export default function PropertiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Properties for Sale and Rent
        </h1>
        <p className="text-gray-600">
          Browse thousands of properties
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SearchFilters />
        </div>

        {/* Properties Grid */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Showing all properties</p>
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                View Map
              </button>
            </div>
          </div>
          
          <Suspense fallback={<div>Loading...</div>}>
            <PropertyList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

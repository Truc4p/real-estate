import { Suspense } from 'react'
import PropertyList from '@/components/properties/PropertyList'
import SearchFilters from '@/components/search/SearchFilters'
import MapView from '@/components/map/MapView'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getProperties() {
  const properties = await prisma.property.findMany({
    where: {
      status: 'ACTIVE'
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          image: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return properties
}

export default async function PropertiesPage() {
  const properties = await getProperties()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Properties for Sale and Rent
          </h1>
          <p className="text-gray-600">
            {properties.length} properties available
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <SearchFilters />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Map View */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="h-[500px]">
                <MapView 
                  properties={properties}
                  interactive={true}
                  showControls={true}
                  zoom={11}
                />
              </div>
            </div>

            {/* Properties List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">All Properties</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Bedrooms</option>
                    <option>Square Feet</option>
                  </select>
                </div>
              </div>
              
              <Suspense fallback={<div>Loading...</div>}>
                <PropertyList />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

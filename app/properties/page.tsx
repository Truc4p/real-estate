import { Suspense } from 'react'
import PropertyList from '@/components/properties/PropertyList'
import SearchFilters from '@/components/search/SearchFilters'
import MapView from '@/components/map/MapView'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getProperties(searchParams: { [key: string]: string | string[] | undefined }) {
  const city = typeof searchParams.city === 'string' ? searchParams.city : undefined
  const state = typeof searchParams.state === 'string' ? searchParams.state : undefined
  const minPrice = typeof searchParams.minPrice === 'string' ? searchParams.minPrice : undefined
  const maxPrice = typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : undefined
  const propertyType = typeof searchParams.propertyType === 'string' ? searchParams.propertyType : undefined
  const listingType = typeof searchParams.listingType === 'string' ? searchParams.listingType : undefined
  const parking = typeof searchParams.parking === 'string' ? searchParams.parking : undefined
  const amenities = typeof searchParams.amenities === 'string' ? searchParams.amenities : undefined
  const moveInDate = typeof searchParams.moveInDate === 'string' ? searchParams.moveInDate : undefined
  const leaseTerm = typeof searchParams.leaseTerm === 'string' ? searchParams.leaseTerm : undefined
  const minIncome = typeof searchParams.minIncome === 'string' ? searchParams.minIncome : undefined
  const minCredit = typeof searchParams.minCredit === 'string' ? searchParams.minCredit : undefined
  const hasOpenHouse = typeof searchParams.hasOpenHouse === 'string' ? searchParams.hasOpenHouse : undefined
  const priceReduced = typeof searchParams.priceReduced === 'string' ? searchParams.priceReduced : undefined
  const hasVirtualTour = typeof searchParams.hasVirtualTour === 'string' ? searchParams.hasVirtualTour : undefined

  const where: any = {
    status: 'ACTIVE',
  }

  // Location search (combining city, neighborhood, zip functionality placeholder)
  const locationParam = typeof searchParams.location === 'string' ? searchParams.location : undefined
  if (locationParam) {
    where.OR = [
      { city: { contains: locationParam, mode: 'insensitive' } },
      { state: { contains: locationParam, mode: 'insensitive' } },
      { zipCode: { contains: locationParam, mode: 'insensitive' } },
    ]
  }

  if (city) where.city = { contains: city, mode: 'insensitive' }
  if (state) where.state = { contains: state, mode: 'insensitive' }
  
  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = parseFloat(minPrice)
    if (maxPrice) where.price.lte = parseFloat(maxPrice)
  }

  // Bedrooms and bathrooms
  const bedrooms = typeof searchParams.bedrooms === 'string' ? parseInt(searchParams.bedrooms) : undefined
  if (bedrooms) where.bedrooms = { gte: bedrooms }
  
  const bathrooms = typeof searchParams.bathrooms === 'string' ? parseInt(searchParams.bathrooms) : undefined
  if (bathrooms) where.bathrooms = { gte: bathrooms }

  if (propertyType) where.propertyType = propertyType as any
  if (listingType) where.listingType = listingType as any
  if (parking) where.parking = parking as any
  
  if (amenities) {
    const amenitiesArray = amenities.split(',')
    where.amenities = { hasEvery: amenitiesArray }
  }
  if (moveInDate) {
    where.moveInDate = { lte: new Date(moveInDate) }
  }
  if (leaseTerm) {
    where.leaseTerm = parseInt(leaseTerm)
  }
  if (minIncome) {
    where.incomeRequirement = { lte: parseFloat(minIncome) }
  }
  if (minCredit) {
    where.creditRequirement = { lte: parseInt(minCredit) }
  }
  if (hasOpenHouse === 'true') {
    where.openHouseDate = { gte: new Date() }
  }
  if (priceReduced === 'true') {
    where.priceReduced = true
  }
  if (hasVirtualTour === 'true') {
    where.virtualTourUrl = { not: null }
  }

  const properties = await prisma.property.findMany({
    where,
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

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const properties = await getProperties(searchParams)

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
              <Suspense fallback={<div>Loading filters...</div>}>
                <SearchFilters />
              </Suspense>
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

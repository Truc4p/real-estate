import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NeighborhoodData, School, CrimeData, NearbyAmenity, Demographics } from '@/types'

// Mock function to generate realistic neighborhood data
// In production, integrate with actual APIs like Walk Score, GreatSchools, etc.
async function generateNeighborhoodData(
  propertyId: string,
  latitude: number,
  longitude: number,
  city: string,
  zipCode: string
): Promise<Partial<NeighborhoodData>> {
  
  // Mock Walk/Transit/Bike scores (0-100)
  const walkScore = Math.floor(Math.random() * 40) + 60 // 60-100
  const transitScore = Math.floor(Math.random() * 50) + 40 // 40-90
  const bikeScore = Math.floor(Math.random() * 45) + 50 // 50-95

  // Mock schools data
  const schools: School[] = [
    {
      name: 'Lincoln Elementary School',
      type: 'Elementary',
      rating: Math.floor(Math.random() * 3) + 7, // 7-10
      distance: parseFloat((Math.random() * 1.5).toFixed(1)), // 0-1.5 miles
      grades: 'K-5'
    },
    {
      name: 'Washington Middle School',
      type: 'Middle',
      rating: Math.floor(Math.random() * 3) + 6, // 6-9
      distance: parseFloat((Math.random() * 2).toFixed(1)), // 0-2 miles
      grades: '6-8'
    },
    {
      name: 'Jefferson High School',
      type: 'High',
      rating: Math.floor(Math.random() * 3) + 7, // 7-10
      distance: parseFloat((Math.random() * 3 + 1).toFixed(1)), // 1-4 miles
      grades: '9-12'
    }
  ]

  // Mock crime data
  const crimeRates = ['Low', 'Medium', 'High']
  const crimeRate = crimeRates[Math.floor(Math.random() * 2)] // Bias toward Low/Medium
  const crimeScore = crimeRate === 'Low' ? 85 : crimeRate === 'Medium' ? 65 : 40
  
  const crimeData: CrimeData = {
    totalCrimes: Math.floor(Math.random() * 200) + 50,
    violentCrimes: Math.floor(Math.random() * 20) + 5,
    propertyCrimes: Math.floor(Math.random() * 150) + 30,
    yearOverYearChange: parseFloat((Math.random() * 20 - 10).toFixed(1)) // -10% to +10%
  }

  // Mock nearby amenities
  const amenityTypes: NearbyAmenity['type'][] = ['Restaurant', 'Shopping', 'Park', 'Grocery', 'Entertainment', 'Healthcare', 'Transit']
  const amenities: NearbyAmenity[] = [
    { name: 'Whole Foods Market', type: 'Grocery', distance: 0.3, rating: 4.5 },
    { name: 'Starbucks Coffee', type: 'Restaurant', distance: 0.2, rating: 4.2 },
    { name: 'Central Park', type: 'Park', distance: 0.5, rating: 4.8 },
    { name: 'CVS Pharmacy', type: 'Healthcare', distance: 0.4, rating: 4.0 },
    { name: 'Metro Station', type: 'Transit', distance: 0.3 },
    { name: 'Shopping Mall', type: 'Shopping', distance: 1.2, rating: 4.3 },
    { name: 'Movie Theater', type: 'Entertainment', distance: 0.8, rating: 4.4 },
  ]

  // Mock demographics
  const demographics: Demographics = {
    population: Math.floor(Math.random() * 50000) + 30000, // 30k-80k
    medianAge: Math.floor(Math.random() * 15) + 35, // 35-50
    medianIncome: Math.floor(Math.random() * 50000) + 60000, // $60k-$110k
    householdSize: parseFloat((Math.random() * 1.5 + 2).toFixed(1)), // 2.0-3.5
    educationLevel: ['High School', 'Some College', 'Bachelor\'s', 'Graduate'][Math.floor(Math.random() * 4)],
    employmentRate: parseFloat((Math.random() * 10 + 90).toFixed(1)) // 90-100%
  }

  // Mock area pricing
  const avgRentPrice = Math.floor(Math.random() * 1500) + 1800 // $1800-$3300
  const avgSalePrice = Math.floor(Math.random() * 300000) + 400000 // $400k-$700k
  const pricePerSqFt = Math.floor(Math.random() * 150) + 250 // $250-$400

  return {
    propertyId,
    walkScore,
    transitScore,
    bikeScore,
    schools,
    crimeRate,
    crimeScore,
    crimeData,
    amenities,
    demographics,
    avgRentPrice,
    avgSalePrice,
    pricePerSqFt,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id

    // Get the property first
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        city: true,
        zipCode: true
      }
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Check if neighborhood data already exists
    let neighborhoodData = await prisma.neighborhoodData.findUnique({
      where: { propertyId }
    })

    // If not exists or older than 30 days, generate new data
    if (!neighborhoodData || 
        (new Date().getTime() - new Date(neighborhoodData.updatedAt).getTime()) > 30 * 24 * 60 * 60 * 1000) {
      
      const newData = await generateNeighborhoodData(
        propertyId,
        property.latitude,
        property.longitude,
        property.city,
        property.zipCode
      )

      // Upsert the data
      const { propertyId: _pid, ...updateData } = newData as any
      neighborhoodData = await prisma.neighborhoodData.upsert({
        where: { propertyId },
        update: {
          ...updateData,
          updatedAt: new Date()
        },
        create: {
          propertyId,
          ...newData
        } as any
      })
    }

    return NextResponse.json(neighborhoodData)
  } catch (error) {
    console.error('Error fetching neighborhood data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch neighborhood data' },
      { status: 500 }
    )
  }
}

// POST endpoint to manually refresh neighborhood data
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        city: true,
        zipCode: true
      }
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    const newData = await generateNeighborhoodData(
      propertyId,
      property.latitude,
      property.longitude,
      property.city,
      property.zipCode
    )

    const { propertyId: _pid2, ...updateData2 } = newData as any
    const neighborhoodData = await prisma.neighborhoodData.upsert({
      where: { propertyId },
      update: {
        ...updateData2,
        updatedAt: new Date()
      },
      create: {
        propertyId,
        ...newData
      } as any
    })

    return NextResponse.json(neighborhoodData)
  } catch (error) {
    console.error('Error refreshing neighborhood data:', error)
    return NextResponse.json(
      { error: 'Failed to refresh neighborhood data' },
      { status: 500 }
    )
  }
}

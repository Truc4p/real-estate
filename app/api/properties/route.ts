import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Check if fetching by specific IDs (for recently viewed, favorites, etc.)
    const ids = searchParams.get('ids')
    if (ids) {
      const idArray = ids.split(',').filter(Boolean)
      const properties = await prisma.property.findMany({
        where: {
          id: { in: idArray },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
            },
          },
        },
      })
      // Sort by the order of IDs provided
      const sortedProperties = idArray
        .map((id) => properties.find((p) => p.id === id))
        .filter(Boolean)
      return NextResponse.json({ properties: sortedProperties })
    }
    
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const propertyType = searchParams.get('propertyType')
    const listingType = searchParams.get('listingType')
    const parking = searchParams.get('parking')
    const amenities = searchParams.get('amenities')
    const moveInDate = searchParams.get('moveInDate')
    const leaseTerm = searchParams.get('leaseTerm')
    const minIncome = searchParams.get('minIncome')
    const minCredit = searchParams.get('minCredit')
    const hasOpenHouse = searchParams.get('hasOpenHouse')
    const priceReduced = searchParams.get('priceReduced')
    const hasVirtualTour = searchParams.get('hasVirtualTour')
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const where: any = {
      status: 'ACTIVE',
    }

    if (city) where.city = { contains: city, mode: 'insensitive' }
    if (state) where.state = { contains: state, mode: 'insensitive' }
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) }
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) }
    if (propertyType) where.propertyType = propertyType
    if (listingType) where.listingType = listingType

    // Advanced filters
    if (parking) where.parking = parking
    
    if (amenities) {
      const amenitiesArray = amenities.split(',')
      where.amenities = {
        hasEvery: amenitiesArray
      }
    }

    if (moveInDate) {
      where.moveInDate = {
        lte: new Date(moveInDate)
      }
    }

    if (leaseTerm) {
      where.leaseTerm = parseInt(leaseTerm)
    }

    if (minIncome) {
      where.incomeRequirement = {
        lte: parseFloat(minIncome)
      }
    }

    if (minCredit) {
      where.creditRequirement = {
        lte: parseInt(minCredit)
      }
    }

    if (hasOpenHouse === 'true') {
      where.openHouseDate = {
        gte: new Date() // Open house in the future
      }
    }

    if (priceReduced === 'true') {
      where.priceReduced = true
    }

    if (hasVirtualTour === 'true') {
      where.virtualTourUrl = {
        not: null
      }
    }

    // Get total count for pagination
    const total = await prisma.property.count({ where })

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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // In production, get userId from session
    // For now, you'll need to create a user first
    const property = await prisma.property.create({
      data: {
        ...body,
        userId: body.userId, // Replace with actual user ID from session
      },
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}

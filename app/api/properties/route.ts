import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const propertyType = searchParams.get('propertyType')
    const listingType = searchParams.get('listingType')

    const where: any = {
      status: 'ACTIVE',
    }

    if (city) where.city = { contains: city, mode: 'insensitive' }
    if (state) where.state = { contains: state, mode: 'insensitive' }
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) }
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) }
    if (propertyType) where.propertyType = propertyType
    if (listingType) where.listingType = listingType

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
      take: 50,
    })

    return NextResponse.json(properties)
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

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            image: true,
          },
        },
      },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Get the current property to track changes
    const currentProperty = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!currentProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Track price changes
    if (body.price && body.price !== currentProperty.price) {
      await prisma.priceHistory.create({
        data: {
          propertyId: params.id,
          oldPrice: currentProperty.price,
          newPrice: body.price,
        },
      });
    }

    // Track status changes
    if (body.status && body.status !== currentProperty.status) {
      await prisma.statusHistory.create({
        data: {
          propertyId: params.id,
          oldStatus: currentProperty.status,
          newStatus: body.status,
        },
      });
    }
    
    const property = await prisma.property.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.property.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}

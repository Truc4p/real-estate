import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PropertyDetailClient from '@/components/properties/PropertyDetailClient'

async function getProperty(id: string) {
  const property = await prisma.property.findUnique({
    where: { id },
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

  return property
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const property = await getProperty(params.id)

  if (!property) {
    notFound()
  }

  return <PropertyDetailClient property={property} />
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}) {
  const property = await getProperty(params.id)

  if (!property) {
    return {
      title: 'Property Not Found',
    }
  }

  return {
    title: `${property.title} - ${property.city}, ${property.state}`,
    description: property.description,
    openGraph: {
      images: property.images,
    },
  }
}

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import MyPropertiesClient from './MyPropertiesClient'

export default async function MyPropertiesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const userEmail = session.user.email
  if (!userEmail) {
    redirect('/auth/signin')
  }

  // Fetch user's properties
  const properties = await prisma.property.findMany({
    where: {
      user: {
        email: userEmail,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return <MyPropertiesClient properties={properties} />
}

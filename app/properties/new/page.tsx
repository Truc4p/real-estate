import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import NewPropertyClient from './NewPropertyClient'

export default async function NewPropertyPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin?callbackUrl=/properties/new')
  }

  return <NewPropertyClient />
}

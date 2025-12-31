import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Phone, MapPin, Home } from 'lucide-react'

export const metadata = {
  title: 'Find Real Estate Agents | RealEstate',
  description: 'Connect with experienced real estate agents in your area',
}

async function getAgents() {
  const agents = await prisma.user.findMany({
    where: {
      role: 'AGENT',
    },
    include: {
      properties: {
        where: {
          status: 'ACTIVE',
        },
        select: {
          id: true,
        },
      },
    },
  })

  return agents
}

export default async function AgentsPage() {
  const agents = await getAgents()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Find Your Real Estate Agent</h1>
          <p className="text-lg text-gray-600">
            Connect with experienced professionals who can help you buy, sell, or rent your property
          </p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Agent Image */}
              <div className="relative h-64 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                {agent.image ? (
                  <Image
                    src={agent.image}
                    alt={agent.name || 'Agent'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-white text-6xl font-bold">
                    {agent.name?.charAt(0) || 'A'}
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
                  {agent.properties.length} {agent.properties.length === 1 ? 'Listing' : 'Listings'}
                </div>
              </div>

              {/* Agent Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {agent.name || 'Real Estate Agent'}
                </h3>
                <p className="text-sm text-gray-600 mb-4 capitalize">
                  Professional {agent.role.toLowerCase()}
                </p>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href={`mailto:${agent.email}`}
                      className="text-sm hover:text-primary-600 transition-colors"
                    >
                      {agent.email}
                    </a>
                  </div>
                  {agent.phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a
                        href={`tel:${agent.phone}`}
                        className="text-sm hover:text-primary-600 transition-colors"
                      >
                        {agent.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <a
                    href={`mailto:${agent.email}`}
                    className="block w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-semibold text-center transition-colors"
                  >
                    Contact Agent
                  </a>
                  {agent.properties.length > 0 && (
                    <Link
                      href={`/properties?agent=${agent.id}`}
                      className="block w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-2.5 rounded-lg font-semibold text-center transition-colors"
                    >
                      View Listings
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {agents.length === 0 && (
          <div className="text-center py-20">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Agents Found</h3>
            <p className="text-gray-600">Check back later for available agents</p>
          </div>
        )}
      </div>
    </div>
  )
}

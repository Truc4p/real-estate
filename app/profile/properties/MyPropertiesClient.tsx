'use client'

import { Property } from '@/types'
import PropertyCard from '@/components/properties/PropertyCard'
import Link from 'next/link'
import { Plus, Home, Eye, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface MyPropertiesClientProps {
  properties: Property[]
}

export default function MyPropertiesClient({ properties }: MyPropertiesClientProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return
    }

    setDeletingId(propertyId)

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        router.refresh()
      } else {
        // Show specific error message from API
        alert(data.error || 'Failed to delete property')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('An error occurred while deleting the property')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Home className="w-8 h-8 text-primary-600" />
              My Properties
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your listed properties
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {properties.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-12 max-w-md mx-auto">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No properties yet</h2>
              <p className="text-gray-600 mb-6">
                Start by adding your first property listing
              </p>
              <Link
                href="/properties/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Your First Property
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Total Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                  </div>
                  <div className="h-12 w-px bg-gray-200"></div>
                  <div>
                    <p className="text-sm text-gray-600">Active Listings</p>
                    <p className="text-2xl font-bold text-green-600">
                      {properties.filter(p => p.status === 'ACTIVE').length}
                    </p>
                  </div>
                  <div className="h-12 w-px bg-gray-200"></div>
                  <div>
                    <p className="text-sm text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-blue-600">-</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="relative group">
                  <PropertyCard property={property} />
                  
                  {/* Action buttons overlay */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="flex gap-2">
                      <Link
                        href={`/properties/${property.id}`}
                        className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-gray-700" />
                      </Link>
                      <Link
                        href={`/properties/${property.id}/edit`}
                        className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Link>
                    </div>
                    <button
                      onClick={() => handleDelete(property.id)}
                      disabled={deletingId === property.id}
                      className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      property.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : property.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

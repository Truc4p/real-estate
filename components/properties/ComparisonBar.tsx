'use client'

import { useComparison } from '@/contexts/ComparisonContext'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

export default function ComparisonBar() {
  const { selectedProperties, removeProperty, clearAll } = useComparison()
  const router = useRouter()

  if (selectedProperties.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-500 shadow-2xl z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 overflow-x-auto">
            <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              Compare ({selectedProperties.length}/4)
            </span>
            
            <div className="flex gap-2">
              {selectedProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 min-w-fit"
                >
                  <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=200&h=200'}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                      {property.address}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatPrice(property.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeProperty(property.id)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => {
                const ids = selectedProperties.map(p => p.id).join(',')
                router.push(`/compare?properties=${ids}`)
              }}
              disabled={selectedProperties.length < 2}
              className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Compare Properties
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

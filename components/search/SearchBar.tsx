'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const [location, setLocation] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (location.trim()) {
      router.push(`/properties?location=${encodeURIComponent(location)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg shadow-lg p-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Enter city, neighborhood, or zip code"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-gray-900 focus:outline-none rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-semibold transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  )
}

'use client'

import Link from 'next/link'
import { Home, Heart, User, Menu, X, Map } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <Home className="w-6 h-6" />
            <span>RealEstate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/properties" className="text-gray-700 hover:text-primary-600 font-medium">
              Buy
            </Link>
            <Link href="/properties?type=rent" className="text-gray-700 hover:text-primary-600 font-medium">
              Rent
            </Link>
            <Link href="/map" className="text-gray-700 hover:text-primary-600 font-medium flex items-center gap-1">
              <Map className="w-4 h-4" />
              Map Search
            </Link>
            <Link href="/agents" className="text-gray-700 hover:text-primary-600 font-medium">
              Find Agents
            </Link>
            <Link href="/favorites" className="text-gray-700 hover:text-primary-600">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/auth/signin" className="text-gray-700 hover:text-primary-600">
              <User className="w-5 h-5" />
            </Link>
            <Link 
              href="/properties/new" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
            >
              List Property
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link href="/properties" className="text-gray-700 hover:text-primary-600 font-medium">
                Buy
              </Link>
              <Link href="/properties?type=rent" className="text-gray-700 hover:text-primary-600 font-medium">
                Rent
              </Link>
              <Link href="/map" className="text-gray-700 hover:text-primary-600 font-medium flex items-center gap-1">
                <Map className="w-4 h-4" />
                Map Search
              </Link>
              <Link href="/agents" className="text-gray-700 hover:text-primary-600 font-medium">
                Find Agents
              </Link>
              <Link href="/favorites" className="text-gray-700 hover:text-primary-600 font-medium">
                Favorites
              </Link>
              <Link href="/auth/signin" className="text-gray-700 hover:text-primary-600 font-medium">
                Sign In
              </Link>
              <Link 
                href="/properties/new" 
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium text-center"
              >
                List Property
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

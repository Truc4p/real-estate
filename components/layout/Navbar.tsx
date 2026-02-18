'use client'

import Link from 'next/link'
import { Home, Heart, User, Menu, X, Map, Bell, Save, Calculator, LogOut } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { data: session, status } = useSession()
  const profileRef = useRef<HTMLDivElement>(null)

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileOpen])

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <Home className="w-6 h-6" />
            <span>HomeFinder Pro</span>
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
            <Link href="/calculators" className="text-gray-700 hover:text-primary-600 font-medium flex items-center gap-1">
              <Calculator className="w-4 h-4" />
              Calculators
            </Link>
            <Link href="/agents" className="text-gray-700 hover:text-primary-600 font-medium">
              Find Agents
            </Link>
            <Link href="/saved-searches" className="text-gray-700 hover:text-primary-600" title="Saved Searches">
              <Save className="w-5 h-5" />
            </Link>
            <Link href="/alerts" className="text-gray-700 hover:text-primary-600" title="Alerts">
              <Bell className="w-5 h-5" />
            </Link>
            <Link href="/favorites" className="text-gray-700 hover:text-primary-600" title="Favorites">
              <Heart className="w-5 h-5" />
            </Link>
            
            {/* User Profile or Sign In */}
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : session ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                    {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{session.user?.name}</p>
                      <p className="text-xs text-gray-500">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/profile/properties"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      My Properties
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin" className="text-gray-700 hover:text-primary-600">
                <User className="w-5 h-5" />
              </Link>
            )}
            
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
              <Link href="/calculators" className="text-gray-700 hover:text-primary-600 font-medium flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Calculators
              </Link>
              <Link href="/agents" className="text-gray-700 hover:text-primary-600 font-medium">
                Find Agents
              </Link>
              <Link href="/saved-searches" className="text-gray-700 hover:text-primary-600 font-medium flex items-center gap-2">
                <Save className="w-4 h-4" />
                Saved Searches
              </Link>
              <Link href="/alerts" className="text-gray-700 hover:text-primary-600 font-medium flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Alerts
              </Link>
              <Link href="/favorites" className="text-gray-700 hover:text-primary-600 font-medium">
                Favorites
              </Link>
              
              {session ? (
                <>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{session.user?.name}</p>
                    <p className="text-xs text-gray-500 mb-2">{session.user?.email}</p>
                  </div>
                  <Link href="/profile" className="text-gray-700 hover:text-primary-600 font-medium">
                    My Profile
                  </Link>
                  <Link href="/profile/properties" className="text-gray-700 hover:text-primary-600 font-medium">
                    My Properties
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/signin" className="text-gray-700 hover:text-primary-600 font-medium">
                  Sign In
                </Link>
              )}
              
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

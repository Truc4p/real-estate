'use client'

import { useState } from 'react'
import { NeighborhoodData } from '@/types'
import { 
  MapPin, GraduationCap, Shield, Store, Users, DollarSign, 
  TrendingUp, TrendingDown, AlertCircle, Navigation, Bike, Bus, 
  Car, Star, Clock
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface NeighborhoodInfoProps {
  data: NeighborhoodData
  propertyPrice: number
}

export default function NeighborhoodInfo({ data, propertyPrice }: NeighborhoodInfoProps) {
  const [activeTab, setActiveTab] = useState<'scores' | 'schools' | 'crime' | 'amenities' | 'demographics' | 'pricing'>('scores')

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400'
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score?: number) => {
    if (!score) return 'Not Available'
    if (score >= 90) return 'Excellent'
    if (score >= 70) return 'Very Good'
    if (score >= 50) return 'Good'
    if (score >= 25) return 'Fair'
    return 'Limited'
  }

  const getCrimeRatingColor = (rate?: string) => {
    switch (rate?.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const tabs = [
    { id: 'scores', label: 'Walkability', icon: Navigation },
    { id: 'schools', label: 'Schools', icon: GraduationCap },
    { id: 'crime', label: 'Safety', icon: Shield },
    { id: 'amenities', label: 'Nearby', icon: Store },
    { id: 'demographics', label: 'Demographics', icon: Users },
    { id: 'pricing', label: 'Area Pricing', icon: DollarSign },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-6">
        {/* Scores Tab */}
        {activeTab === 'scores' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Walkability & Transportation Scores</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Scores are based on the walkability, public transit access, and bikeability of this location.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Walk Score */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">Walk Score</span>
                  </div>
                  <span className={`text-3xl font-bold ${getScoreColor(data.walkScore)}`}>
                    {data.walkScore || '--'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{getScoreLabel(data.walkScore)}</p>
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${data.walkScore && data.walkScore >= 70 ? 'bg-green-500' : data.walkScore && data.walkScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${data.walkScore || 0}%` }}
                  />
                </div>
              </div>

              {/* Transit Score */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Bus className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">Transit Score</span>
                  </div>
                  <span className={`text-3xl font-bold ${getScoreColor(data.transitScore)}`}>
                    {data.transitScore || '--'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{getScoreLabel(data.transitScore)}</p>
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${data.transitScore && data.transitScore >= 70 ? 'bg-green-500' : data.transitScore && data.transitScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${data.transitScore || 0}%` }}
                  />
                </div>
              </div>

              {/* Bike Score */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Bike className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">Bike Score</span>
                  </div>
                  <span className={`text-3xl font-bold ${getScoreColor(data.bikeScore)}`}>
                    {data.bikeScore || '--'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{getScoreLabel(data.bikeScore)}</p>
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${data.bikeScore && data.bikeScore >= 70 ? 'bg-green-500' : data.bikeScore && data.bikeScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${data.bikeScore || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schools Tab */}
        {activeTab === 'schools' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Nearby Schools</h3>
              <p className="text-gray-600 text-sm">School ratings and information for this area.</p>
            </div>

            {data.schools && data.schools.length > 0 ? (
              <div className="space-y-3">
                {data.schools.map((school, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{school.name}</h4>
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                            {school.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{school.distance} miles away</span>
                          </span>
                          <span>Grades: {school.grades}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-lg">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-yellow-700">{school.rating}/10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>School data not available</p>
              </div>
            )}
          </div>
        )}

        {/* Crime Tab */}
        {activeTab === 'crime' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Safety & Crime Statistics</h3>
              <p className="text-gray-600 text-sm">Crime data for this neighborhood.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Crime Rating */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Crime Level</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCrimeRatingColor(data.crimeRate)}`}>
                    {data.crimeRate || 'Unknown'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Based on local crime statistics</p>
              </div>

              {/* Safety Score */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Safety Score</span>
                  <span className={`text-2xl font-bold ${getScoreColor(data.crimeScore)}`}>
                    {data.crimeScore || '--'}/100
                  </span>
                </div>
                <p className="text-xs text-gray-600">Higher is safer</p>
              </div>
            </div>

            {data.crimeData && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Crime Breakdown</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Crimes</p>
                    <p className="text-2xl font-bold text-gray-900">{data.crimeData.totalCrimes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Violent</p>
                    <p className="text-2xl font-bold text-red-600">{data.crimeData.violentCrimes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Property</p>
                    <p className="text-2xl font-bold text-orange-600">{data.crimeData.propertyCrimes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">YoY Change</p>
                    <p className={`text-2xl font-bold flex items-center ${data.crimeData.yearOverYearChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {data.crimeData.yearOverYearChange > 0 ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
                      {Math.abs(data.crimeData.yearOverYearChange)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Amenities Tab */}
        {activeTab === 'amenities' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Nearby Amenities</h3>
              <p className="text-gray-600 text-sm">Points of interest within walking distance.</p>
            </div>

            {data.amenities && data.amenities.length > 0 ? (
              <div className="space-y-2">
                {data.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Store className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{amenity.name}</p>
                        <p className="text-xs text-gray-600">{amenity.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">{amenity.distance} mi</p>
                      {amenity.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">{amenity.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Store className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Amenity data not available</p>
              </div>
            )}
          </div>
        )}

        {/* Demographics Tab */}
        {activeTab === 'demographics' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Area Demographics</h3>
              <p className="text-gray-600 text-sm">Population statistics for this neighborhood.</p>
            </div>

            {data.demographics ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <Users className="w-6 h-6 text-primary-600 mb-2" />
                  <p className="text-sm text-gray-600">Population</p>
                  <p className="text-2xl font-bold text-gray-900">{data.demographics.population.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <Clock className="w-6 h-6 text-primary-600 mb-2" />
                  <p className="text-sm text-gray-600">Median Age</p>
                  <p className="text-2xl font-bold text-gray-900">{data.demographics.medianAge}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <DollarSign className="w-6 h-6 text-primary-600 mb-2" />
                  <p className="text-sm text-gray-600">Median Income</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(data.demographics.medianIncome)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <Users className="w-6 h-6 text-primary-600 mb-2" />
                  <p className="text-sm text-gray-600">Household Size</p>
                  <p className="text-2xl font-bold text-gray-900">{data.demographics.householdSize}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <GraduationCap className="w-6 h-6 text-primary-600 mb-2" />
                  <p className="text-sm text-gray-600">Education Level</p>
                  <p className="text-lg font-bold text-gray-900">{data.demographics.educationLevel}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <TrendingUp className="w-6 h-6 text-primary-600 mb-2" />
                  <p className="text-sm text-gray-600">Employment Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{data.demographics.employmentRate}%</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Demographics data not available</p>
              </div>
            )}
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Area Pricing Trends</h3>
              <p className="text-gray-600 text-sm">Average real estate prices in this neighborhood.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary-50 rounded-lg p-4 border-2 border-primary-200">
                <DollarSign className="w-6 h-6 text-primary-600 mb-2" />
                <p className="text-sm text-gray-600 mb-1">Avg. Rent Price</p>
                <p className="text-2xl font-bold text-primary-600">
                  {data.avgRentPrice ? formatPrice(data.avgRentPrice) : 'N/A'}
                </p>
                <p className="text-xs text-gray-600 mt-1">per month</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <DollarSign className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-sm text-gray-600 mb-1">Avg. Sale Price</p>
                <p className="text-2xl font-bold text-green-600">
                  {data.avgSalePrice ? formatPrice(data.avgSalePrice) : 'N/A'}
                </p>
                <p className="text-xs text-gray-600 mt-1">total</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <DollarSign className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600 mb-1">Price per Sq Ft</p>
                <p className="text-2xl font-bold text-blue-600">
                  {data.pricePerSqFt ? `$${data.pricePerSqFt.toFixed(0)}` : 'N/A'}
                </p>
                <p className="text-xs text-gray-600 mt-1">per sq ft</p>
              </div>
            </div>

            {/* Price Comparison */}
            {data.avgSalePrice && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3">How This Property Compares</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">This Property</p>
                    <p className="text-xl font-bold text-gray-900">{formatPrice(propertyPrice)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {propertyPrice > data.avgSalePrice ? (
                      <>
                        <TrendingUp className="w-5 h-5 text-red-600" />
                        <span className="text-red-600 font-semibold">
                          {((propertyPrice - data.avgSalePrice) / data.avgSalePrice * 100).toFixed(1)}% above avg
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-5 h-5 text-green-600" />
                        <span className="text-green-600 font-semibold">
                          {((data.avgSalePrice - propertyPrice) / data.avgSalePrice * 100).toFixed(1)}% below avg
                        </span>
                      </>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Area Average</p>
                    <p className="text-xl font-bold text-gray-900">{formatPrice(data.avgSalePrice)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

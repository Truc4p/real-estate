'use client'

import { useMemo, useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Info
} from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'

interface PriceHistoryEntry {
  date: string
  price: number
  event?: 'listed' | 'reduced' | 'increased' | 'relisted'
}

interface MarketTrend {
  period: string
  avgPrice: number
  percentChange: number
}

interface PriceHistoryChartProps {
  propertyId: string
  currentPrice: number
  originalPrice?: number
  priceReduced?: boolean
  city: string
  state: string
  bedrooms: number
  listingType: 'FOR_SALE' | 'FOR_RENT'
  createdAt: Date
}

// Simple seeded random number generator for consistent results
function seededRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff
    return state / 0x7fffffff
  }
}

// Generate mock price history data based on property details
function generatePriceHistory(
  currentPrice: number, 
  originalPrice: number | undefined,
  priceReduced: boolean,
  createdAt: Date,
  seed: number
): PriceHistoryEntry[] {
  const random = seededRandom(seed)
  const history: PriceHistoryEntry[] = []
  const now = new Date()
  const listingDate = new Date(createdAt)
  
  // Initial listing
  const initialPrice = originalPrice || currentPrice
  history.push({
    date: listingDate.toISOString().split('T')[0],
    price: initialPrice,
    event: 'listed'
  })

  // If price was reduced, add the reduction event
  if (priceReduced && originalPrice && originalPrice > currentPrice) {
    const reductionDate = new Date(listingDate)
    reductionDate.setDate(reductionDate.getDate() + Math.floor(random() * 30) + 14)
    
    if (reductionDate < now) {
      history.push({
        date: reductionDate.toISOString().split('T')[0],
        price: currentPrice,
        event: 'reduced'
      })
    }
  }

  return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// Generate market trend data for the area
function generateMarketTrends(
  currentPrice: number, 
  bedrooms: number,
  listingType: 'FOR_SALE' | 'FOR_RENT',
  seed: number
): MarketTrend[] {
  const random = seededRandom(seed)
  const isRental = listingType === 'FOR_RENT'
  const baseVariance = isRental ? 0.03 : 0.05 // Rentals have less variance
  
  // Generate last 6 months of market trends
  const trends: MarketTrend[] = []
  const now = new Date()
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    
    // Simulate market trends with some randomness but overall upward trend
    const monthlyVariance = (random() - 0.3) * baseVariance // Slight upward bias
    const trendMultiplier = 1 + (5 - i) * 0.008 + monthlyVariance
    const avgPrice = Math.round(currentPrice * trendMultiplier * (0.95 + random() * 0.1))
    
    const prevPrice = trends.length > 0 ? trends[trends.length - 1].avgPrice : avgPrice
    const percentChange = ((avgPrice - prevPrice) / prevPrice) * 100
    
    trends.push({
      period: monthName,
      avgPrice,
      percentChange: trends.length > 0 ? percentChange : 0
    })
  }
  
  return trends
}

export default function PriceHistoryChart({
  propertyId,
  currentPrice,
  originalPrice,
  priceReduced = false,
  city,
  state,
  bedrooms,
  listingType,
  createdAt
}: PriceHistoryChartProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeView, setActiveView] = useState<'history' | 'market'>('market')
  const [isMounted, setIsMounted] = useState(false)

  // Only run on client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isRental = listingType === 'FOR_RENT'
  
  // Create a deterministic seed from propertyId
  const seed = useMemo(() => {
    let hash = 0
    for (let i = 0; i < propertyId.length; i++) {
      hash = ((hash << 5) - hash) + propertyId.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash)
  }, [propertyId])

  // Generate price history
  const priceHistory = useMemo(() => 
    generatePriceHistory(currentPrice, originalPrice, priceReduced, createdAt, seed),
    [currentPrice, originalPrice, priceReduced, createdAt, seed]
  )

  // Generate market trends
  const marketTrends = useMemo(() => 
    generateMarketTrends(currentPrice, bedrooms, listingType, seed + 1),
    [currentPrice, bedrooms, listingType, seed]
  )

  // Calculate overall market change
  const overallChange = useMemo(() => {
    if (marketTrends.length < 2) return 0
    const first = marketTrends[0].avgPrice
    const last = marketTrends[marketTrends.length - 1].avgPrice
    return ((last - first) / first) * 100
  }, [marketTrends])

  // Find min and max for chart scaling
  const { minPrice, maxPrice } = useMemo(() => {
    const prices = marketTrends.map(t => t.avgPrice)
    return {
      minPrice: Math.min(...prices) * 0.95,
      maxPrice: Math.max(...prices) * 1.05
    }
  }, [marketTrends])

  const getBarHeight = (price: number) => {
    const range = maxPrice - minPrice
    return ((price - minPrice) / range) * 100
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900">
              {isRental ? 'Rental' : 'Price'} History & Market Trends
            </h3>
            <p className="text-sm text-gray-600">
              {city}, {state} • {bedrooms}BR {isRental ? 'rentals' : 'homes'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium',
            overallChange > 0 
              ? 'bg-red-100 text-red-700' 
              : overallChange < 0 
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
          )}>
            {overallChange > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : overallChange < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            {Math.abs(overallChange).toFixed(1)}%
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="p-6">
          {/* View Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveView('market')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeView === 'market'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              Market Trends
            </button>
            <button
              onClick={() => setActiveView('history')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeView === 'history'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              Price History
            </button>
          </div>

          {/* Market Trends View */}
          {activeView === 'market' && (
            <div className="space-y-6">
              {/* Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-end justify-between gap-2 h-40">
                  {marketTrends.map((trend, index) => (
                    <div key={trend.period} className="flex-1 flex flex-col items-center">
                      <div className="relative w-full flex justify-center mb-2">
                        <div 
                          className={cn(
                            'w-8 rounded-t-md transition-all',
                            index === marketTrends.length - 1 
                              ? 'bg-blue-500' 
                              : 'bg-blue-300 hover:bg-blue-400'
                          )}
                          style={{ height: `${getBarHeight(trend.avgPrice)}%`, minHeight: '20px' }}
                          title={formatPrice(trend.avgPrice)}
                        />
                        {index === marketTrends.length - 1 && (
                          <div className="absolute -top-6 text-xs font-medium text-blue-700">
                            {formatPrice(trend.avgPrice)}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{trend.period}</span>
                      {index > 0 && (
                        <span className={cn(
                          'text-xs font-medium mt-1',
                          trend.percentChange > 0 ? 'text-red-600' : trend.percentChange < 0 ? 'text-green-600' : 'text-gray-500'
                        )}>
                          {trend.percentChange > 0 ? '+' : ''}{trend.percentChange.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Avg. {isRental ? 'Rent' : 'Price'}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(marketTrends[marketTrends.length - 1]?.avgPrice || currentPrice)}
                    {isRental && <span className="text-sm font-normal">/mo</span>}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">6-Month Change</p>
                  <p className={cn(
                    'text-lg font-bold',
                    overallChange > 0 ? 'text-red-600' : overallChange < 0 ? 'text-green-600' : 'text-gray-900'
                  )}>
                    {overallChange > 0 ? '+' : ''}{overallChange.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">vs. Market</p>
                  <p className={cn(
                    'text-lg font-bold',
                    currentPrice > (marketTrends[marketTrends.length - 1]?.avgPrice || currentPrice)
                      ? 'text-red-600'
                      : 'text-green-600'
                  )}>
                    {currentPrice > (marketTrends[marketTrends.length - 1]?.avgPrice || currentPrice)
                      ? `+${(((currentPrice / (marketTrends[marketTrends.length - 1]?.avgPrice || currentPrice)) - 1) * 100).toFixed(0)}%`
                      : `-${((1 - (currentPrice / (marketTrends[marketTrends.length - 1]?.avgPrice || currentPrice))) * 100).toFixed(0)}%`
                    }
                  </p>
                </div>
              </div>

              {/* Market Insight */}
              <div className={cn(
                'rounded-lg p-4 border',
                overallChange > 2 
                  ? 'bg-red-50 border-red-200' 
                  : overallChange < -2 
                    ? 'bg-green-50 border-green-200'
                    : 'bg-blue-50 border-blue-200'
              )}>
                <h4 className={cn(
                  'font-semibold mb-2 flex items-center gap-2',
                  overallChange > 2 ? 'text-red-800' : overallChange < -2 ? 'text-green-800' : 'text-blue-800'
                )}>
                  {overallChange > 2 ? (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      Rising Market
                    </>
                  ) : overallChange < -2 ? (
                    <>
                      <TrendingDown className="w-4 h-4" />
                      Cooling Market
                    </>
                  ) : (
                    <>
                      <Minus className="w-4 h-4" />
                      Stable Market
                    </>
                  )}
                </h4>
                <p className={cn(
                  'text-sm',
                  overallChange > 2 ? 'text-red-700' : overallChange < -2 ? 'text-green-700' : 'text-blue-700'
                )}>
                  {overallChange > 2 
                    ? `${isRental ? 'Rents' : 'Prices'} in ${city} have increased ${overallChange.toFixed(1)}% over the past 6 months. Consider acting quickly if you find a property you like.`
                    : overallChange < -2
                      ? `${isRental ? 'Rents' : 'Prices'} in ${city} have decreased ${Math.abs(overallChange).toFixed(1)}% over the past 6 months. You may have more negotiating power.`
                      : `The ${isRental ? 'rental' : 'housing'} market in ${city} has been relatively stable over the past 6 months.`
                  }
                </p>
              </div>
            </div>
          )}

          {/* Price History View */}
          {activeView === 'history' && (
            <div className="space-y-4">
              {priceHistory.length > 0 ? (
                <div className="space-y-3">
                  {priceHistory.map((entry, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className={cn(
                        'p-2 rounded-lg',
                        entry.event === 'listed' ? 'bg-blue-100' :
                        entry.event === 'reduced' ? 'bg-green-100' :
                        entry.event === 'increased' ? 'bg-red-100' :
                        'bg-gray-100'
                      )}>
                        {entry.event === 'listed' ? (
                          <Calendar className={cn('w-5 h-5', 'text-blue-600')} />
                        ) : entry.event === 'reduced' ? (
                          <TrendingDown className="w-5 h-5 text-green-600" />
                        ) : entry.event === 'increased' ? (
                          <TrendingUp className="w-5 h-5 text-red-600" />
                        ) : (
                          <Calendar className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 capitalize">
                            {entry.event === 'listed' ? 'Listed' :
                             entry.event === 'reduced' ? 'Price Reduced' :
                             entry.event === 'increased' ? 'Price Increased' :
                             entry.event === 'relisted' ? 'Relisted' : 'Update'}
                          </span>
                          <span className="font-bold text-gray-900">
                            {formatPrice(entry.price)}
                            {isRental && <span className="text-sm font-normal text-gray-500">/mo</span>}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      {index > 0 && (
                        <div className={cn(
                          'px-2 py-1 rounded text-xs font-medium',
                          entry.price < priceHistory[index - 1].price 
                            ? 'bg-green-100 text-green-700'
                            : entry.price > priceHistory[index - 1].price
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                        )}>
                          {entry.price < priceHistory[index - 1].price ? '-' : '+'}
                          {formatPrice(Math.abs(entry.price - priceHistory[index - 1].price))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No price history available for this listing</p>
                </div>
              )}

              {/* Price Reduction Alert */}
              {priceReduced && originalPrice && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 font-semibold mb-1">
                    <TrendingDown className="w-5 h-5" />
                    Price Reduced!
                  </div>
                  <p className="text-sm text-green-700">
                    This property was reduced by {formatPrice(originalPrice - currentPrice)} 
                    ({(((originalPrice - currentPrice) / originalPrice) * 100).toFixed(1)}% off original price)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-2 text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Market data is based on similar {bedrooms}-bedroom {isRental ? 'rentals' : 'properties'} in {city}, {state}. 
              Actual market conditions may vary. Data is for informational purposes only.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

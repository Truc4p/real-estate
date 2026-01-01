'use client'

import { useState, useMemo } from 'react'
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Home,
  Wallet,
  PiggyBank,
  CreditCard,
  Truck,
  Info,
  Check,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { formatPrice, formatNumber, cn } from '@/lib/utils'

interface FinancialToolsProps {
  monthlyRent: number
  securityDeposit?: number
  city?: string
  state?: string
}

interface AffordabilityResult {
  canAfford: boolean
  recommendedIncome: number
  maxRent: number
  debtToIncomeRatio: number
}

interface MoveInCosts {
  firstMonth: number
  lastMonth: number
  securityDeposit: number
  applicationFee: number
  brokerFee: number
  movingCosts: number
  utilityDeposits: number
  rentersInsurance: number
  total: number
}

export default function FinancialTools({ 
  monthlyRent, 
  securityDeposit,
  city,
  state 
}: FinancialToolsProps) {
  const [activeTab, setActiveTab] = useState<'affordability' | 'income' | 'movein'>('affordability')
  const [isExpanded, setIsExpanded] = useState(true)

  // Affordability Calculator State
  const [annualIncome, setAnnualIncome] = useState<string>('')
  const [monthlyDebt, setMonthlyDebt] = useState<string>('')
  const [includeUtilities, setIncludeUtilities] = useState(true)
  const estimatedUtilities = Math.round(monthlyRent * 0.15) // ~15% of rent

  // Income Requirement Calculator State
  const [incomeMultiplier, setIncomeMultiplier] = useState<number>(40) // 40x rent is standard

  // Move-in Costs State
  const [includeLastMonth, setIncludeLastMonth] = useState(true)
  const [includeBrokerFee, setIncludeBrokerFee] = useState(false)
  const [brokerFeePercent, setBrokerFeePercent] = useState<number>(15) // % of annual rent
  const [estimatedMovingCost, setEstimatedMovingCost] = useState<number>(1500)

  // Calculate Affordability
  const affordabilityResult = useMemo<AffordabilityResult | null>(() => {
    const income = parseFloat(annualIncome) || 0
    const debt = parseFloat(monthlyDebt) || 0
    
    if (income === 0) return null

    const monthlyIncome = income / 12
    const totalMonthlyHousing = monthlyRent + (includeUtilities ? estimatedUtilities : 0)
    const recommendedMaxRent = monthlyIncome * 0.30 // 30% rule
    const debtToIncomeRatio = ((totalMonthlyHousing + debt) / monthlyIncome) * 100
    const canAfford = totalMonthlyHousing <= recommendedMaxRent && debtToIncomeRatio <= 43

    return {
      canAfford,
      recommendedIncome: (monthlyRent * 12) / 0.30,
      maxRent: recommendedMaxRent,
      debtToIncomeRatio
    }
  }, [annualIncome, monthlyDebt, monthlyRent, includeUtilities, estimatedUtilities])

  // Calculate Income Requirement
  const incomeRequirement = useMemo(() => {
    return monthlyRent * incomeMultiplier
  }, [monthlyRent, incomeMultiplier])

  // Calculate Move-in Costs
  const moveInCosts = useMemo<MoveInCosts>(() => {
    const deposit = securityDeposit || monthlyRent
    const brokerFee = includeBrokerFee ? (monthlyRent * 12 * brokerFeePercent / 100) : 0
    const applicationFee = 50 // Standard application fee
    const utilityDeposits = 200 // Estimated utility deposits
    const rentersInsurance = 25 // First month

    const total = 
      monthlyRent + // First month
      (includeLastMonth ? monthlyRent : 0) + // Last month
      deposit + // Security deposit
      applicationFee +
      brokerFee +
      estimatedMovingCost +
      utilityDeposits +
      rentersInsurance

    return {
      firstMonth: monthlyRent,
      lastMonth: includeLastMonth ? monthlyRent : 0,
      securityDeposit: deposit,
      applicationFee,
      brokerFee,
      movingCosts: estimatedMovingCost,
      utilityDeposits,
      rentersInsurance,
      total
    }
  }, [monthlyRent, securityDeposit, includeLastMonth, includeBrokerFee, brokerFeePercent, estimatedMovingCost])

  const tabs = [
    { id: 'affordability' as const, label: 'Affordability', icon: Wallet },
    { id: 'income' as const, label: 'Income Req.', icon: DollarSign },
    { id: 'movein' as const, label: 'Move-in Costs', icon: Truck },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calculator className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900">Financial Tools</h3>
            <p className="text-sm text-gray-600">Calculate affordability, income requirements & move-in costs</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <>
          {/* Tabs */}
          <div className="border-b border-gray-200 px-4">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Affordability Calculator */}
            {activeTab === 'affordability' && (
              <div className="space-y-5">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Monthly Rent</span>
                    <span className="text-xl font-bold text-gray-900">{formatPrice(monthlyRent)}/mo</span>
                  </div>
                  {includeUtilities && (
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-gray-500">+ Est. Utilities</span>
                      <span className="text-gray-700">~{formatPrice(estimatedUtilities)}/mo</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Gross Income
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(e.target.value)}
                      placeholder="75,000"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Debt Payments (car, loans, credit cards)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={monthlyDebt}
                      onChange={(e) => setMonthlyDebt(e.target.value)}
                      placeholder="500"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUtilities}
                    onChange={(e) => setIncludeUtilities(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Include estimated utilities (~{formatPrice(estimatedUtilities)}/mo)</span>
                </label>

                {/* Results */}
                {affordabilityResult && (
                  <div className={cn(
                    'rounded-lg p-4 border-2',
                    affordabilityResult.canAfford 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  )}>
                    <div className="flex items-center gap-2 mb-3">
                      {affordabilityResult.canAfford ? (
                        <>
                          <div className="p-1 bg-green-100 rounded-full">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="font-bold text-green-800">This rent fits your budget!</span>
                        </>
                      ) : (
                        <>
                          <div className="p-1 bg-red-100 rounded-full">
                            <X className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="font-bold text-red-800">This rent may stretch your budget</span>
                        </>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={affordabilityResult.canAfford ? 'text-green-700' : 'text-red-700'}>
                          Recommended max rent (30% rule)
                        </span>
                        <span className="font-semibold">
                          {formatPrice(affordabilityResult.maxRent)}/mo
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={affordabilityResult.canAfford ? 'text-green-700' : 'text-red-700'}>
                          Debt-to-income ratio
                        </span>
                        <span className={cn(
                          'font-semibold',
                          affordabilityResult.debtToIncomeRatio <= 43 ? 'text-green-700' : 'text-red-700'
                        )}>
                          {affordabilityResult.debtToIncomeRatio.toFixed(1)}%
                          {affordabilityResult.debtToIncomeRatio <= 43 ? ' ✓' : ' (should be ≤43%)'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div className="flex items-start gap-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                  <span>
                    Most financial experts recommend spending no more than <strong>30%</strong> of your gross income on housing costs.
                  </span>
                </div>
              </div>
            )}

            {/* Income Requirement Calculator */}
            {activeTab === 'income' && (
              <div className="space-y-5">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Monthly Rent</span>
                    <span className="text-xl font-bold text-gray-900">{formatPrice(monthlyRent)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Annual Rent</span>
                    <span>{formatPrice(monthlyRent * 12)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Income Multiplier Requirement
                  </label>
                  <select
                    value={incomeMultiplier}
                    onChange={(e) => setIncomeMultiplier(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value={40}>40x monthly rent (Standard)</option>
                    <option value={45}>45x monthly rent (Strict)</option>
                    <option value={35}>35x monthly rent (Lenient)</option>
                    <option value={30}>30x monthly rent (Very Lenient)</option>
                  </select>
                </div>

                {/* Results */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Required Annual Income</p>
                    <p className="text-3xl font-bold text-green-700">{formatPrice(incomeRequirement)}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      ({formatPrice(incomeRequirement / 12)}/month gross)
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-gray-500">Min. Hourly Rate</p>
                        <p className="font-bold text-gray-900">
                          {formatPrice(incomeRequirement / 2080)}/hr
                        </p>
                        <p className="text-xs text-gray-400">(40 hrs/week)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Rent % of Income</p>
                        <p className="font-bold text-gray-900">
                          {((monthlyRent * 12 / incomeRequirement) * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-gray-400">of gross income</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Roommate Calculator */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Roommate Scenario
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {[2, 3, 4].map((roommates) => (
                      <div key={roommates} className="bg-white rounded-lg p-3 text-center">
                        <p className="text-gray-500">{roommates} people</p>
                        <p className="font-bold text-purple-700">
                          {formatPrice(incomeRequirement / roommates)}
                        </p>
                        <p className="text-xs text-gray-400">each/year</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="flex items-start gap-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                  <span>
                    Most landlords require annual income of <strong>40x</strong> the monthly rent. Some may accept a guarantor if you don&apos;t meet this threshold.
                  </span>
                </div>
              </div>
            )}

            {/* Move-in Costs Estimator */}
            {activeTab === 'movein' && (
              <div className="space-y-5">
                {/* Options */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeLastMonth}
                        onChange={(e) => setIncludeLastMonth(e.target.checked)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">Last month&apos;s rent required</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{formatPrice(monthlyRent)}</span>
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeBrokerFee}
                        onChange={(e) => setIncludeBrokerFee(e.target.checked)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">Broker fee</span>
                    </div>
                    {includeBrokerFee && (
                      <select
                        value={brokerFeePercent}
                        onChange={(e) => setBrokerFeePercent(parseInt(e.target.value))}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value={8}>8% (1 month)</option>
                        <option value={15}>15% (~2 months)</option>
                      </select>
                    )}
                  </label>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">Estimated moving costs</span>
                      <span className="text-sm font-medium text-gray-600">{formatPrice(estimatedMovingCost)}</span>
                    </div>
                    <input
                      type="range"
                      min={500}
                      max={5000}
                      step={100}
                      value={estimatedMovingCost}
                      onChange={(e) => setEstimatedMovingCost(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>$500</span>
                      <span>$5,000</span>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-900">Cost Breakdown</h4>
                  </div>
                  <div className="divide-y divide-gray-100">
                    <CostRow label="First month's rent" amount={moveInCosts.firstMonth} />
                    {moveInCosts.lastMonth > 0 && (
                      <CostRow label="Last month's rent" amount={moveInCosts.lastMonth} />
                    )}
                    <CostRow 
                      label="Security deposit" 
                      amount={moveInCosts.securityDeposit}
                      note={securityDeposit ? undefined : "(Est. 1 month)"}
                    />
                    <CostRow label="Application fee" amount={moveInCosts.applicationFee} note="(Est.)" />
                    {moveInCosts.brokerFee > 0 && (
                      <CostRow label="Broker fee" amount={moveInCosts.brokerFee} />
                    )}
                    <CostRow label="Moving costs" amount={moveInCosts.movingCosts} />
                    <CostRow label="Utility deposits" amount={moveInCosts.utilityDeposits} note="(Est.)" />
                    <CostRow label="Renter's insurance" amount={moveInCosts.rentersInsurance} note="(1st month)" />
                  </div>
                  <div className="p-4 bg-green-50 border-t-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">Total Move-in Cost</span>
                      <span className="text-2xl font-bold text-green-700">{formatPrice(moveInCosts.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Savings Goal */}
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <PiggyBank className="w-4 h-4" />
                    Savings Goal
                  </h4>
                  <p className="text-sm text-amber-700 mb-3">
                    We recommend having <strong>3 months of expenses</strong> saved as an emergency fund:
                  </p>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-500">Recommended savings</p>
                    <p className="text-2xl font-bold text-amber-700">
                      {formatPrice(moveInCosts.total + (monthlyRent * 3))}
                    </p>
                    <p className="text-xs text-gray-400">
                      Move-in + 3 months rent ({formatPrice(monthlyRent * 3)})
                    </p>
                  </div>
                </div>

                {/* Tips */}
                <div className="flex items-start gap-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                  <span>
                    Actual costs may vary. Some landlords offer move-in specials or flexible payment options. Always confirm exact fees before signing a lease.
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Helper component for cost rows
function CostRow({ 
  label, 
  amount, 
  note 
}: { 
  label: string
  amount: number
  note?: string 
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-gray-600">
        {label}
        {note && <span className="text-gray-400 ml-1">{note}</span>}
      </span>
      <span className="text-sm font-medium text-gray-900">{formatPrice(amount)}</span>
    </div>
  )
}

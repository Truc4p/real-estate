'use client'

import { useState } from 'react'
import { 
  Calculator, 
  DollarSign, 
  Home,
  Wallet,
  PiggyBank,
  Truck,
  Info,
  Check,
  X,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'

export default function CalculatorsPage() {
  const [activeCalculator, setActiveCalculator] = useState<'affordability' | 'income' | 'movein' | 'comparison'>('affordability')
  
  // Affordability Calculator State
  const [annualIncome, setAnnualIncome] = useState<string>('')
  const [monthlyDebt, setMonthlyDebt] = useState<string>('')
  const [desiredRent, setDesiredRent] = useState<string>('')
  const [includeUtilities, setIncludeUtilities] = useState(true)
  
  // Income Requirement Calculator State
  const [monthlyRent, setMonthlyRent] = useState<string>('')
  const [incomeMultiplier, setIncomeMultiplier] = useState<number>(40)

  // Move-in Costs State
  const [moveInRent, setMoveInRent] = useState<string>('')
  const [customDeposit, setCustomDeposit] = useState<string>('')
  const [includeLastMonth, setIncludeLastMonth] = useState(true)
  const [includeBrokerFee, setIncludeBrokerFee] = useState(false)
  const [brokerFeePercent, setBrokerFeePercent] = useState<number>(15)
  const [estimatedMovingCost, setEstimatedMovingCost] = useState<number>(1500)

  // Rent Comparison State
  const [currentRent, setCurrentRent] = useState<string>('')
  const [newRent, setNewRent] = useState<string>('')
  const [currentUtilities, setCurrentUtilities] = useState<string>('')
  const [newUtilities, setNewUtilities] = useState<string>('')
  const [currentCommute, setCurrentCommute] = useState<string>('')
  const [newCommute, setNewCommute] = useState<string>('')

  // Calculations
  const rent = parseFloat(desiredRent) || 0
  const income = parseFloat(annualIncome) || 0
  const debt = parseFloat(monthlyDebt) || 0
  const utilities = includeUtilities ? rent * 0.15 : 0
  
  const monthlyIncomeCalc = income / 12
  const totalHousing = rent + utilities
  const maxRent = monthlyIncomeCalc * 0.30
  const debtToIncomeRatio = monthlyIncomeCalc > 0 ? ((totalHousing + debt) / monthlyIncomeCalc) * 100 : 0
  const canAfford = totalHousing <= maxRent && debtToIncomeRatio <= 43

  const incomeRent = parseFloat(monthlyRent) || 0
  const requiredIncome = incomeRent * incomeMultiplier

  const moveRent = parseFloat(moveInRent) || 0
  const deposit = parseFloat(customDeposit) || moveRent
  const brokerFee = includeBrokerFee ? (moveRent * 12 * brokerFeePercent / 100) : 0
  const totalMoveIn = moveRent + (includeLastMonth ? moveRent : 0) + deposit + 50 + brokerFee + estimatedMovingCost + 200 + 25

  const currentTotal = (parseFloat(currentRent) || 0) + (parseFloat(currentUtilities) || 0) + (parseFloat(currentCommute) || 0) * 22
  const newTotal = (parseFloat(newRent) || 0) + (parseFloat(newUtilities) || 0) + (parseFloat(newCommute) || 0) * 22
  const monthlySavings = currentTotal - newTotal

  const calculators = [
    { id: 'affordability' as const, label: 'Affordability', icon: Wallet, description: 'Can you afford this rent?' },
    { id: 'income' as const, label: 'Income Req.', icon: DollarSign, description: 'What income do you need?' },
    { id: 'movein' as const, label: 'Move-in Costs', icon: Truck, description: 'Total upfront costs' },
    { id: 'comparison' as const, label: 'Compare Rents', icon: BarChart3, description: 'Compare two rentals' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Calculator className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Financial Calculators</h1>
          </div>
          <p className="text-green-100 text-lg max-w-2xl">
            Plan your rental budget with our comprehensive financial tools. Calculate affordability, 
            income requirements, and move-in costs.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Calculator Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {calculators.map((calc) => (
            <button
              key={calc.id}
              onClick={() => setActiveCalculator(calc.id)}
              className={cn(
                'p-4 rounded-xl text-left transition-all',
                activeCalculator === calc.id
                  ? 'bg-white shadow-lg border-2 border-green-500'
                  : 'bg-white shadow border border-gray-200 hover:border-green-300'
              )}
            >
              <calc.icon className={cn(
                'w-6 h-6 mb-2',
                activeCalculator === calc.id ? 'text-green-600' : 'text-gray-400'
              )} />
              <h3 className={cn(
                'font-semibold',
                activeCalculator === calc.id ? 'text-green-700' : 'text-gray-700'
              )}>
                {calc.label}
              </h3>
              <p className="text-sm text-gray-500">{calc.description}</p>
            </button>
          ))}
        </div>

        {/* Calculator Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Affordability Calculator */}
            {activeCalculator === 'affordability' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Rent Affordability Calculator</h2>
                  <p className="text-gray-600">Find out if a rental fits your budget based on the 30% rule.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desired Monthly Rent
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={desiredRent}
                      onChange={(e) => setDesiredRent(e.target.value)}
                      placeholder="2,500"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
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
                    Monthly Debt Payments
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
                  <p className="text-xs text-gray-500 mt-1">Include car payments, student loans, credit cards</p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUtilities}
                    onChange={(e) => setIncludeUtilities(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Include estimated utilities (~15% of rent)</span>
                </label>
              </div>
            )}

            {/* Income Requirement Calculator */}
            {activeCalculator === 'income' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Income Requirement Calculator</h2>
                  <p className="text-gray-600">Calculate the minimum income needed to qualify for a rental.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(e.target.value)}
                      placeholder="2,500"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landlord&apos;s Income Multiplier
                  </label>
                  <select
                    value={incomeMultiplier}
                    onChange={(e) => setIncomeMultiplier(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value={40}>40x monthly rent (Most Common)</option>
                    <option value={45}>45x monthly rent (Strict)</option>
                    <option value={35}>35x monthly rent (Flexible)</option>
                    <option value={30}>30x monthly rent (Very Lenient)</option>
                    <option value={50}>50x monthly rent (Very Strict)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Most landlords require 40x the monthly rent in annual income</p>
                </div>
              </div>
            )}

            {/* Move-in Costs Calculator */}
            {activeCalculator === 'movein' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Move-in Costs Estimator</h2>
                  <p className="text-gray-600">Calculate all the upfront costs you&apos;ll need to move in.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={moveInRent}
                      onChange={(e) => setMoveInRent(e.target.value)}
                      placeholder="2,500"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Deposit (leave blank for 1 month&apos;s rent)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={customDeposit}
                      onChange={(e) => setCustomDeposit(e.target.value)}
                      placeholder={moveRent.toString() || '2,500'}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeLastMonth}
                      onChange={(e) => setIncludeLastMonth(e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Last month&apos;s rent required</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeBrokerFee}
                      onChange={(e) => setIncludeBrokerFee(e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Broker fee required</span>
                  </label>

                  {includeBrokerFee && (
                    <select
                      value={brokerFeePercent}
                      onChange={(e) => setBrokerFeePercent(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value={8}>8% of annual rent (1 month)</option>
                      <option value={15}>15% of annual rent (~2 months)</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Moving Costs: {formatPrice(estimatedMovingCost)}
                  </label>
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
            )}

            {/* Rent Comparison Calculator */}
            {activeCalculator === 'comparison' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Rent Comparison Calculator</h2>
                  <p className="text-gray-600">Compare the true cost of two rentals including utilities and commute.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Current Rental
                    </h3>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Monthly Rent</label>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          value={currentRent}
                          onChange={(e) => setCurrentRent(e.target.value)}
                          placeholder="2,000"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Utilities/mo</label>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          value={currentUtilities}
                          onChange={(e) => setCurrentUtilities(e.target.value)}
                          placeholder="150"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Daily Commute Cost</label>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          value={currentCommute}
                          onChange={(e) => setCurrentCommute(e.target.value)}
                          placeholder="10"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-green-700 flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      New Rental
                    </h3>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Monthly Rent</label>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          value={newRent}
                          onChange={(e) => setNewRent(e.target.value)}
                          placeholder="2,300"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Utilities/mo</label>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          value={newUtilities}
                          onChange={(e) => setNewUtilities(e.target.value)}
                          placeholder="100"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Daily Commute Cost</label>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          value={newCommute}
                          onChange={(e) => setNewCommute(e.target.value)}
                          placeholder="5"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Affordability Results */}
            {activeCalculator === 'affordability' && rent > 0 && income > 0 && (
              <>
                <div className={cn(
                  'rounded-xl p-6 border-2',
                  canAfford 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-red-50 border-red-300'
                )}>
                  <div className="flex items-center gap-3 mb-4">
                    {canAfford ? (
                      <>
                        <div className="p-2 bg-green-100 rounded-full">
                          <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-green-800">Yes, you can afford this!</h3>
                          <p className="text-green-600">This rent fits within your budget.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-2 bg-red-100 rounded-full">
                          <X className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-red-800">This may stretch your budget</h3>
                          <p className="text-red-600">Consider a lower rent or increasing income.</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Your monthly income</span>
                      <span className="font-bold">{formatPrice(monthlyIncomeCalc)}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Total housing cost</span>
                      <span className="font-bold">{formatPrice(totalHousing)}/mo</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Recommended max rent</span>
                      <span className="font-bold text-green-600">{formatPrice(maxRent)}/mo</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Debt-to-income ratio</span>
                      <span className={cn(
                        'font-bold',
                        debtToIncomeRatio <= 43 ? 'text-green-600' : 'text-red-600'
                      )}>
                        {debtToIncomeRatio.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800">The 30% Rule</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Financial experts recommend spending no more than 30% of your gross income on housing costs 
                        (rent + utilities). A debt-to-income ratio under 43% is generally required for most rentals.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Income Requirement Results */}
            {activeCalculator === 'income' && incomeRent > 0 && (
              <>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="text-center mb-6">
                    <p className="text-gray-600 mb-2">Required Annual Income</p>
                    <p className="text-4xl font-bold text-green-700">{formatPrice(requiredIncome)}</p>
                    <p className="text-gray-500 mt-1">
                      {formatPrice(requiredIncome / 12)}/month gross
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500">Minimum Hourly Rate</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatPrice(requiredIncome / 2080)}/hr
                      </p>
                      <p className="text-xs text-gray-400">40 hrs/week</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500">Rent % of Income</p>
                      <p className="text-xl font-bold text-gray-900">
                        {((incomeRent * 12 / requiredIncome) * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-400">of gross</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Roommate Scenarios
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[2, 3, 4].map((num) => (
                      <div key={num} className="bg-white rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-500">{num} people</p>
                        <p className="font-bold text-purple-700">{formatPrice(requiredIncome / num)}</p>
                        <p className="text-xs text-gray-400">each/year</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Move-in Costs Results */}
            {activeCalculator === 'movein' && moveRent > 0 && (
              <>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Cost Breakdown</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    <CostRow label="First month's rent" amount={moveRent} />
                    {includeLastMonth && <CostRow label="Last month's rent" amount={moveRent} />}
                    <CostRow label="Security deposit" amount={deposit} />
                    <CostRow label="Application fee" amount={50} note="(Est.)" />
                    {brokerFee > 0 && <CostRow label="Broker fee" amount={brokerFee} />}
                    <CostRow label="Moving costs" amount={estimatedMovingCost} />
                    <CostRow label="Utility deposits" amount={200} note="(Est.)" />
                    <CostRow label="Renter's insurance" amount={25} note="(1st month)" />
                  </div>
                  <div className="p-6 bg-green-50 border-t-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">Total Move-in Cost</span>
                      <span className="text-3xl font-bold text-green-700">{formatPrice(totalMoveIn)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <PiggyBank className="w-5 h-5" />
                    Recommended Savings
                  </h4>
                  <p className="text-sm text-amber-700 mb-4">
                    We recommend having move-in costs plus 3 months of rent saved:
                  </p>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">Target Savings</p>
                    <p className="text-2xl font-bold text-amber-700">
                      {formatPrice(totalMoveIn + (moveRent * 3))}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Comparison Results */}
            {activeCalculator === 'comparison' && (currentTotal > 0 || newTotal > 0) && (
              <>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Cost Comparison</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500 mb-1">Current Total</p>
                      <p className="text-2xl font-bold text-gray-900">{formatPrice(currentTotal)}/mo</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500 mb-1">New Total</p>
                      <p className="text-2xl font-bold text-green-700">{formatPrice(newTotal)}/mo</p>
                    </div>
                  </div>

                  <div className={cn(
                    'rounded-lg p-4 text-center',
                    monthlySavings > 0 ? 'bg-green-100' : monthlySavings < 0 ? 'bg-red-100' : 'bg-gray-100'
                  )}>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      {monthlySavings > 0 ? (
                        <TrendingDown className="w-5 h-5 text-green-600" />
                      ) : monthlySavings < 0 ? (
                        <TrendingUp className="w-5 h-5 text-red-600" />
                      ) : null}
                      <p className="text-sm text-gray-600">Monthly Difference</p>
                    </div>
                    <p className={cn(
                      'text-3xl font-bold',
                      monthlySavings > 0 ? 'text-green-700' : monthlySavings < 0 ? 'text-red-700' : 'text-gray-700'
                    )}>
                      {monthlySavings > 0 ? '-' : monthlySavings < 0 ? '+' : ''}{formatPrice(Math.abs(monthlySavings))}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {monthlySavings > 0 
                        ? `You'd save ${formatPrice(monthlySavings * 12)}/year!` 
                        : monthlySavings < 0 
                          ? `You'd pay ${formatPrice(Math.abs(monthlySavings) * 12)} more/year`
                          : 'Same cost'}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Consider All Costs</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Remember to factor in commute time (not just cost), neighborhood amenities, 
                        proximity to work/school, and quality of life when comparing rentals.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Empty State */}
            {((activeCalculator === 'affordability' && (rent === 0 || income === 0)) ||
              (activeCalculator === 'income' && incomeRent === 0) ||
              (activeCalculator === 'movein' && moveRent === 0) ||
              (activeCalculator === 'comparison' && currentTotal === 0 && newTotal === 0)) && (
              <div className="bg-gray-50 rounded-xl p-12 text-center">
                <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Enter your details</h3>
                <p className="text-gray-500">Fill in the fields on the left to see your results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

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
    <div className="flex items-center justify-between px-6 py-4">
      <span className="text-gray-600">
        {label}
        {note && <span className="text-gray-400 ml-1">{note}</span>}
      </span>
      <span className="font-semibold text-gray-900">{formatPrice(amount)}</span>
    </div>
  )
}

# Financial Tools Guide

This guide explains the financial tools available in the Real Estate application to help users make informed rental decisions.

## Overview

The financial tools provide comprehensive calculators for:
1. **Rent Affordability Calculator** - Determine if a rental fits your budget
2. **Income Requirement Calculator** - Calculate minimum income needed
3. **Move-in Costs Estimator** - Plan upfront costs
4. **Rental History/Price Trends** - View market trends and price history

## Accessing Financial Tools

### Property Detail Page
Financial tools are automatically displayed on rental property detail pages:
- **Price History Chart** - Shows market trends for similar properties in the area
- **Financial Tools** - Interactive calculators for affordability, income requirements, and move-in costs

### Standalone Calculators Page
Access all calculators at `/calculators` for general planning without a specific property.

## Tool Details

### 1. Rent Affordability Calculator

**Purpose:** Determines if a rental fits within your budget using the 30% rule.

**Inputs:**
- Monthly rent amount
- Annual gross income
- Monthly debt payments (car loans, student loans, credit cards)
- Option to include estimated utilities (~15% of rent)

**Outputs:**
- Whether you can afford the rental
- Recommended maximum rent based on income
- Debt-to-income ratio
- Monthly housing cost breakdown

**The 30% Rule:** Financial experts recommend spending no more than 30% of your gross monthly income on housing costs (rent + utilities).

**Example:**
- Annual Income: $75,000
- Monthly Income: $6,250
- Recommended Max Rent: $1,875/month (30% of monthly income)

### 2. Income Requirement Calculator

**Purpose:** Calculate the minimum annual income needed to qualify for a rental.

**Inputs:**
- Monthly rent
- Income multiplier (typically 40x)

**Outputs:**
- Required annual income
- Required monthly income
- Minimum hourly rate (at 40 hrs/week)
- Roommate scenarios (split between 2-4 people)

**Income Multiplier Standards:**
- **40x** - Most common requirement
- **45x** - Stricter landlords
- **35x** - More lenient
- **30x** - Very lenient/guarantor may help

**Example:**
- Monthly Rent: $2,500
- At 40x multiplier: $100,000/year required income

### 3. Move-in Costs Estimator

**Purpose:** Calculate all upfront costs needed to move into a rental.

**Configurable Options:**
- First month's rent (always included)
- Last month's rent (optional)
- Security deposit (customizable, defaults to 1 month)
- Broker fee (8% or 15% of annual rent)
- Estimated moving costs ($500-$5,000 range)

**Automatic Estimates:**
- Application fee: ~$50
- Utility deposits: ~$200
- Renter's insurance (1st month): ~$25

**Savings Goal:** We recommend having:
- Total move-in costs
- Plus 3 months of rent as emergency fund

**Example:**
For $2,500/month rent:
- First month: $2,500
- Last month: $2,500
- Security deposit: $2,500
- Application fee: $50
- Moving costs: $1,500
- Utilities/Insurance: $225
- **Total: ~$9,275**
- **With emergency fund: ~$16,775**

### 4. Price History & Market Trends

**Purpose:** Understand how rental prices have changed in the area.

**Features:**
- **Market Trends View:**
  - 6-month price trend chart
  - Average rent for similar properties
  - Month-over-month percentage changes
  - Market status indicator (Rising/Cooling/Stable)

- **Price History View:**
  - Listing date and original price
  - Price reductions (if any)
  - Timeline of price changes

**Market Insights:**
- **Rising Market (>2% increase):** Prices trending up, act quickly
- **Cooling Market (>2% decrease):** More negotiating power
- **Stable Market:** Prices relatively unchanged

### 5. Rent Comparison Calculator

**Purpose:** Compare the true cost of two different rentals.

**Inputs (for each rental):**
- Monthly rent
- Estimated utilities
- Daily commute cost

**Outputs:**
- Total monthly cost for each option
- Monthly savings/difference
- Annual savings projection

**Considerations:** The calculator also reminds users to consider:
- Commute time (not just cost)
- Neighborhood amenities
- Quality of life factors

## Integration

### For Developers

The financial tools are integrated into:

```tsx
// Property Detail Page
import FinancialTools from '@/components/properties/FinancialTools'
import PriceHistoryChart from '@/components/properties/PriceHistoryChart'

// Usage
<PriceHistoryChart
  propertyId={property.id}
  currentPrice={property.price}
  originalPrice={property.originalPrice}
  priceReduced={property.priceReduced}
  city={property.city}
  state={property.state}
  bedrooms={property.bedrooms}
  listingType={property.listingType}
  createdAt={property.createdAt}
/>

{property.listingType === 'FOR_RENT' && (
  <FinancialTools
    monthlyRent={property.price}
    securityDeposit={property.price}
    city={property.city}
    state={property.state}
  />
)}
```

### Component Props

**FinancialTools:**
```typescript
interface FinancialToolsProps {
  monthlyRent: number
  securityDeposit?: number
  city?: string
  state?: string
}
```

**PriceHistoryChart:**
```typescript
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
```

## Best Practices

1. **Budget Planning:**
   - Use the affordability calculator before starting your search
   - Set realistic rent expectations based on income

2. **Saving for Move-in:**
   - Start saving early using the move-in costs estimator
   - Build an emergency fund of 3+ months rent

3. **Market Awareness:**
   - Check price trends before making offers
   - In rising markets, be prepared to act quickly

4. **Comparing Options:**
   - Use the comparison calculator for final decisions
   - Consider total cost, not just rent

## Future Enhancements

Planned improvements:
- [ ] Historical rent data integration
- [ ] Neighborhood cost-of-living comparisons
- [ ] Integration with credit score requirements
- [ ] PDF export of calculations
- [ ] Save calculations to account

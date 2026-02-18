# Database Migration Guide - Advanced Filters

This guide will help you update your database schema to include the new advanced filters.

## Changes Made

### 1. Database Schema (Prisma)
Added the following fields to the Property model:
- `parking` (ParkingType) - Garage, Street, None, Covered, Carport
- `amenities` (String[]) - Pool, Gym, Doorman, etc.
- `moveInDate` (DateTime) - Available move-in date
- `leaseTerm` (Int) - Lease term in months
- `incomeRequirement` (Float) - Monthly income requirement
- `creditRequirement` (Int) - Minimum credit score
- `openHouseDate` (DateTime) - Next open house date
- `priceReduced` (Boolean) - Recently reduced price flag
- `originalPrice` (Float) - Original price if reduced

Added new enum: `ParkingType`

### 2. TypeScript Types
Updated `SearchFilters` and `Property` interfaces to include new filter fields.

### 3. Search UI Component
Enhanced [SearchFilters.tsx](components/search/SearchFilters.tsx) with:
- Collapsible advanced filters section
- Parking type selector
- Multi-select amenities checkboxes
- Move-in date picker
- Lease term selector (for rentals)
- Income/credit requirement filters (for rentals)
- Quick filter checkboxes for open houses, price reductions, and virtual tours

### 4. API Route
Updated [route.ts](app/api/properties/route.ts) to handle all new filter parameters.

## Next Steps

### 1. Generate and Apply Migration

Run the following commands:

```bash
# Generate the migration
npx prisma migrate dev --name add_advanced_filters

# This will:
# - Create a new migration file
# - Apply it to your database
# - Regenerate Prisma Client
```

### 2. Update Seed Data (Optional)

If you have seed data, update [seed.ts](prisma/seed.ts) to include the new fields:

```typescript
const properties = [
  {
    // ... existing fields
    parking: 'GARAGE',
    amenities: ['Pool', 'Gym', 'Doorman'],
    moveInDate: new Date('2026-02-01'),
    leaseTerm: 12,
    incomeRequirement: 5000,
    creditRequirement: 650,
    openHouseDate: new Date('2026-01-15'),
    priceReduced: false,
    originalPrice: null,
  },
  // ... more properties
]
```

Then run: `npx prisma db seed`

### 3. Test the Filters

1. Start your development server: `npm run dev`
2. Navigate to the properties search page
3. Click "Show Advanced Filters"
4. Test each filter option

## Features Added

✅ **Parking Filter** - Filter by parking type (Garage, Street, None, Covered, Carport)

✅ **Amenities** - Multi-select amenities (Pool, Gym, Doorman, Elevator, etc.)

✅ **Move-in Date** - Find properties available by a specific date

✅ **Lease Term** - Filter rentals by lease duration (6, 12, 18, 24 months)

✅ **Income/Credit Requirements** - Filter rentals within budget and credit score

✅ **Open House Filter** - Show only properties with upcoming open houses

✅ **Price Reduced** - Find recently discounted properties

✅ **Virtual Tour** - Filter properties with 3D/virtual tours

## UI Enhancement

The filters now have a collapsible "Advanced Filters" section to keep the UI clean while providing powerful search capabilities.

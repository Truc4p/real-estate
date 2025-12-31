// Global type definitions
import { PropertyType as PrismaPropertyType, ListingType as PrismaListingType, PropertyStatus as PrismaPropertyStatus, UserRole as PrismaUserRole, ParkingType as PrismaParkingType } from '@prisma/client'

export type PropertyType = PrismaPropertyType
export type ListingType = PrismaListingType
export type PropertyStatus = PrismaPropertyStatus
export type UserRole = PrismaUserRole
export type ParkingType = PrismaParkingType

export interface Property {
  id: string
  title: string
  description: string
  price: number
  address: string
  city: string
  state: string
  zipCode: string
  latitude: number
  longitude: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  propertyType: PropertyType
  listingType: ListingType
  status: PropertyStatus
  images: string[]
  features: string[]
  yearBuilt: number
  virtualTourUrl?: string
  floorPlans: string[]
  // Advanced filters
  parking?: ParkingType
  amenities: string[]
  moveInDate?: Date
  leaseTerm?: number
  incomeRequirement?: number
  creditRequirement?: number
  openHouseDate?: Date
  priceReduced: boolean
  originalPrice?: number
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  image?: string
  createdAt: Date
}

export interface School {
  name: string
  type: 'Elementary' | 'Middle' | 'High' | 'Private'
  rating: number // 0-10
  distance: number // in miles
  grades: string
}

export interface CrimeData {
  totalCrimes: number
  violentCrimes: number
  propertyCrimes: number
  yearOverYearChange: number // percentage
}

export interface NearbyAmenity {
  name: string
  type: 'Restaurant' | 'Shopping' | 'Park' | 'Grocery' | 'Entertainment' | 'Healthcare' | 'Transit'
  distance: number // in miles
  rating?: number
}

export interface Demographics {
  population: number
  medianAge: number
  medianIncome: number
  householdSize: number
  educationLevel: string
  employmentRate: number
}

export interface NeighborhoodData {
  id: string
  propertyId: string
  walkScore?: number
  transitScore?: number
  bikeScore?: number
  schools?: School[]
  crimeRate?: string
  crimeScore?: number
  crimeData?: CrimeData
  amenities?: NearbyAmenity[]
  demographics?: Demographics
  avgRentPrice?: number
  avgSalePrice?: number
  pricePerSqFt?: number
  createdAt: Date
  updatedAt: Date
}

export interface SearchFilters {
  city?: string
  state?: string
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
  maxBedrooms?: number
  minBathrooms?: number
  maxBathrooms?: number
  propertyType?: PropertyType[]
  listingType?: ListingType
  minSquareFeet?: number
  maxSquareFeet?: number
  // Advanced filters
  parking?: ParkingType[]
  amenities?: string[]
  moveInDate?: Date
  leaseTerm?: number
  minIncome?: number
  minCredit?: number
  hasOpenHouse?: boolean
  priceReduced?: boolean
  hasVirtualTour?: boolean
}

// Global type definitions
import { PropertyType as PrismaPropertyType, ListingType as PrismaListingType, PropertyStatus as PrismaPropertyStatus, UserRole as PrismaUserRole } from '@prisma/client'

export type PropertyType = PrismaPropertyType
export type ListingType = PrismaListingType
export type PropertyStatus = PrismaPropertyStatus
export type UserRole = PrismaUserRole

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
}

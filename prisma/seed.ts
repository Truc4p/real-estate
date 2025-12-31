import { PrismaClient, PropertyType, ListingType, PropertyStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.property.deleteMany({})
  console.log('✅ Cleared all properties')

  // Create a sample user
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
      phone: '+1 (555) 123-4567',
      role: 'AGENT',
    },
  })

  console.log('✅ Created demo user:', user.email)

  // Create sample properties
  const properties = [
    {
      title: 'Modern Downtown Apartment',
      description: 'Stunning modern apartment in the heart of downtown with amazing city views. Features include hardwood floors, stainless steel appliances, and in-unit washer/dryer.',
      price: 450000,
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      latitude: 37.7749,
      longitude: -122.4194,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.FOR_SALE,
      status: PropertyStatus.ACTIVE,
      images: [
        'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
      ],
      features: ['Hardwood Floors', 'City Views', 'In-Unit Laundry', 'Parking'],
      yearBuilt: 2020,
      virtualTourUrl: 'https://my.matterport.com/show/?m=example123',
      floorPlans: [
        'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/8293773/pexels-photo-8293773.jpeg?auto=compress&cs=tinysrgb&w=1200',
      ],
      userId: user.id,
    },
    {
      title: 'Spacious Family Home',
      description: 'Beautiful 4-bedroom family home in quiet suburban neighborhood. Large backyard, updated kitchen, and close to top-rated schools.',
      price: 750000,
      address: '456 Oak Avenue',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95110',
      latitude: 37.3382,
      longitude: -121.8863,
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 2500,
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.FOR_SALE,
      status: PropertyStatus.ACTIVE,
      images: [
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
      ],
      features: ['Large Backyard', 'Updated Kitchen', 'Near Schools', '2-Car Garage'],
      yearBuilt: 2015,
      virtualTourUrl: 'https://my.matterport.com/show/?m=example456',
      floorPlans: [
        'https://images.pexels.com/photos/7031705/pexels-photo-7031705.jpeg?auto=compress&cs=tinysrgb&w=1200',
      ],
      userId: user.id,
    },
    {
      title: 'Luxury Condo with Bay Views',
      description: 'Incredible luxury condo with panoramic bay views. High-end finishes throughout, building amenities include pool, gym, and concierge.',
      price: 1200000,
      address: '789 Bay Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94133',
      latitude: 37.8044,
      longitude: -122.4100,
      bedrooms: 3,
      bathrooms: 2.5,
      squareFeet: 1800,
      propertyType: PropertyType.CONDO,
      listingType: ListingType.FOR_SALE,
      status: PropertyStatus.ACTIVE,
      images: [
        'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
      ],
      features: ['Bay Views', 'Pool', 'Gym', 'Concierge', 'Parking'],
      yearBuilt: 2018,
      floorPlans: [
        'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=1200',
      ],
      userId: user.id,
    },
    {
      title: 'Charming Studio for Rent',
      description: 'Cozy studio apartment perfect for young professionals. Walking distance to public transit, shops, and restaurants.',
      price: 2200,
      address: '321 Market Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      latitude: 37.7749,
      longitude: -122.4194,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 550,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.FOR_RENT,
      status: PropertyStatus.ACTIVE,
      images: [
        'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
      ],
      features: ['Near Transit', 'Walkable', 'Pet Friendly'],
      yearBuilt: 2010,
      userId: user.id,
    },
    {
      title: 'Elegant Townhouse',
      description: 'Beautifully renovated townhouse with modern amenities and classic charm. Three levels of living space with private patio.',
      price: 850000,
      address: '555 Elm Street',
      city: 'Oakland',
      state: 'CA',
      zipCode: '94612',
      latitude: 37.8044,
      longitude: -122.2712,
      bedrooms: 3,
      bathrooms: 2.5,
      squareFeet: 2000,
      propertyType: PropertyType.TOWNHOUSE,
      listingType: ListingType.FOR_SALE,
      status: PropertyStatus.ACTIVE,
      images: [
        'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
      ],
      features: ['Private Patio', 'Renovated', 'Garage', 'Storage'],
      yearBuilt: 2005,
      userId: user.id,
    },
  ]

  for (const propertyData of properties) {
    const property = await prisma.property.create({
      data: propertyData,
    })
    console.log('✅ Created property:', property.title)
  }

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

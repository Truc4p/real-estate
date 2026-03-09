import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';
import { Property, SavedSearch, AlertType } from '@prisma/client';

interface SearchFilters {
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  listingType?: string;
  [key: string]: any;
}

// Check if a property matches saved search filters
function propertyMatchesFilters(property: Property, filters: SearchFilters): boolean {
  if (filters.city && property.city !== filters.city) return false;
  if (filters.state && property.state !== filters.state) return false;
  if (filters.minPrice && property.price < filters.minPrice) return false;
  if (filters.maxPrice && property.price > filters.maxPrice) return false;
  if (filters.bedrooms && property.bedrooms < filters.bedrooms) return false;
  if (filters.bathrooms && property.bathrooms < filters.bathrooms) return false;
  if (filters.propertyType && property.propertyType !== filters.propertyType) return false;
  if (filters.listingType && property.listingType !== filters.listingType) return false;
  
  return true;
}

// Check for new property matches
export async function checkNewMatches() {
  console.log('Checking for new property matches...');
  
  const savedSearches = await prisma.savedSearch.findMany({
    where: {
      emailAlerts: true,
      notifyNewMatches: true,
      alertFrequency: 'INSTANT',
    },
    include: {
      user: true,
    },
  });

  for (const search of savedSearches) {
    const filters = search.filters as SearchFilters;
    
    // Find properties created since last check
    const newProperties = await prisma.property.findMany({
      where: {
        createdAt: {
          gt: search.lastChecked,
        },
        status: 'ACTIVE',
      },
    });

    const matchingProperties = newProperties.filter((property) =>
      propertyMatchesFilters(property, filters)
    );

    // Create alerts and send emails for matching properties
    for (const property of matchingProperties) {
      const alert = await prisma.alert.create({
        data: {
          type: 'NEW_MATCH',
          propertyId: property.id,
          savedSearchId: search.id,
          title: `New Match: ${property.title}`,
          message: `A new property matching your search "${search.name}" has been listed.`,
          metadata: {
            propertyTitle: property.title,
            price: property.price,
            address: property.address,
          },
        },
      });

      // Send email notification
      if (search.user.email) {
        const propertyUrl = `${process.env.NEXTAUTH_URL}/properties/${property.id}`;
        const template = emailTemplates.newMatch(
          property.title,
          propertyUrl,
          search.name
        );
        
        await sendEmail({
          to: search.user.email,
          subject: template.subject,
          html: template.html,
        });

        await prisma.alert.update({
          where: { id: alert.id },
          data: { sent: true, sentAt: new Date() },
        });
      }
    }

    // Update last checked timestamp
    await prisma.savedSearch.update({
      where: { id: search.id },
      data: { lastChecked: new Date() },
    });
  }
}

// Check for price drops
export async function checkPriceDrops() {
  console.log('Checking for price drops...');
  
  const savedSearches = await prisma.savedSearch.findMany({
    where: {
      emailAlerts: true,
      notifyPriceDrops: true,
      alertFrequency: 'INSTANT',
    },
    include: {
      user: true,
    },
  });

  // Get recent price changes
  const recentPriceChanges = await prisma.priceHistory.findMany({
    where: {
      changedAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
      newPrice: {
        lt: prisma.priceHistory.fields.oldPrice, // Price decreased
      },
    },
  });

  for (const priceChange of recentPriceChanges) {
    const property = await prisma.property.findUnique({
      where: { id: priceChange.propertyId },
    });

    if (!property || property.status !== 'ACTIVE') continue;

    for (const search of savedSearches) {
      const filters = search.filters as SearchFilters;
      
      if (propertyMatchesFilters(property, filters)) {
        const percentDrop = Math.round(
          ((priceChange.oldPrice - priceChange.newPrice) / priceChange.oldPrice) * 100
        );

        const alert = await prisma.alert.create({
          data: {
            type: 'PRICE_DROP',
            propertyId: property.id,
            savedSearchId: search.id,
            title: `Price Drop: ${property.title}`,
            message: `Price reduced by ${percentDrop}% from $${priceChange.oldPrice.toLocaleString()} to $${priceChange.newPrice.toLocaleString()}`,
            metadata: {
              oldPrice: priceChange.oldPrice,
              newPrice: priceChange.newPrice,
              percentDrop,
            },
          },
        });

        // Send email notification
        if (search.user.email) {
          const propertyUrl = `${process.env.NEXTAUTH_URL}/properties/${property.id}`;
          const template = emailTemplates.priceDrop(
            property.title,
            propertyUrl,
            priceChange.oldPrice,
            priceChange.newPrice,
            percentDrop
          );
          
          await sendEmail({
            to: search.user.email,
            subject: template.subject,
            html: template.html,
          });

          await prisma.alert.update({
            where: { id: alert.id },
            data: { sent: true, sentAt: new Date() },
          });
        }
      }
    }
  }
}

// Check for status changes
export async function checkStatusChanges() {
  console.log('Checking for status changes...');
  
  const savedSearches = await prisma.savedSearch.findMany({
    where: {
      emailAlerts: true,
      notifyStatusChanges: true,
      alertFrequency: 'INSTANT',
    },
    include: {
      user: true,
    },
  });

  // Get recent status changes
  const recentStatusChanges = await prisma.statusHistory.findMany({
    where: {
      changedAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    },
  });

  for (const statusChange of recentStatusChanges) {
    const property = await prisma.property.findUnique({
      where: { id: statusChange.propertyId },
    });

    if (!property) continue;

    const alertType: AlertType = 
      statusChange.newStatus === 'ACTIVE' && 
      (statusChange.oldStatus === 'SOLD' || statusChange.oldStatus === 'RENTED')
        ? 'BACK_ON_MARKET'
        : 'STATUS_CHANGE';

    for (const search of savedSearches) {
      const filters = search.filters as SearchFilters;
      
      if (propertyMatchesFilters(property, filters)) {
        const alert = await prisma.alert.create({
          data: {
            type: alertType,
            propertyId: property.id,
            savedSearchId: search.id,
            title: `Status Update: ${property.title}`,
            message: `Property status changed from ${statusChange.oldStatus} to ${statusChange.newStatus}`,
            metadata: {
              oldStatus: statusChange.oldStatus,
              newStatus: statusChange.newStatus,
            },
          },
        });

        // Send email notification
        if (search.user.email) {
          const propertyUrl = `${process.env.NEXTAUTH_URL}/properties/${property.id}`;
          const template = emailTemplates.statusChange(
            property.title,
            propertyUrl,
            statusChange.oldStatus,
            statusChange.newStatus
          );
          
          await sendEmail({
            to: search.user.email,
            subject: template.subject,
            html: template.html,
          });

          await prisma.alert.update({
            where: { id: alert.id },
            data: { sent: true, sentAt: new Date() },
          });
        }
      }
    }
  }
}

// Send daily/weekly digests
export async function sendDigests(frequency: 'DAILY' | 'WEEKLY') {
  console.log(`Sending ${frequency.toLowerCase()} digests...`);
  
  const savedSearches = await prisma.savedSearch.findMany({
    where: {
      emailAlerts: true,
      alertFrequency: frequency,
    },
    include: {
      user: true,
      alerts: {
        where: {
          sent: false,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  for (const search of savedSearches) {
    if (search.alerts.length === 0) continue;

    const matches = await Promise.all(
      search.alerts.map(async (alert) => {
        const property = await prisma.property.findUnique({
          where: { id: alert.propertyId },
        });
        
        return {
          title: property?.title || 'Property',
          url: `${process.env.NEXTAUTH_URL}/properties/${alert.propertyId}`,
          type: alert.type.replace('_', ' '),
        };
      })
    );

    if (search.user.email) {
      const template = emailTemplates.dailyDigest(matches, search.name);
      
      await sendEmail({
        to: search.user.email,
        subject: template.subject,
        html: template.html,
      });

      // Mark alerts as sent
      await prisma.alert.updateMany({
        where: {
          id: {
            in: search.alerts.map((a) => a.id),
          },
        },
        data: {
          sent: true,
          sentAt: new Date(),
        },
      });
    }
  }
}

// Main function to run all checks
export async function runAlertChecks() {
  try {
    await checkNewMatches();
    await checkPriceDrops();
    await checkStatusChanges();
    console.log('Alert checks completed successfully');
  } catch (error) {
    console.error('Error running alert checks:', error);
    throw error;
  }
}

'use client';

import { useState, useMemo } from 'react';
import PropertyCard from './PropertyCard';
import SaveSearchModal from '@/components/alerts/SaveSearchModal';
import { Save, Bell } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  listingType: string;
  status: string;
  images: string[];
  features: string[];
  yearBuilt: number;
  priceReduced?: boolean;
  user?: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    role: string;
    image: string | null;
  };
}

interface PropertyListWithAlertsProps {
  properties: Property[];
  initialFilters?: any;
}

export default function PropertyListWithAlerts({
  properties,
  initialFilters = {},
}: PropertyListWithAlertsProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (filters.city && property.city !== filters.city) return false;
      if (filters.state && property.state !== filters.state) return false;
      if (filters.minPrice && property.price < filters.minPrice) return false;
      if (filters.maxPrice && property.price > filters.maxPrice) return false;
      if (filters.bedrooms && property.bedrooms < filters.bedrooms) return false;
      if (filters.bathrooms && property.bathrooms < filters.bathrooms) return false;
      if (filters.propertyType && property.propertyType !== filters.propertyType) return false;
      if (filters.listingType && property.listingType !== filters.listingType) return false;
      return true;
    });
  }, [properties, filters]);

  const handleSaveSearch = () => {
    setSavedMessage('Search saved successfully! You\'ll receive alerts for matching properties.');
    setTimeout(() => setSavedMessage(''), 5000);
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => filters[key] !== undefined && filters[key] !== ''
  );

  return (
    <div>
      {/* Alert Banner */}
      {savedMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Save Search Button */}
      {hasActiveFilters && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">
                Save this search to get alerts
              </h3>
              <p className="text-sm text-blue-700">
                Get notified about new matches, price drops, and status changes
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
          >
            <Save className="h-4 w-4" />
            Save Search
          </button>
        </div>
      )}

      {/* Property Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No properties found matching your criteria.
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => setFilters({})}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* Save Search Modal */}
      <SaveSearchModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        currentFilters={filters}
        onSave={handleSaveSearch}
      />
    </div>
  );
}

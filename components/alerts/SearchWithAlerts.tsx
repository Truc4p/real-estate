'use client';

import { useState } from 'react';
import SaveSearchModal from '@/components/alerts/SaveSearchModal';
import { Save } from 'lucide-react';

interface SearchWithAlertsProps {
  currentFilters: any;
  onFiltersChange?: (filters: any) => void;
}

/**
 * Wrapper component to add "Save Search" functionality to any search interface
 * 
 * Usage:
 * <SearchWithAlerts
 *   currentFilters={filters}
 *   onFiltersChange={setFilters}
 * />
 */
export default function SearchWithAlerts({
  currentFilters,
  onFiltersChange,
}: SearchWithAlertsProps) {
  const [showSaveModal, setShowSaveModal] = useState(false);

  const hasFilters = Object.keys(currentFilters).some(
    (key) => currentFilters[key] !== undefined && currentFilters[key] !== ''
  );

  if (!hasFilters) return null;

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Save className="h-6 w-6 text-blue-600" />
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

      <SaveSearchModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        currentFilters={currentFilters}
        onSave={() => {
          // Optional: Show success message or redirect
          console.log('Search saved successfully');
        }}
      />
    </>
  );
}

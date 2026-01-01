'use client';

import { useState } from 'react';
import { Save, X, Bell, Mail } from 'lucide-react';

interface SaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: any;
  onSave?: () => void;
}

export default function SaveSearchModal({
  isOpen,
  onClose,
  currentFilters,
  onSave,
}: SaveSearchModalProps) {
  const [name, setName] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [alertFrequency, setAlertFrequency] = useState<'INSTANT' | 'DAILY' | 'WEEKLY'>('INSTANT');
  const [notifyNewMatches, setNotifyNewMatches] = useState(true);
  const [notifyPriceDrops, setNotifyPriceDrops] = useState(true);
  const [notifyStatusChanges, setNotifyStatusChanges] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Please enter a name for this search');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          filters: currentFilters,
          emailAlerts,
          alertFrequency,
          notifyNewMatches,
          notifyPriceDrops,
          notifyStatusChanges,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save search');
      }

      onSave?.();
      onClose();
      setName('');
    } catch (err) {
      setError('Failed to save search. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getFiltersDisplay = () => {
    const parts = [];
    if (currentFilters.city) parts.push(currentFilters.city);
    if (currentFilters.propertyType) parts.push(currentFilters.propertyType);
    if (currentFilters.minPrice || currentFilters.maxPrice) {
      const price = `$${currentFilters.minPrice?.toLocaleString() || '0'} - $${currentFilters.maxPrice?.toLocaleString() || '∞'}`;
      parts.push(price);
    }
    if (currentFilters.bedrooms) parts.push(`${currentFilters.bedrooms}+ beds`);
    if (currentFilters.bathrooms) parts.push(`${currentFilters.bathrooms}+ baths`);
    return parts.join(' • ') || 'All properties';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Save className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold">Save Search</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current filters display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Current Search</h3>
            <p className="text-sm text-blue-700">{getFiltersDisplay()}</p>
          </div>

          {/* Search name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g., Downtown 2BR Apartments"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          {/* Alert settings */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Alert Preferences</h3>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Enable email alerts</span>
              </div>
            </label>

            {emailAlerts && (
              <div className="ml-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alert Frequency
                  </label>
                  <select
                    value={alertFrequency}
                    onChange={(e) => setAlertFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="INSTANT">Instant (as they happen)</option>
                    <option value="DAILY">Daily Digest</option>
                    <option value="WEEKLY">Weekly Digest</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Notify me about:</p>
                  
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={notifyNewMatches}
                      onChange={(e) => setNotifyNewMatches(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                    />
                    <div>
                      <span className="text-sm text-gray-900 font-medium">
                        New property matches
                      </span>
                      <p className="text-xs text-gray-500">
                        Get notified when new properties match your search
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={notifyPriceDrops}
                      onChange={(e) => setNotifyPriceDrops(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                    />
                    <div>
                      <span className="text-sm text-gray-900 font-medium">
                        Price drops
                      </span>
                      <p className="text-xs text-gray-500">
                        Be alerted when property prices are reduced
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={notifyStatusChanges}
                      onChange={(e) => setNotifyStatusChanges(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                    />
                    <div>
                      <span className="text-sm text-gray-900 font-medium">
                        Status changes
                      </span>
                      <p className="text-xs text-gray-500">
                        Know when properties are sold, rented, or back on market
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Search
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

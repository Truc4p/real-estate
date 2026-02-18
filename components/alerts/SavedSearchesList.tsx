'use client';

import { useState, useEffect } from 'react';
import { Save, Edit2, Trash2, Bell, BellOff, Mail } from 'lucide-react';

interface SavedSearch {
  id: string;
  name: string;
  filters: any;
  emailAlerts: boolean;
  alertFrequency: 'INSTANT' | 'DAILY' | 'WEEKLY';
  notifyNewMatches: boolean;
  notifyPriceDrops: boolean;
  notifyStatusChanges: boolean;
  createdAt: string;
  _count?: {
    alerts: number;
  };
}

export default function SavedSearchesList() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSearches();
  }, []);

  const fetchSearches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/saved-searches');
      if (res.ok) {
        const data = await res.json();
        setSearches(data);
      }
    } catch (error) {
      console.error('Failed to fetch saved searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSearch = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved search?')) return;

    try {
      const res = await fetch(`/api/saved-searches/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSearches(searches.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete search:', error);
    }
  };

  const updateAlertSettings = async (id: string, updates: Partial<SavedSearch>) => {
    try {
      const res = await fetch(`/api/saved-searches/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const updated = await res.json();
        setSearches(searches.map(s => s.id === id ? updated : s));
        setEditingId(null);
      }
    } catch (error) {
      console.error('Failed to update search:', error);
    }
  };

  const getFiltersDisplay = (filters: any) => {
    const parts = [];
    if (filters.city) parts.push(filters.city);
    if (filters.propertyType) parts.push(filters.propertyType);
    if (filters.minPrice || filters.maxPrice) {
      const price = `$${filters.minPrice?.toLocaleString() || '0'} - $${filters.maxPrice?.toLocaleString() || '∞'}`;
      parts.push(price);
    }
    if (filters.bedrooms) parts.push(`${filters.bedrooms}+ beds`);
    return parts.join(' • ') || 'All properties';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Save className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold">Saved Searches</h1>
        </div>
        <p className="text-gray-600">
          Manage your saved searches and alert preferences
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading saved searches...</p>
        </div>
      ) : searches.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Save className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No saved searches yet
          </h3>
          <p className="text-gray-600 mb-4">
            Save your property searches to get instant alerts when new matches appear
          </p>
          <a
            href="/properties"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
          >
            Search Properties
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {searches.map((search) => (
            <div
              key={search.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {search.name}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {getFiltersDisplay(search.filters)}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        {search._count?.alerts || 0} alerts received
                      </span>
                      <span>•</span>
                      <span>
                        Created {new Date(search.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(editingId === search.id ? null : search.id)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit alert settings"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteSearch(search.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete saved search"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {editingId === search.id ? (
                  <div className="border-t pt-4 space-y-4">
                    <h4 className="font-semibold text-gray-900">Alert Settings</h4>
                    
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={search.emailAlerts}
                          onChange={(e) =>
                            updateAlertSettings(search.id, {
                              emailAlerts: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-gray-600" />
                          <span className="font-medium">Enable email alerts</span>
                        </div>
                      </label>

                      {search.emailAlerts && (
                        <>
                          <div className="ml-8 space-y-2">
                            <label className="block">
                              <span className="text-sm font-medium text-gray-700">
                                Alert Frequency
                              </span>
                              <select
                                value={search.alertFrequency}
                                onChange={(e) =>
                                  updateAlertSettings(search.id, {
                                    alertFrequency: e.target.value as any,
                                  })
                                }
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              >
                                <option value="INSTANT">Instant (as they happen)</option>
                                <option value="DAILY">Daily Digest</option>
                                <option value="WEEKLY">Weekly Digest</option>
                              </select>
                            </label>

                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-700">
                                Notify me about:
                              </p>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={search.notifyNewMatches}
                                  onChange={(e) =>
                                    updateAlertSettings(search.id, {
                                      notifyNewMatches: e.target.checked,
                                    })
                                  }
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                  New property matches
                                </span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={search.notifyPriceDrops}
                                  onChange={(e) =>
                                    updateAlertSettings(search.id, {
                                      notifyPriceDrops: e.target.checked,
                                    })
                                  }
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                  Price drops
                                </span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={search.notifyStatusChanges}
                                  onChange={(e) =>
                                    updateAlertSettings(search.id, {
                                      notifyStatusChanges: e.target.checked,
                                    })
                                  }
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                  Status changes (sold, rented, back on market)
                                </span>
                              </label>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-3 text-sm">
                      {search.emailAlerts ? (
                        <>
                          <Bell className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium">
                            Alerts enabled
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">
                            {search.alertFrequency.toLowerCase()} frequency
                          </span>
                        </>
                      ) : (
                        <>
                          <BellOff className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-500">Alerts disabled</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

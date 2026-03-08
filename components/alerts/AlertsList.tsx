'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Check, Trash2, X } from 'lucide-react';

interface Alert {
  id: string;
  type: 'NEW_MATCH' | 'PRICE_DROP' | 'STATUS_CHANGE' | 'BACK_ON_MARKET';
  title: string;
  message: string;
  propertyId: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    oldPrice?: number;
    newPrice?: number;
    percentDrop?: number;
    oldStatus?: string;
    newStatus?: string;
  };
  savedSearch?: {
    name: string;
  };
}

export default function AlertsList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const url = filter === 'unread' 
        ? '/api/alerts?unreadOnly=true' 
        : '/api/alerts';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });

      if (res.ok) {
        setAlerts(alerts.map(a => 
          a.id === alertId ? { ...a, read: true } : a
        ));
      }
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/alerts/mark-all-read', {
        method: 'POST',
      });

      if (res.ok) {
        setAlerts(alerts.map(a => ({ ...a, read: true })));
      }
    } catch (error) {
      console.error('Failed to mark all alerts as read:', error);
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAlerts(alerts.filter(a => a.id !== alertId));
      }
    } catch (error) {
      console.error('Failed to delete alert:', error);
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'NEW_MATCH':
        return '🏡';
      case 'PRICE_DROP':
        return '💰';
      case 'STATUS_CHANGE':
        return '📢';
      case 'BACK_ON_MARKET':
        return '🔄';
      default:
        return '🔔';
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'NEW_MATCH':
        return 'border-blue-500 bg-blue-50';
      case 'PRICE_DROP':
        return 'border-green-500 bg-green-50';
      case 'STATUS_CHANGE':
        return 'border-yellow-500 bg-yellow-50';
      case 'BACK_ON_MARKET':
        return 'border-purple-500 bg-purple-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary-600" />
            <h2 className="text-3xl font-bold">Alerts & Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Check className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Alerts
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'unread'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Unread Only
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-12">
          <BellOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No alerts yet
          </h3>
          <p className="text-gray-600">
            When properties match your saved searches, you&apos;ll see alerts here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 rounded-lg shadow-sm p-4 ${getAlertColor(
                alert.type
              )} ${!alert.read ? 'ring-2 ring-blue-300' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {alert.title}
                      </h3>
                      {alert.savedSearch && (
                        <p className="text-sm text-gray-600">
                          From: {alert.savedSearch.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{alert.message}</p>
                  
                  {alert.metadata && alert.type === 'PRICE_DROP' && (
                    <div className="text-sm bg-white/50 rounded p-2 inline-block">
                      <span className="line-through text-gray-500">
                        ${alert.metadata.oldPrice?.toLocaleString()}
                      </span>
                      {' → '}
                      <span className="text-green-600 font-bold">
                        ${alert.metadata.newPrice?.toLocaleString()}
                      </span>
                      {' '}
                      <span className="text-green-600">
                        ({alert.metadata.percentDrop}% off)
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-3">
                    <a
                      href={`/properties/${alert.propertyId}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Property →
                    </a>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.createdAt).toLocaleDateString()} at{' '}
                      {new Date(alert.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!alert.read && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete alert"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

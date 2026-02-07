'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { Property } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Layers, Navigation, Eye, EyeOff } from 'lucide-react'

// Set your Mapbox access token
console.log('[MapView] Module loaded, checking Mapbox token')
console.log('[MapView] NEXT_PUBLIC_MAPBOX_TOKEN:', process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? 'Set (length: ' + process.env.NEXT_PUBLIC_MAPBOX_TOKEN.length + ')' : 'NOT SET')

// Validate token format
const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
if (token && !token.startsWith('pk.')) {
  console.error('[MapView] ERROR: Invalid Mapbox token format. Token should start with "pk."')
}

// Test token validity by making a simple API call
if (token) {
  console.log('[MapView] Testing token validity...')
  fetch(`https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=${token}`)
    .then(response => {
      console.log('[MapView] Token test response status:', response.status)
      if (response.status === 200) {
        console.log('[MapView] ✅ Token is VALID and working!')
      } else if (response.status === 401) {
        console.error('[MapView] ❌ Token is INVALID or EXPIRED!')
      } else {
        console.warn('[MapView] ⚠️ Unexpected response:', response.status)
      }
      return response.json()
    })
    .then(data => {
      console.log('[MapView] Style API response:', data)
    })
    .catch(error => {
      console.error('[MapView] Token test failed:', error)
    })
}

mapboxgl.accessToken = token || ''
console.log('[MapView] Mapbox accessToken set:', mapboxgl.accessToken ? 'Yes (length: ' + mapboxgl.accessToken.length + ')' : 'No')

interface MapViewProps {
  latitude?: number
  longitude?: number
  zoom?: number
  properties?: Property[]
  interactive?: boolean
  showControls?: boolean
  onBoundsChange?: (bounds: mapboxgl.LngLatBounds) => void
  onPropertyClick?: (property: Property) => void
}

interface Layer {
  id: string
  name: string
  enabled: boolean
  icon: string
}

export default function MapView({ 
  latitude = 37.7749, 
  longitude = -122.4194, 
  zoom = 12,
  properties = [],
  interactive = true,
  showControls = true,
  onBoundsChange,
  onPropertyClick
}: MapViewProps) {
  console.log('[MapView] Component rendering with props:', { 
    latitude, 
    longitude, 
    zoom, 
    propertiesCount: properties?.length || 0, 
    interactive, 
    showControls 
  })

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const draw = useRef<MapboxDraw | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const [showStreetView, setShowStreetView] = useState(false)
  const [streetViewCoords, setStreetViewCoords] = useState<[number, number]>([longitude, latitude])
  const [layers, setLayers] = useState<Layer[]>([
    { id: 'schools', name: 'Schools', enabled: false, icon: '🏫' },
    { id: 'transit', name: 'Public Transit', enabled: false, icon: '🚇' },
    { id: 'neighborhoods', name: 'Neighborhoods', enabled: true, icon: '🏘️' },
  ])

  // Track client-side mounting
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    if (!isMounted) {
      console.log('[MapView] Not mounted yet, skipping map initialization')
      return
    }
    
    console.log('[MapView] Map initialization useEffect triggered')
    console.log('[MapView] mapContainer.current:', mapContainer.current)
    console.log('[MapView] map.current:', map.current)
    console.log('[MapView] Mapbox token:', process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? 'Set' : 'Missing')
    
    if (mapContainer.current) {
      const rect = mapContainer.current.getBoundingClientRect()
      console.log('[MapView] Map container dimensions:', {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left
      })
      
      if (rect.width === 0 || rect.height === 0) {
        console.error('[MapView] ⚠️ WARNING: Map container has zero dimensions!')
      }
    }
    
    if (!mapContainer.current || map.current) {
      console.log('[MapView] Skipping map init - container or map already exists')
      return
    }

    try {
      console.log('[MapView] Creating new Mapbox map instance')
      
      // Use the standard mapbox:// protocol
      const styleUrl = 'mapbox://styles/mapbox/streets-v11'
      
      console.log('[MapView] Map config:', {
        container: 'mapContainer',
        style: styleUrl,
        center: [longitude, latitude],
        zoom: zoom,
        interactive: interactive,
        accessToken: mapboxgl.accessToken?.substring(0, 20) + '...'
      })
      
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: styleUrl,
        center: [longitude, latitude],
        zoom: zoom,
        interactive: interactive
      })
      console.log('[MapView] Map instance created successfully')
      console.log('[MapView] Map object:', map.current)
      
      // Add comprehensive event handlers
      map.current.on('load', () => {
        console.log('[MapView] ✅ Map LOAD event fired - map fully loaded!')
        console.log('[MapView] Map loaded at:', new Date().toISOString())
      })
      
      map.current.on('style.load', () => {
        console.log('[MapView] ✅ Map style.load event fired - style loaded successfully!')
      })
      
      map.current.on('data', (e) => {
        if (e.dataType === 'style') {
          console.log('[MapView] Style data event:', e.isSourceLoaded)
        }
      })
      
      map.current.on('error', (e) => {
        console.error('[MapView] ❌ Map ERROR event:', e)
        console.error('[MapView] Error details:', {
          error: e.error,
          message: e.error?.message,
          status: e.error?.status,
          url: e.error?.url
        })
        
        // Try to provide helpful error message
        if (e.error?.message) {
          if (e.error.message.includes('401')) {
            console.error('[MapView] 💡 Token unauthorized - token may be invalid or expired')
          } else if (e.error.message.includes('network')) {
            console.error('[MapView] 💡 Network error - check internet connection or firewall')
          }
        }
      })
      
      map.current.on('styledata', (e) => {
        console.log('[MapView] Map styledata event:', e.type)
      })
      
      map.current.on('sourcedataloading', (e) => {
        console.log('[MapView] Map sourcedataloading event:', e.sourceId)
      })
      
      // Check if style is loaded after a delay
      setTimeout(() => {
        if (map.current) {
          const isStyleLoaded = map.current.isStyleLoaded()
          console.log('[MapView] Style loaded check (after 3s):', isStyleLoaded)
          if (!isStyleLoaded) {
            console.error('[MapView] ⚠️ Style still not loaded after 3 seconds')
            console.error('[MapView] 💡 Try: 1) Check browser console for network errors')
            console.error('[MapView] 💡 Try: 2) Check browser dev tools Network tab for failed requests')
            console.error('[MapView] 💡 Try: 3) Refresh the page')
          }
        }
      }, 3000)
    } catch (error) {
      console.error('[MapView] Error creating map instance:', error)
      if (error instanceof Error) {
        console.error('[MapView] Error name:', error.name)
        console.error('[MapView] Error message:', error.message)
        console.error('[MapView] Error stack:', error.stack)
      }
      throw error
    }

    // Add navigation controls
    if (showControls) {
      try {
        console.log('[MapView] Adding navigation controls')
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
        map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')
        console.log('[MapView] Navigation controls added')
      } catch (error) {
        console.error('[MapView] Error adding controls:', error)
      }
    }

    // Add drawing controls for custom boundaries
    if (interactive) {
      try {
        console.log('[MapView] Adding drawing controls')
        draw.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true
        },
        styles: [
          // Custom styling for drawn shapes
          {
            'id': 'gl-draw-polygon-fill',
            'type': 'fill',
            'paint': {
              'fill-color': '#3b82f6',
              'fill-opacity': 0.1
            }
          },
          {
            'id': 'gl-draw-polygon-stroke-active',
            'type': 'line',
            'paint': {
              'line-color': '#3b82f6',
              'line-width': 3
            }
          }
        ]
      })
      map.current.addControl(draw.current as any, 'top-left')
      console.log('[MapView] Drawing controls added')

      // Handle draw events
      map.current.on('draw.create', updateArea)
      map.current.on('draw.delete', updateArea)
      map.current.on('draw.update', updateArea)
      console.log('[MapView] Draw event listeners attached')
      } catch (error) {
        console.error('[MapView] Error setting up drawing controls:', error)
      }
    }

    // Handle map movements for search boundary updates
    if (onBoundsChange) {
      map.current.on('moveend', () => {
        if (map.current) {
          const bounds = map.current.getBounds()
          if (bounds) {
            onBoundsChange(bounds)
          }
        }
      })
    }

    // Add click handler for Street View
    if (interactive) {
      map.current.on('click', (e) => {
        setStreetViewCoords([e.lngLat.lng, e.lngLat.lat])
      })
    }

    // Add layers when map loads
    map.current.on('load', () => {
      console.log('[MapView] Map loaded, adding layers')
      try {
        addNeighborhoodBoundaries()
        addSchoolsLayer()
        addTransitLayer()
        console.log('[MapView] Layers added successfully')
      } catch (error) {
        console.error('[MapView] Error adding layers:', error)
      }
    })

    return () => {
      markersRef.current.forEach(marker => marker.remove())
      map.current?.remove()
    }
  }, [isMounted])

  // Update property markers when properties change
  useEffect(() => {
    console.log('[MapView] Properties useEffect triggered, count:', properties?.length || 0)
    if (!map.current || !properties.length) {
      console.log('[MapView] Skipping property markers - no map or no properties')
      return
    }

    // Function to add properties to the map
    const addPropertiesToMap = () => {
      console.log('[MapView] addPropertiesToMap called, style loaded:', map.current?.isStyleLoaded())
      if (!map.current || !map.current.isStyleLoaded()) {
        console.log('[MapView] Map style not loaded yet, will retry when loaded')
        return
      }

      // Clear existing markers
      console.log('[MapView] Clearing', markersRef.current.length, 'existing markers')
      try {
        markersRef.current.forEach(marker => marker.remove())
        markersRef.current = []
        console.log('[MapView] Markers cleared')
      } catch (error) {
        console.error('[MapView] Error clearing markers:', error)
      }

      // Add GeoJSON source for clustering
      try {
        if (map.current.getSource('properties')) {
          console.log('[MapView] Updating existing properties source')
            const features = properties.map(property => ({
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [property.longitude, property.latitude]
            },
            properties: {
              id: property.id,
              title: property.title,
              price: property.price,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              image: property.images?.[0],
              listingType: property.listingType
            }
          }))
          console.log('[MapView] Created', features.length, 'features from properties')
          
          (map.current.getSource('properties') as mapboxgl.GeoJSONSource).setData({
            type: 'FeatureCollection',
            features
          })
          console.log('[MapView] Properties source data updated')
        } else {
          console.log('[MapView] Creating new properties source')
          const features = properties.map(property => ({
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [property.longitude, property.latitude]
            },
            properties: {
              id: property.id,
              title: property.title,
              price: property.price,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              image: property.images?.[0],
              listingType: property.listingType
            }
          }))
          console.log('[MapView] Created', features.length, 'features for new source')
          
          map.current.addSource('properties', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features
            },
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50
          })
          console.log('[MapView] Properties source added to map')

      // Add cluster circles
      console.log('[MapView] Adding cluster layers')
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'properties',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#3b82f6',
            10,
            '#2563eb',
            30,
            '#1d4ed8'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            10,
            30,
            30,
            40
          ]
        }
      })
      console.log('[MapView] Cluster circles layer added')

      // Add cluster count labels
      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'properties',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff'
        }
      })
      console.log('[MapView] Cluster count labels layer added')

      // Add individual property markers
      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'properties',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#3b82f6',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      })
      console.log('[MapView] Unclustered points layer added')

      // Click handler for clusters
      console.log('[MapView] Setting up cluster click handler')
      map.current.on('click', 'clusters', (e) => {
        console.log('[MapView] Cluster clicked')
        try {
          if (!map.current) return
          const features = map.current.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          })
          const clusterId = features[0].properties?.cluster_id
          const source = map.current.getSource('properties') as mapboxgl.GeoJSONSource
          
          source.getClusterExpansionZoom(clusterId, (err, expansionZoom) => {
            if (err || !map.current || expansionZoom === null || expansionZoom === undefined) {
              console.error('[MapView] Error getting cluster expansion zoom:', err)
              return
            }
            const coordinates = (features[0].geometry as any).coordinates
            map.current.easeTo({
              center: coordinates,
              zoom: expansionZoom
            })
            console.log('[MapView] Zoomed to cluster')
          })
        } catch (error) {
          console.error('[MapView] Error handling cluster click:', error)
        }
      })

      // Click handler for individual properties
      console.log('[MapView] Setting up unclustered point click handler')
      map.current.on('click', 'unclustered-point', (e) => {
        console.log('[MapView] Unclustered point clicked')
        try {
          if (!e.features?.[0]) return
          const feature = e.features[0]
          const props = feature.properties
          const coordinates = (feature.geometry as any).coordinates.slice()

        // Create popup with property preview
        const popupContent = `
          <div class="property-popup" style="min-width: 250px;">
            <img src="${props?.image}" alt="${props?.title}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px 8px 0 0;" />
            <div style="padding: 12px;">
              <div style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 4px;">
                ${formatPrice(props?.price)}${props?.listingType === 'FOR_RENT' ? '/mo' : ''}
              </div>
              <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">${props?.title}</div>
              <div style="font-size: 13px; color: #6b7280;">
                ${props?.bedrooms} bed • ${props?.bathrooms} bath
              </div>
              <a href="/properties/${props?.id}" 
                 style="display: block; margin-top: 12px; padding: 8px; background: #3b82f6; color: white; text-align: center; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">
                View Details
              </a>
            </div>
          </div>
        `

        new mapboxgl.Popup({ offset: 25 })
          .setLngLat(coordinates)
          .setHTML(popupContent)
          .addTo(map.current!)

        // Call property click handler if provided
        if (onPropertyClick) {
          const property = properties.find(p => p.id === props?.id)
          if (property) onPropertyClick(property)
        }
        } catch (error) {
          console.error('[MapView] Error handling unclustered point click:', error)
        }
      })

      // Change cursor on hover
      console.log('[MapView] Setting up cursor change handlers')
      map.current.on('mouseenter', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer'
      })
      map.current.on('mouseleave', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = ''
      })
      map.current.on('mouseenter', 'unclustered-point', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer'
      })
      map.current.on('mouseleave', 'unclustered-point', () => {
        if (map.current) map.current.getCanvas().style.cursor = ''
      })
      console.log('[MapView] All layers and handlers setup complete')
        }
      } catch (error) {
        console.error('[MapView] Error in properties setup:', error)
      }
    }

    // Wait for the map style to load before adding properties
    if (map.current.isStyleLoaded()) {
      console.log('[MapView] Style already loaded, adding properties immediately')
      addPropertiesToMap()
    } else {
      console.log('[MapView] Style not loaded, waiting for load event')
      map.current.once('load', addPropertiesToMap)
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.off('load', addPropertiesToMap)
      }
    }
  }, [properties])

  // Toggle layers
  useEffect(() => {
    console.log('[MapView] Layer toggle useEffect triggered')
    if (!map.current || !map.current.isStyleLoaded()) {
      console.log('[MapView] Map not ready or style not loaded, skipping layer toggle')
      return
    }

    layers.forEach(layer => {
      const visibility = layer.enabled ? 'visible' : 'none'
      try {
        if (map.current?.getLayer(layer.id)) {
          map.current.setLayoutProperty(layer.id, 'visibility', visibility)
          console.log(`[MapView] Toggled layer ${layer.id} to ${visibility}`)
        }
        if (map.current?.getLayer(`${layer.id}-labels`)) {
          map.current.setLayoutProperty(`${layer.id}-labels`, 'visibility', visibility)
          console.log(`[MapView] Toggled layer ${layer.id}-labels to ${visibility}`)
        }
      } catch (error) {
        // Layer might not exist yet, ignore error
        console.debug(`[MapView] Layer ${layer.id} not ready yet`, error)
      }
    })
  }, [layers])

  function updateArea() {
    console.log('[MapView] updateArea called')
    if (!draw.current) {
      console.log('[MapView] Draw control not initialized')
      return
    }
    try {
      const data = draw.current.getAll()
      if (data.features.length > 0 && onBoundsChange) {
        // Calculate bounds from drawn polygon
        const coordinates = data.features[0].geometry.coordinates[0]
        const bounds = coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: number[]) => {
          return bounds.extend(coord as [number, number])
        }, new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number]))
        
        onBoundsChange(bounds)
        console.log('[MapView] Bounds updated from drawn area')
      }
    } catch (error) {
      console.error('[MapView] Error in updateArea:', error)
    }
  }

  function addNeighborhoodBoundaries() {
    console.log('[MapView] addNeighborhoodBoundaries called')
    if (!map.current) {
      console.log('[MapView] Map not initialized')
      return
    }
    
    try {
      // Add neighborhood boundaries (sample data - replace with real GeoJSON)
      map.current.addSource('neighborhoods', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [] // Add real neighborhood boundary data here
        }
      })

      map.current.addLayer({
        id: 'neighborhoods',
        type: 'line',
        source: 'neighborhoods',
        layout: {
          'visibility': 'visible'
        },
        paint: {
          'line-color': '#6b7280',
          'line-width': 2,
          'line-dasharray': [2, 2]
        }
      })
      console.log('[MapView] Neighborhood boundaries layer added')
    } catch (error) {
      console.error('[MapView] Error adding neighborhood boundaries:', error)
    }
  }

  function addSchoolsLayer() {
    console.log('[MapView] addSchoolsLayer called')
    if (!map.current) {
      console.log('[MapView] Map not initialized')
      return
    }

    try {
      // Add schools POI layer (using Mapbox POI data)
      map.current.addLayer({
        id: 'schools',
        type: 'symbol',
        source: 'composite',
        'source-layer': 'poi_label',
        filter: ['==', 'class', 'school'],
        layout: {
          'visibility': 'none',
          'icon-image': 'college-15',
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
          'text-size': 11,
          'text-offset': [0, 1.5],
          'text-anchor': 'top'
        },
        paint: {
          'text-color': '#059669',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2
        }
      })
      console.log('[MapView] Schools layer added')
    } catch (error) {
      console.error('[MapView] Error adding schools layer:', error)
    }
  }

  function addTransitLayer() {
    console.log('[MapView] addTransitLayer called')
    if (!map.current) {
      console.log('[MapView] Map not initialized')
      return
    }

    try {
      // Add transit layer (using Mapbox transit data)
      map.current.addLayer({
        id: 'transit',
        type: 'symbol',
        source: 'composite',
        'source-layer': 'poi_label',
        filter: ['in', 'class', 'bus', 'railway', 'subway'],
        layout: {
          'visibility': 'none',
          'icon-image': 'rail-15',
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
          'text-size': 11,
          'text-offset': [0, 1.5],
          'text-anchor': 'top'
        },
        paint: {
          'text-color': '#2563eb',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2
        }
      })
      console.log('[MapView] Transit layer added')
    } catch (error) {
      console.error('[MapView] Error adding transit layer:', error)
    }
  }

  function toggleLayer(layerId: string) {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
    ))
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Layer Controls */}
      {showControls && interactive && (
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className="bg-white rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors"
            title="Toggle Layers"
          >
            <Layers className="w-5 h-5 text-gray-700" />
          </button>
          
          {showLayerPanel && (
            <div className="mt-2 bg-white rounded-lg shadow-lg p-4 min-w-[200px]">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Map Layers</h3>
              <div className="space-y-2">
                {layers.map(layer => (
                  <label key={layer.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={layer.enabled}
                      onChange={() => toggleLayer(layer.id)}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-lg">{layer.icon}</span>
                    <span className="text-sm text-gray-700">{layer.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Street View Toggle */}
      {showControls && interactive && (
        <div className="absolute bottom-24 right-4 z-10">
          <button
            onClick={() => setShowStreetView(!showStreetView)}
            className={`bg-white rounded-lg shadow-lg p-3 transition-all ${
              showStreetView ? 'bg-primary-600 text-white' : 'hover:bg-gray-50 text-gray-700'
            }`}
            title="Toggle Street View"
          >
            {showStreetView ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      )}

      {/* Street View Panel - Using Mapbox Street View */}
      {showStreetView && (
        <div className="absolute bottom-4 right-4 w-96 h-64 bg-white rounded-lg shadow-2xl overflow-hidden z-20">
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={() => setShowStreetView(false)}
              className="bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center p-4">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-600">Street View at</p>
              <p className="text-xs text-gray-500 font-mono mt-1">
                {streetViewCoords[1].toFixed(6)}, {streetViewCoords[0].toFixed(6)}
              </p>
              <a
                href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${streetViewCoords[1]},${streetViewCoords[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700 transition-colors"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

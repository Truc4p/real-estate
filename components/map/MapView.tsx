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
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNrZW5kZGRhejBhYWcyeXM4MjdnZGRhd2cifQ.xyz'

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
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const draw = useRef<MapboxDraw | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const [showStreetView, setShowStreetView] = useState(false)
  const [streetViewCoords, setStreetViewCoords] = useState<[number, number]>([longitude, latitude])
  const [layers, setLayers] = useState<Layer[]>([
    { id: 'schools', name: 'Schools', enabled: false, icon: '🏫' },
    { id: 'transit', name: 'Public Transit', enabled: false, icon: '🚇' },
    { id: 'neighborhoods', name: 'Neighborhoods', enabled: true, icon: '🏘️' },
  ])

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: zoom,
      interactive: interactive
    })

    // Add navigation controls
    if (showControls) {
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')
    }

    // Add drawing controls for custom boundaries
    if (interactive) {
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

      // Handle draw events
      map.current.on('draw.create', updateArea)
      map.current.on('draw.delete', updateArea)
      map.current.on('draw.update', updateArea)
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
      addNeighborhoodBoundaries()
      addSchoolsLayer()
      addTransitLayer()
    })

    return () => {
      markersRef.current.forEach(marker => marker.remove())
      map.current?.remove()
    }
  }, [])

  // Update property markers when properties change
  useEffect(() => {
    if (!map.current || !properties.length) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add GeoJSON source for clustering
    if (map.current.getSource('properties')) {
      (map.current.getSource('properties') as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: properties.map(property => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [property.longitude, property.latitude]
          },
          properties: {
            id: property.id,
            title: property.title,
            price: property.price,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            image: property.images[0],
            listingType: property.listingType
          }
        }))
      })
    } else {
      map.current.addSource('properties', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: properties.map(property => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [property.longitude, property.latitude]
            },
            properties: {
              id: property.id,
              title: property.title,
              price: property.price,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              image: property.images[0],
              listingType: property.listingType
            }
          }))
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      })

      // Add cluster circles
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

      // Click handler for clusters
      map.current.on('click', 'clusters', (e) => {
        if (!map.current) return
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        })
        const clusterId = features[0].properties?.cluster_id
        const source = map.current.getSource('properties') as mapboxgl.GeoJSONSource
        
        source.getClusterExpansionZoom(clusterId, (err, expansionZoom) => {
          if (err || !map.current || expansionZoom === null || expansionZoom === undefined) return
          const coordinates = (features[0].geometry as any).coordinates
          map.current.easeTo({
            center: coordinates,
            zoom: expansionZoom
          })
        })
      })

      // Click handler for individual properties
      map.current.on('click', 'unclustered-point', (e) => {
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
      })

      // Change cursor on hover
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
    }
  }, [properties])

  // Toggle layers
  useEffect(() => {
    if (!map.current) return

    layers.forEach(layer => {
      const visibility = layer.enabled ? 'visible' : 'none'
      if (map.current?.getLayer(layer.id)) {
        map.current.setLayoutProperty(layer.id, 'visibility', visibility)
      }
      if (map.current?.getLayer(`${layer.id}-labels`)) {
        map.current.setLayoutProperty(`${layer.id}-labels`, 'visibility', visibility)
      }
    })
  }, [layers])

  function updateArea() {
    if (!draw.current) return
    const data = draw.current.getAll()
    if (data.features.length > 0 && onBoundsChange) {
      // Calculate bounds from drawn polygon
      const coordinates = data.features[0].geometry.coordinates[0]
      const bounds = coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: number[]) => {
        return bounds.extend(coord as [number, number])
      }, new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number]))
      
      onBoundsChange(bounds)
    }
  }

  function addNeighborhoodBoundaries() {
    if (!map.current) return
    
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
  }

  function addSchoolsLayer() {
    if (!map.current) return

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
  }

  function addTransitLayer() {
    if (!map.current) return

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

      {/* Street View Panel */}
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
          <iframe
            src={`https://www.google.com/maps/embed/v1/streetview?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&location=${streetViewCoords[1]},${streetViewCoords[0]}&heading=0&pitch=0&fov=90`}
            className="w-full h-full"
            loading="lazy"
          />
        </div>
      )}
    </div>
  )
}

'use client'

interface MapViewProps {
  latitude?: number
  longitude?: number
  zoom?: number
}

export default function MapView({ 
  latitude = 37.7749, 
  longitude = -122.4194, 
  zoom = 15 
}: MapViewProps) {
  // Using Google Maps Embed API
  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`

  return (
    <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden relative">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={mapUrl}
        className="w-full h-full"
        title="Property Location Map"
        loading="lazy"
      />
    </div>
  )
}

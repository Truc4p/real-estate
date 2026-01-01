export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-56 bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-4">
        {/* Price */}
        <div className="mb-3">
          <div className="h-8 bg-gray-200 rounded w-32" />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-3">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-5 bg-gray-200 rounded w-20" />
        </div>

        {/* Address */}
        <div className="mb-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>

        {/* Property Type */}
        <div className="pt-3 border-t border-gray-100">
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  )
}

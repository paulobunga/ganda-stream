export default function ContentItemSkeleton() {
  return (
    <div className="px-2">
      <div className="relative h-28 min-w-[180px] md:h-36 md:min-w-[260px] bg-gray-800 rounded-sm md:rounded animate-pulse">
        <div className="absolute bottom-2 left-2 right-2 h-4 bg-gray-700 rounded"></div>
      </div>
    </div>
  )
}


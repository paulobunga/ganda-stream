"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, X } from "lucide-react"
import Image from "next/image"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import type { Content } from "@/lib/store"
import { debounce } from "lodash"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Content[]>([])
  const { content, fetchContent } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      fetchContent()
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen, fetchContent])

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const results = content.filter((item) => item.title.toLowerCase().includes(term.toLowerCase()))
      setSearchResults(results)
    }, 300),
    [content],
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    debouncedSearch(term)
  }

  const handleContentClick = (item: Content) => {
    if (item.type === "movie" || item.type === "episode") {
      router.push(`/watch/${item.id}`)
    } else if (item.type === "series") {
      router.push(`/series/${item.id}`)
    } else if (item.type === "music") {
      // Implement music playback logic
      console.log("Play music:", item.title)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto pt-20 px-4">
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="text-white hover:text-gray-300" aria-label="Close search">
            <X size={24} />
          </button>
        </div>
        <div className="mb-8">
          <div className="flex items-center bg-white rounded-full overflow-hidden">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search for movies, TV shows, and music..."
              className="w-full py-3 px-6 text-black focus:outline-none"
              aria-label="Search content"
            />
            <div className="bg-red-600 p-3">
              <Search className="text-white" />
            </div>
          </div>
        </div>
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-800 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleContentClick(item)}
              >
                <Image
                  src={item.imageUrl || `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(item.title)}`}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="w-full object-cover"
                />
                <div className="p-2">
                  <h3 className="text-white text-sm">{item.title}</h3>
                  <p className="text-gray-400 text-xs">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <p className="text-center text-gray-400">No results found for "{searchTerm}"</p>
        ) : null}
      </div>
    </div>
  )
}


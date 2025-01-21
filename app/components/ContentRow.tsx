"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Slider from "react-slick"
import { ChevronLeft, ChevronRight, Play, Download, Check } from "lucide-react"
import { useStore } from "@/lib/store"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import type { Content } from "@/lib/store"
import { saveForOffline, getOfflineContent, removeOfflineContent } from "@/lib/offlineStorage"
import ContentItemSkeleton from "./ContentItemSkeleton"

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

interface ContentRowProps {
  title: string
  content: Content[]
  type: "movie" | "series" | "music"
}

export default function ContentRow({ title, content, type }: ContentRowProps) {
  const sliderRef = useRef<Slider>(null)
  const [downloadedContent, setDownloadedContent] = useState<Set<string>>(new Set())
  const { user, subscription } = useStore()
  const router = useRouter()

  useEffect(() => {
    const loadDownloadedContent = async () => {
      const offlineContent = await Promise.all(content.map((item) => getOfflineContent(item.id)))
      setDownloadedContent(new Set(offlineContent.filter(Boolean).map((c) => c!.id)))
    }
    loadDownloadedContent()
  }, [content])

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5.5,
    slidesToScroll: 5,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
    ],
  }

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev()
    }
  }

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext()
    }
  }

  const handleContentClick = (item: Content) => {
    if (user) {
      if (item.type === "movie" || item.type === "episode") {
        router.push(`/watch/${item.id}`)
      } else if (item.type === "series") {
        router.push(`/series/${item.id}`)
      } else if (item.type === "music") {
        // Implement music playback logic
        console.log("Play music:", item.title)
      }
    } else {
      toast.error("Please sign in to access content")
      router.push("/login")
    }
  }

  const handleDownload = async (item: Content) => {
    if (user && subscription?.status === "active") {
      if (item.isDownloadable) {
        try {
          if (downloadedContent.has(item.id)) {
            await removeOfflineContent(item.id)
            setDownloadedContent((prev) => {
              const newSet = new Set(prev)
              newSet.delete(item.id)
              return newSet
            })
            toast.success("Content removed from downloads")
          } else {
            await saveForOffline({
              id: item.id,
              type: item.type,
              title: item.title,
              url: item.contentUrl,
              expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            setDownloadedContent((prev) => new Set(prev).add(item.id))
            toast.success("Content downloaded for offline viewing")
          }
        } catch (error) {
          console.error("Download failed:", error)
          toast.error("Download failed. Please try again.")
        }
      } else {
        toast.error("This content is not available for download")
      }
    } else {
      toast.error("Please subscribe to download content")
      router.push("/subscription")
    }
  }

  const renderContent = () => {
    if (content.length === 0) {
      return Array(5)
        .fill(null)
        .map((_, index) => <ContentItemSkeleton key={index} />)
    }

    return content.map((item) => (
      <div key={item.id} className="px-2">
        <div
          className="relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] md:hover:scale-105"
          onClick={() => handleContentClick(item)}
        >
          <Image
            src={item.imageUrl || "/placeholder.svg"}
            className="rounded-sm object-cover md:rounded"
            layout="fill"
            alt={item.title}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
            <button className="mr-2 p-2 bg-white rounded-full" aria-label="Play">
              <Play className="h-6 w-6 text-black" />
            </button>
            {item.isDownloadable && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload(item)
                }}
                className="p-2 bg-white rounded-full"
                aria-label={downloadedContent.has(item.id) ? "Remove Download" : "Download"}
              >
                {downloadedContent.has(item.id) ? (
                  <Check className="h-6 w-6 text-black" />
                ) : (
                  <Download className="h-6 w-6 text-black" />
                )}
              </button>
            )}
          </div>
        </div>
        <div className="mt-2 text-sm">
          <p className="truncate text-white">{item.title}</p>
          {type === "music" && (
            <p className="truncate text-[#71717a]">{item.attributes.find((attr) => attr.key === "artist")?.value}</p>
          )}
        </div>
      </div>
    ))
  }

  return (
    <div className="space-y-0.5 md:space-y-2">
      <h2 className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl">
        {title}
      </h2>
      <div className="group relative md:-ml-2">
        <button
          className="absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
          onClick={handlePrev}
          aria-label="Previous content"
        >
          <ChevronLeft className="h-9 w-9" />
        </button>

        <Slider ref={sliderRef} {...settings} className="relative -mx-2">
          {renderContent()}
        </Slider>

        <button
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
          onClick={handleNext}
          aria-label="Next content"
        >
          <ChevronRight className="h-9 w-9" />
        </button>
      </div>
    </div>
  )
}


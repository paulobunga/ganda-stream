"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useStore } from "@/lib/store"
import { Play, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function FeaturedContentSlider() {
  const { featuredContent, fetchFeaturedContent } = useStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    fetchFeaturedContent()
  }, [fetchFeaturedContent])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === featuredContent.length - 1 ? 0 : prevIndex + 1))
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [featuredContent])

  const handlePlay = (content: any) => {
    if (content.type === "movie" || content.type === "episode") {
      router.push(`/watch/${content.id}`)
    } else if (content.type === "series") {
      router.push(`/series/${content.id}`)
    } else if (content.type === "music") {
      // Implement music playback logic
      console.log("Play music:", content.title)
    }
  }

  const handleMoreInfo = (content: any) => {
    if (content.type === "movie") {
      router.push(`/movie/${content.id}`)
    } else if (content.type === "series") {
      router.push(`/series/${content.id}`)
    } else if (content.type === "music") {
      router.push(`/music/${content.id}`)
    }
  }

  if (featuredContent.length === 0) {
    return (
      <div className="relative h-[56.25vw] bg-gray-900 animate-pulse">
        <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16 space-y-4">
          <div className="h-8 md:h-12 w-64 md:w-96 bg-gray-800 rounded"></div>
          <div className="h-4 md:h-6 w-48 md:w-80 bg-gray-800 rounded"></div>
          <div className="flex flex-row items-center mt-3 md:mt-4 gap-3">
            <div className="h-8 md:h-10 w-24 md:w-32 bg-gray-800 rounded"></div>
            <div className="h-8 md:h-10 w-24 md:w-32 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const currentContent = featuredContent[currentIndex]

  return (
    <div className="relative h-[56.25vw]">
      <Image
        src={currentContent.imageUrl || "/placeholder.svg?height=800&width=1422"}
        alt={currentContent.title}
        layout="fill"
        objectFit="cover"
      />
      <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16 space-y-4">
        <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold">{currentContent.title}</h1>
        <p className="text-[8px] md:text-lg mt-3 md:mt-8 w-[90%] md:w-[80%] lg:w-[50%]">{currentContent.description}</p>
        <div className="flex flex-row items-center mt-3 md:mt-4 gap-3">
          <Button onClick={() => handlePlay(currentContent)} className="bg-white text-black">
            <Play className="w-4 h-4 md:w-7 md:h-7 text-black mr-1" /> Play
          </Button>
          <Button onClick={() => handleMoreInfo(currentContent)} variant="secondary">
            <Info className="w-4 h-4 md:w-7 md:h-7 mr-1" /> More Info
          </Button>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 flex space-x-2">
        {featuredContent.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-gray-500"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}


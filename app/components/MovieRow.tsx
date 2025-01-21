"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Slider from "react-slick"
import { ChevronLeft, ChevronRight, Download, Check } from "lucide-react"
import Modal from "./Modal"
import PlayerPage from "./PlayerPage"
import { useStore } from "@/lib/store"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { saveForOffline, getOfflineContent, removeOfflineContent } from "@/lib/offlineStorage"

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

interface Movie {
  id: string
  title: string
  description: string
  imageUrl: string
  videoUrl: string
  isDownloadable: boolean
}

interface MovieRowProps {
  title: string
  movies: Movie[]
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const sliderRef = useRef<Slider>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [downloadedMovies, setDownloadedMovies] = useState<Set<string>>(new Set())
  const { user, subscription } = useStore()
  const router = useRouter()

  useEffect(() => {
    const loadDownloadedMovies = async () => {
      const offlineMovies = await Promise.all(movies.map((movie) => getOfflineContent(movie.id)))
      setDownloadedMovies(new Set(offlineMovies.filter(Boolean).map((m) => m!.id)))
    }
    loadDownloadedMovies()
  }, [movies])

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

  const openModal = (movie: Movie) => {
    if (user) {
      setSelectedMovie(movie)
      setIsModalOpen(true)
    } else {
      toast.error("Please sign in to view movie details")
      router.push("/login")
    }
  }

  const playMovie = () => {
    if (subscription && subscription.status === "active") {
      setIsModalOpen(false)
      setIsPlayerOpen(true)
    } else {
      toast.error("Please subscribe to watch this content")
      router.push("/subscription")
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleDownload = async (movie: Movie) => {
    if (user && subscription?.status === "active") {
      if (movie.isDownloadable) {
        try {
          if (downloadedMovies.has(movie.id)) {
            await removeOfflineContent(movie.id)
            setDownloadedMovies((prev) => {
              const newSet = new Set(prev)
              newSet.delete(movie.id)
              return newSet
            })
            toast.success("Movie removed from downloads")
          } else {
            await saveForOffline({
              id: movie.id,
              type: "movie",
              title: movie.title,
              url: movie.videoUrl,
              expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            setDownloadedMovies((prev) => new Set(prev).add(movie.id))
            toast.success("Movie downloaded for offline viewing")
          }
        } catch (error) {
          console.error("Download failed:", error)
          toast.error("Download failed. Please try again.")
        }
      } else {
        toast.error("This movie is not available for download")
      }
    } else {
      toast.error("Please subscribe to download movies")
      router.push("/subscription")
    }
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
          aria-label="Previous movies"
        >
          <ChevronLeft className="h-9 w-9" />
        </button>

        <Slider ref={sliderRef} {...settings} className="relative -mx-2">
          {movies.map((movie) => (
            <div key={movie.id} className="px-2">
              <div className="relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] md:hover:scale-105">
                <Image
                  src={movie.imageUrl || "/placeholder.svg"}
                  className="rounded-sm object-cover md:rounded"
                  layout="fill"
                  alt={movie.title}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal(movie)} className="mr-2 p-2 bg-white rounded-full" aria-label="Play">
                    {/* <Play className="h-6 w-6 text-black" /> */}
                  </button>
                  {movie.isDownloadable && (
                    <button
                      onClick={() => handleDownload(movie)}
                      className="p-2 bg-white rounded-full"
                      aria-label={downloadedMovies.has(movie.id) ? "Remove Download" : "Download"}
                    >
                      {downloadedMovies.has(movie.id) ? (
                        <Check className="h-6 w-6 text-black" />
                      ) : (
                        <Download className="h-6 w-6 text-black" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>

        <button
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
          onClick={handleNext}
          aria-label="Next movies"
        >
          <ChevronRight className="h-9 w-9" />
        </button>
      </div>

      {selectedMovie && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          onPlay={playMovie}
          movie={{
            title: selectedMovie.title,
            description: selectedMovie.description,
            image: selectedMovie.imageUrl,
          }}
        />
      )}
      {isPlayerOpen && selectedMovie && (
        <PlayerPage
          videoSrc={selectedMovie.videoUrl}
          movieTitle={selectedMovie.title}
          onClose={() => setIsPlayerOpen(false)}
        />
      )}
    </div>
  )
}


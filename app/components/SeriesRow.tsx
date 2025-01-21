import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { toast } from "react-hot-toast"
import { Play, Download, Check } from "lucide-react"
import { saveForOffline, getOfflineContent, removeOfflineContent } from "@/lib/offlineStorage"

interface Episode {
  id: string
  seasonNumber: number
  episodeNumber: number
  title: string
  videoUrl: string
  isDownloadable: boolean
}

interface Series {
  id: string
  title: string
  episodes?: Episode[]
}

const Shows = ({ shows, user, subscription }: { shows: Series[]; user: any; subscription: any }) => {
  const router = useRouter()
  const [downloadedEpisodes, setDownloadedEpisodes] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadDownloadedEpisodes = async () => {
      const offlineEpisodes = await Promise.all(
        shows.flatMap((s) => s.episodes || []).map((episode) => getOfflineContent(episode.id)),
      )
      setDownloadedEpisodes(new Set(offlineEpisodes.filter(Boolean).map((e) => e!.id)))
    }
    loadDownloadedEpisodes()
  }, [shows])

  const handleSeriesClick = (seriesId: string) => {
    router.push(`/series/${seriesId}`)
  }

  const handleDownload = async (seriesId: string, episode: Episode) => {
    if (user && subscription?.status === "active") {
      if (episode.isDownloadable) {
        try {
          if (downloadedEpisodes.has(episode.id)) {
            await removeOfflineContent(episode.id)
            setDownloadedEpisodes((prev) => {
              const newSet = new Set(prev)
              newSet.delete(episode.id)
              return newSet
            })
            toast.success("Episode removed from downloads")
          } else {
            await saveForOffline({
              id: episode.id,
              type: "episode",
              title: `${shows.find((s) => s.id === seriesId)?.title} - S${episode.seasonNumber}E${episode.episodeNumber}`,
              url: episode.videoUrl,
              expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            setDownloadedEpisodes((prev) => new Set(prev).add(episode.id))
            toast.success("Episode downloaded for offline viewing")
          }
        } catch (error) {
          console.error("Download failed:", error)
          toast.error("Download failed. Please try again.")
        }
      } else {
        toast.error("This episode is not available for download")
      }
    } else {
      toast.error("Please subscribe to download episodes")
      router.push("/subscription")
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shows.map((show) => (
        <div key={show.id} className="relative group">
          <img src="/images/placeholder.jpg" alt={show.title} className="w-full h-64 object-cover rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleSeriesClick(show.id)}
              className="mr-2 p-2 bg-white rounded-full"
              aria-label="View Series"
            >
              <Play className="h-6 w-6 text-black" />
            </button>
            {show.episodes && show.episodes.some((episode) => episode.isDownloadable) && (
              <button
                onClick={() => handleSeriesClick(show.id)}
                className="p-2 bg-white rounded-full"
                aria-label="View Episodes"
              >
                <Download className="h-6 w-6 text-black" />
              </button>
            )}
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-medium">{show.title}</h3>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Shows


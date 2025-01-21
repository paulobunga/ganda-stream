import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import type { Music } from "@/types/music"
import { Check, Download } from "react-feather"
// ... other imports

interface OfflineContent {
  id: string
  type: string
  title: string
  url: string
  expiresAt: number
}

const saveForOffline = async (content: OfflineContent) => {
  // ... implementation to save content offline
}

const getOfflineContent = async (id: string): Promise<OfflineContent | null> => {
  // ... implementation to retrieve offline content
}

const removeOfflineContent = async (id: string) => {
  // ... implementation to remove offline content
}

const MusicPlayer = ({ music, user, subscription }: { music: Music[]; user: any; subscription: any }) => {
  const router = useRouter()
  const [downloadedTracks, setDownloadedTracks] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadDownloadedTracks = async () => {
      const offlineTracks = await Promise.all(music.map((track) => getOfflineContent(track.id)))
      setDownloadedTracks(new Set(offlineTracks.filter(Boolean).map((t) => t!.id)))
    }
    loadDownloadedTracks()
  }, [music])

  const handleDownload = async (track: Music) => {
    if (user && subscription?.status === "active") {
      if (track.isDownloadable) {
        try {
          if (downloadedTracks.has(track.id)) {
            await removeOfflineContent(track.id)
            setDownloadedTracks((prev) => {
              const newSet = new Set(prev)
              newSet.delete(track.id)
              return newSet
            })
            toast.success("Track removed from downloads")
          } else {
            await saveForOffline({
              id: track.id,
              type: "music",
              title: `${track.artist} - ${track.title}`,
              url: track.audioUrl,
              expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
            })
            setDownloadedTracks((prev) => new Set(prev).add(track.id))
            toast.success("Track downloaded for offline listening")
          }
        } catch (error) {
          console.error("Download failed:", error)
          toast.error("Download failed. Please try again.")
        }
      } else {
        toast.error("This track is not available for download")
      }
    } else {
      toast.error("Please subscribe to download music")
      router.push("/subscription")
    }
  }

  return (
    <div>
      {music.map((track) => (
        <div key={track.id}>
          {/* ... other track details */}
          {track.isDownloadable && (
            <button
              onClick={() => handleDownload(track)}
              className="p-2 bg-white rounded-full"
              aria-label={downloadedTracks.has(track.id) ? "Remove Download" : "Download"}
            >
              {downloadedTracks.has(track.id) ? (
                <Check className="h-6 w-6 text-black" />
              ) : (
                <Download className="h-6 w-6 text-black" />
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default MusicPlayer


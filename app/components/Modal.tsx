import { useState, useEffect } from "react"
import { Play, Plus, X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onPlay: () => void
  movie: {
    title: string
    description: string
    image: string
  }
}

export default function Modal({ isOpen, onClose, onPlay, movie }: ModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
    >
      <div className="bg-zinc-900 rounded-lg max-w-2xl w-full mx-4">
        <div className="relative h-[56.25vw] max-h-[400px]">
          <img
            src={movie.image || "/placeholder.svg"}
            alt={movie.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-2">{movie.title}</h2>
          <p className="text-gray-300 mb-4">{movie.description}</p>
          <div className="flex space-x-4">
            <button
              onClick={onPlay}
              className="flex items-center justify-center bg-white text-black rounded px-4 py-2 font-bold hover:bg-gray-200 transition-colors"
            >
              <Play size={20} className="mr-2" />
              Play Now
            </button>
            <button className="flex items-center justify-center bg-gray-500 text-white rounded px-4 py-2 font-bold hover:bg-gray-600 transition-colors">
              <Plus size={20} className="mr-2" />
              Watch Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


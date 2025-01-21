import Image from "next/image"
import { Play, Info } from "lucide-react"

export default function FeaturedContent() {
  return (
    <div className="relative h-[56.25vw]">
      <Image src="/placeholder.svg?height=800&width=1422" alt="Featured Movie" layout="fill" objectFit="cover" />
      <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16">
        <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold">Movie Title</h1>
        <p className="text-[8px] md:text-lg mt-3 md:mt-8 w-[90%] md:w-[80%] lg:w-[50%]">
          This is a brief description of the featured movie. It's an exciting thriller that will keep you on the edge of
          your seat!
        </p>
        <div className="flex flex-row items-center mt-3 md:mt-4 gap-3">
          <button className="bg-white text-black rounded-md py-1 md:py-2 px-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-[#e6e6e6] transition">
            <Play className="w-4 h-4 md:w-7 md:h-7 text-black mr-1" /> Play
          </button>
          <button className="bg-[gray]/70 text-white rounded-md py-1 md:py-2 px-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-[gray]/30 transition">
            <Info className="w-4 h-4 md:w-7 md:h-7 mr-1" /> More Info
          </button>
        </div>
      </div>
    </div>
  )
}


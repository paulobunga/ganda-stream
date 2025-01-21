"use client"

import { useEffect } from "react"
import Header from "./components/Header"
import FeaturedContentSlider from "./components/FeaturedContentSlider"
import ContentRow from "./components/ContentRow"
import Footer from "./components/Footer"
import { useStore } from "@/lib/store"

export default function Home() {
  const { fetchUserProfile, fetchCategories, fetchContent, fetchFeaturedContent, categories, content } = useStore()

  useEffect(() => {
    fetchUserProfile()
    fetchCategories()
    fetchContent()
    fetchFeaturedContent()
  }, [fetchUserProfile, fetchCategories, fetchContent, fetchFeaturedContent])

  const movieContent = content.filter((item) => item.type === "movie")
  const seriesContent = content.filter((item) => item.type === "series")
  const musicContent = content.filter((item) => item.type === "music")

  const renderContent = () => {
    if (categories.length === 0) {
      return (
        <>
          <ContentRow title="Movies" content={[]} type="movie" />
          <ContentRow title="Series" content={[]} type="series" />
          <ContentRow title="Music" content={[]} type="music" />
        </>
      )
    }

    return categories.map((category) => (
      <div key={category.id}>
        <ContentRow
          title={`${category.name} Movies\`I understand. I'll continue the text stream from the cut-off point, maintaining coherence and consistency. Here's the continuation:

category.id}>
        <ContentRow
          title={\`${category.name} Movies`}
          content={movieContent.filter((movie) => movie.categories.some((c) => c.id === category.id))}
          type="movie"
        />
        <ContentRow
          title={`${category.name} Series`}
          content={seriesContent.filter((series) => series.categories.some((c) => c.id === category.id))}
          type="series"
        />
        <ContentRow
          title={`${category.name} Music`}
          content={musicContent.filter((music) => music.categories.some((c) => c.id === category.id))}
          type="music"
        />
      </div>
    ))
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <FeaturedContentSlider />
        <div className="px-4 md:px-16 mt-4 space-y-8">{renderContent()}</div>
      </main>
      <Footer />
    </div>
  )
}


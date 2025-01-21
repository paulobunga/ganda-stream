import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const categories = [
  "Action",
  "Comedy",
  "Drama",
  "Thriller",
  "Sci-Fi",
  "Horror",
  "Romance",
  "Documentary",
  "Animation",
  "Fantasy",
]

const movies = [
  {
    title: "The Matrix",
    description: "A computer programmer discovers a dystopian world inside a simulation.",
    category: "Sci-Fi",
  },
  {
    title: "Inception",
    description: "A thief enters people's dreams to plant ideas in their subconscious.",
    category: "Sci-Fi",
  },
  {
    title: "The Shawshank Redemption",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    category: "Drama",
  },
  {
    title: "Pulp Fiction",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    category: "Thriller",
  },
  {
    title: "The Dark Knight",
    description: "Batman faces off against the Joker in a battle for Gotham City's soul.",
    category: "Action",
  },
  {
    title: "Forrest Gump",
    description:
      "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    category: "Drama",
  },
  {
    title: "The Godfather",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    category: "Drama",
  },
  {
    title: "Schindler's List",
    description:
      "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
    category: "Drama",
  },
  {
    title: "Goodfellas",
    description:
      "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.",
    category: "Crime",
  },
  {
    title: "12 Angry Men",
    description:
      "A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.",
    category: "Drama",
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    description:
      "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    category: "Fantasy",
  },
  {
    title: "Star Wars: Episode IV - A New Hope",
    description:
      "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.",
    category: "Sci-Fi",
  },
  {
    title: "The Silence of the Lambs",
    description:
      "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.",
    category: "Thriller",
  },
  {
    title: "Saving Private Ryan",
    description:
      "Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.",
    category: "Action",
  },
  {
    title: "Spirited Away",
    description:
      "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    category: "Animation",
  },
]

async function seedDatabase() {
  // Insert categories
  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .upsert(categories.map((name) => ({ name })))
    .select()

  if (categoryError) {
    console.error("Error inserting categories:", categoryError)
    return
  }

  console.log("Categories inserted successfully")

  // Create a map of category names to their IDs
  const categoryMap = new Map(categoryData.map((cat) => [cat.name, cat.id]))

  // Insert movies
  const movieInserts = movies.map((movie) => ({
    title: movie.title,
    description: movie.description,
    image_url: `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(movie.title)}`,
    video_url: "/placeholder-video.mp4",
    category_id: categoryMap.get(movie.category),
  }))

  const { data: movieData, error: movieError } = await supabase.from("movies").upsert(movieInserts).select()

  if (movieError) {
    console.error("Error inserting movies:", movieError)
    return
  }

  console.log("Movies inserted successfully")
}

seedDatabase()
  .then(() => console.log("Database seeded successfully"))
  .catch((error) => console.error("Error seeding database:", error))


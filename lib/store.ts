import { create } from "zustand"
import { supabase } from "./supabase"

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  address: string
  city: string
  postalCode: string
  paymentMethod: string
  subscriptionId: string | null
}

interface Subscription {
  id: string
  planName: string
  status: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
}

interface Category {
  id: string
  name: string
}

interface ContentAttribute {
  key: string
  value: string
}

interface Content {
  id: string
  title: string
  description: string
  releaseDate: Date
  imageUrl: string
  contentUrl: string
  isFeatured: boolean
  isDownloadable: boolean
  type: "movie" | "series" | "episode" | "music"
  parentId?: string
  attributes: ContentAttribute[]
  categories: Category[]
}

interface AppState {
  user: UserProfile | null
  subscription: Subscription | null
  isAuthenticated: boolean
  categories: Category[]
  content: Content[]
  featuredContent: Content[]
  setUser: (user: UserProfile | null) => void
  setSubscription: (subscription: Subscription | null) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
  setCategories: (categories: Category[]) => void
  setContent: (content: Content[]) => void
  setFeaturedContent: (featuredContent: Content[]) => void
  fetchUserProfile: () => Promise<void>
  fetchSubscription: () => Promise<void>
  fetchCategories: () => Promise<void>
  fetchContent: () => Promise<void>
  fetchFeaturedContent: () => Promise<void>
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  subscription: null,
  isAuthenticated: false,
  categories: [],
  content: [],
  featuredContent: [],
  setUser: (user) => set({ user }),
  setSubscription: (subscription) => set({ subscription }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setCategories: (categories) => set({ categories }),
  setContent: (content) => set({ content }),
  setFeaturedContent: (featuredContent) => set({ featuredContent }),
  fetchUserProfile: async () => {
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

        if (profile) {
          set({
            user: {
              id: user.id,
              firstName: profile.first_name,
              lastName: profile.last_name,
              email: user.email!,
              phone: profile.phone,
              country: profile.country,
              address: profile.address,
              city: profile.city,
              postalCode: profile.postal_code,
              paymentMethod: profile.payment_method,
              subscriptionId: profile.subscription_id,
            },
            isAuthenticated: true,
          })
        }
      }
    }
  },
  fetchSubscription: async () => {
    const { user } = get()
    if (supabase && user && user.subscriptionId) {
      const { data: subscription, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("id", user.subscriptionId)
        .single()

      if (error) {
        console.error("Error fetching subscription:", error)
      } else if (subscription) {
        set({
          subscription: {
            id: subscription.id,
            planName: subscription.plan_name,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start),
            currentPeriodEnd: new Date(subscription.current_period_end),
          },
        })
      }
    }
  },
  fetchCategories: async () => {
    if (supabase) {
      const { data, error } = await supabase.from("categories").select("*").order("name")

      if (error) {
        console.error("Error fetching categories:", error)
      } else {
        set({ categories: data })
      }
    }
  },
  fetchContent: async () => {
    if (supabase) {
      const { data: contentData, error: contentError } = await supabase.from("content").select(`
          *,
          content_attributes (key, value),
          content_categories (category_id)
        `)

      if (contentError) {
        console.error("Error fetching content:", contentError)
      } else {
        const { categories } = get()
        const content = contentData.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          releaseDate: new Date(item.release_date),
          imageUrl: item.image_url,
          contentUrl: item.content_url,
          isFeatured: item.is_featured,
          isDownloadable: item.is_downloadable,
          type: item.type,
          parentId: item.parent_id,
          attributes: item.content_attributes,
          categories: item.content_categories.map((cc) => categories.find((c) => c.id === cc.category_id)!),
        }))
        set({ content })
      }
    }
  },
  fetchFeaturedContent: async () => {
    if (supabase) {
      const { data, error } = await supabase.from("featured_content").select("*")

      if (error) {
        console.error("Error fetching featured content:", error)
      } else {
        const featuredContent = data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          releaseDate: new Date(item.release_date),
          imageUrl: item.image_url,
          contentUrl: item.content_url,
          isFeatured: true,
          isDownloadable: item.is_downloadable,
          type: item.type,
          parentId: item.parent_id,
          attributes: [],
          categories: [],
        }))
        set({ featuredContent })
      }
    }
  },
}))


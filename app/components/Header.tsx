"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, Search, Lock, User, Download } from "lucide-react"
import { supabase } from "@/lib/supabase"
import SearchModal from "./SearchModal"
import AuthModal from "./AuthModal"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useStore } from "@/lib/store"

export default function Header() {
  const { user, isAuthenticated, setUser, setIsAuthenticated, fetchUserProfile } = useStore()
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN") {
          await fetchUserProfile()
          toast.success("Signed in successfully")
        } else if (event === "SIGNED_OUT") {
          setUser(null)
          setIsAuthenticated(false)
          toast.success("Signed out successfully")
        }
      })

      fetchUserProfile()

      return () => {
        authListener.subscription.unsubscribe()
      }
    }
  }, [fetchUserProfile, setUser, setIsAuthenticated])

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
      setUser(null)
      setIsAuthenticated(false)
      router.push("/")
    }
  }

  return (
    <header className="fixed top-0 z-50 w-full flex items-center justify-between p-4 transition-all lg:px-10 lg:py-6">
      <div className="flex items-center space-x-2 md:space-x-8">
        <Image src="/netflix-logo.svg" alt="Netflix" width={100} height={32} />
        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="text-sm font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]">
            Home
          </Link>
          <Link
            href="/tv-shows"
            className="text-sm font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]"
          >
            TV Shows
          </Link>
          <Link
            href="/movies"
            className="text-sm font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]"
          >
            Movies
          </Link>
          <Link
            href="/new-and-popular"
            className="text-sm font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]"
          >
            New & Popular
          </Link>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={() => setIsSearchModalOpen(true)} aria-label="Search">
          <Search className="h-6 w-6 text-white" />
        </button>
        <Bell className="h-6 w-6 text-white" />
        <Link href="/downloads" className="text-white">
          <Download className="h-6 w-6" />
        </Link>
        {user ? (
          <div className="relative group">
            <Image
              src={user.user_metadata?.avatar_url || "/placeholder.svg?height=32&width=32"}
              alt="User"
              width={32}
              height={32}
              className="rounded-full cursor-pointer"
            />
            <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <p className="px-4 py-2 text-sm text-white">{user.email}</p>
              <Link href="/subscription" className="block px-4 py-2 text-sm text-white hover:bg-zinc-700">
                Manage Subscription
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setIsAuthModalOpen(true)} aria-label="Authenticate" className="text-white">
            <Lock className="h-6 w-6" />
          </button>
        )}
      </div>
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  )
}


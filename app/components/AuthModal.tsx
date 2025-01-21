"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"
import PasswordResetRequestForm from "./PasswordResetRequestForm"
import { Toaster } from "react-hot-toast"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthView = "login" | "register" | "passwordReset"

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [view, setView] = useState<AuthView>("login")

  const handleViewChange = (newView: AuthView) => {
    setView(newView)
  }

  return (
    <>
      <Toaster position="top-center" />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {view === "login" ? "Sign In" : view === "register" ? "Sign Up" : "Reset Password"}
            </DialogTitle>
            <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </DialogHeader>
          {view === "login" && <LoginForm onViewChange={handleViewChange} />}
          {view === "register" && <RegisterForm onViewChange={handleViewChange} />}
          {view === "passwordReset" && <PasswordResetRequestForm onViewChange={handleViewChange} />}
        </DialogContent>
      </Dialog>
    </>
  )
}


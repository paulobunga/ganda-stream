"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  onViewChange: (view: "register" | "passwordReset") => void
}

export default function LoginForm({ onViewChange }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword(values)
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Logged in successfully")
        router.push("/") // Redirect to home page after successful login
      }
    } else {
      toast.error("Supabase client is not initialized")
    }
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Button variant="link" onClick={() => onViewChange("passwordReset")}>
          Forgot password?
        </Button>
      </div>
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-400">Don't have an account? </span>
        <Button variant="link" onClick={() => onViewChange("register")}>
          Sign up
        </Button>
      </div>
    </Form>
  )
}


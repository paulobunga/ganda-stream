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

const passwordResetSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

type PasswordResetFormValues = z.infer<typeof passwordResetSchema>

interface PasswordResetFormProps {
  onViewChange: (view: "login") => void
}

export default function PasswordResetForm({ onViewChange }: PasswordResetFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: PasswordResetFormValues) => {
    setIsLoading(true)
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Password reset email sent. Please check your inbox.")
        onViewChange("login")
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Button variant="link" onClick={() => onViewChange("login")}>
          Back to Login
        </Button>
      </div>
    </Form>
  )
}


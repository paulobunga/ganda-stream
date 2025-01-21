"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Step1BasicInfo from "./registration-steps/Step1BasicInfo"
import Step2AccountDetails from "./registration-steps/Step2AccountDetails"
import Step3AddressInfo from "./registration-steps/Step3AddressInfo"
import Step4PaymentMethod from "./registration-steps/Step4PaymentMethod"

const registerSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 characters long" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
    confirmPassword: z.string(),
    country: z.string().min(1, { message: "Country is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    postalCode: z.string().min(1, { message: "Postal code is required" }),
    paymentMethod: z.enum(["mobileMoneyAirtel", "mobileMoneyMTN", "visaMastercard"]),
    terms: z.boolean().refine((val) => val === true, { message: "You must accept the terms of service" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onViewChange: (view: "login") => void
}

export default function RegisterForm({ onViewChange }: RegisterFormProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      country: "",
      address: "",
      city: "",
      postalCode: "",
      paymentMethod: "visaMastercard",
      terms: false,
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true)
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      })

      if (error) {
        toast.error(error.message)
      } else if (data.user) {
        const { error: profileError } = await supabase.from("user_profiles").insert({
          id: data.user.id,
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone,
          country: values.country,
          address: values.address,
          city: values.city,
          postal_code: values.postalCode,
          payment_method: values.paymentMethod,
        })

        if (profileError) {
          toast.error("Error saving user profile")
        } else {
          toast.success("Registration successful. Please check your email to verify your account.")
          router.push("/") // Redirect to home page after successful registration
        }
      }
    } else {
      toast.error("Supabase client is not initialized")
    }
    setIsLoading(false)
  }

  const nextStep = () => setStep((prevStep) => prevStep + 1)
  const prevStep = () => setStep((prevStep) => prevStep - 1)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {step === 1 && <Step1BasicInfo form={form} />}
        {step === 2 && <Step2AccountDetails form={form} />}
        {step === 3 && <Step3AddressInfo form={form} />}
        {step === 4 && <Step4PaymentMethod form={form} />}

        <div className="flex justify-between">
          {step > 1 && (
            <Button type="button" onClick={prevStep} variant="outline">
              Previous
            </Button>
          )}
          {step < 4 ? (
            <Button type="button" onClick={nextStep} className="ml-auto">
              Next
            </Button>
          ) : (
            <Button type="submit" className="ml-auto" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign up"}
            </Button>
          )}
        </div>
      </form>
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-400">Already have an account? </span>
        <Button variant="link" onClick={() => onViewChange("login")}>
          Log in
        </Button>
      </div>
    </Form>
  )
}


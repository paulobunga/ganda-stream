"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"

export default function SubscriptionPage() {
  const { user, subscription, fetchSubscription } = useStore()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      fetchSubscription()
    }
  }, [user, router, fetchSubscription])

  const handleSubscribe = async (planName: string) => {
    setLoading(true)
    // Here you would typically redirect to Flutterwave for payment
    // For this example, we'll just create a subscription directly
    const { data, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: user?.id,
        plan_name: planName,
        status: "active",
        current_period_start: new Date(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      })
      .select()
      .single()

    if (error) {
      toast.error("Failed to create subscription")
      console.error(error)
    } else if (data) {
      await supabase.from("user_profiles").update({ subscription_id: data.id }).eq("id", user?.id)
      toast.success("Subscription created successfully")
      fetchSubscription()
    }
    setLoading(false)
  }

  const handleCancelSubscription = async () => {
    setLoading(true)
    const { error } = await supabase.from("subscriptions").update({ status: "cancelled" }).eq("id", subscription?.id)
    if (error) {
      toast.error("Failed to cancel subscription")
      console.error(error)
    } else {
      toast.success("Subscription cancelled successfully")
      fetchSubscription()
    }
    setLoading(false)
  }

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Subscription Management</h1>
      {subscription ? (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Plan: {subscription.planName}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Status: {subscription.status}</p>
            <p>Current period ends: {subscription.currentPeriodEnd.toLocaleDateString()}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCancelSubscription} disabled={loading}>
              Cancel Subscription
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Plan</CardTitle>
              <CardDescription>For casual viewers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$8.99/month</p>
              <ul className="list-disc list-inside mt-2">
                <li>HD streaming</li>
                <li>Watch on 1 device at a time</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSubscribe("basic")} disabled={loading}>
                Subscribe
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Standard Plan</CardTitle>
              <CardDescription>For families</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$13.99/month</p>
              <ul className="list-disc list-inside mt-2">
                <li>Full HD streaming</li>
                <li>Watch on 2 devices at a time</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSubscribe("standard")} disabled={loading}>
                Subscribe
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Premium Plan</CardTitle>
              <CardDescription>For ultimate experience</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$17.99/month</p>
              <ul className="list-disc list-inside mt-2">
                <li>4K Ultra HD streaming</li>
                <li>Watch on 4 devices at a time</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSubscribe("premium")} disabled={loading}>
                Subscribe
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}


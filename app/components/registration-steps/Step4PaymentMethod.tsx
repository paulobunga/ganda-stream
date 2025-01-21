import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

export default function Step4PaymentMethod({ form }) {
  const country = form.watch("country")

  return (
    <>
      <FormField
        control={form.control}
        name="paymentMethod"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Payment Method</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                {country === "uganda" && (
                  <>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="mobileMoneyAirtel" />
                      </FormControl>
                      <FormLabel className="font-normal">Mobile Money (Airtel)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="mobileMoneyMTN" />
                      </FormControl>
                      <FormLabel className="font-normal">Mobile Money (MTN)</FormLabel>
                    </FormItem>
                  </>
                )}
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="visaMastercard" />
                  </FormControl>
                  <FormLabel className="font-normal">Visa/Mastercard</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="terms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I accept the{" "}
                <a href="/terms" className="text-blue-500 hover:underline">
                  terms of service
                </a>
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </>
  )
}


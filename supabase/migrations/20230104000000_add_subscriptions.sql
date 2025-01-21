-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own subscription
CREATE POLICY "Users can read their own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow service role to manage subscriptions
CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
  USING (auth.role() = 'service_role');

-- Create trigger to set updated_at on update
CREATE TRIGGER set_updated_at_subscriptions
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add subscription_id to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN subscription_id UUID REFERENCES public.subscriptions(id);


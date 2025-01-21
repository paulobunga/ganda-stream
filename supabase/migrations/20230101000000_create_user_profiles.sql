-- Create a table for user profiles
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  country TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to read and update their own profile
CREATE POLICY "Users can read and update their own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);

-- Create a trigger to set updated_at on update
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);


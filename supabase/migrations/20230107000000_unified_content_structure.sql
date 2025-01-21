-- Drop existing content-related tables
DROP TABLE IF EXISTS public.movies CASCADE;
DROP TABLE IF EXISTS public.series CASCADE;
DROP TABLE IF EXISTS public.episodes CASCADE;
DROP TABLE IF EXISTS public.music CASCADE;

-- Create unified content table
CREATE TABLE public.content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  release_date DATE,
  image_url TEXT,
  content_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_downloadable BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create content_type enum
CREATE TYPE content_type AS ENUM ('movie', 'series', 'episode', 'music');

-- Create content_attributes table
CREATE TABLE public.content_attributes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create content_categories table (many-to-many relationship)
CREATE TABLE public.content_categories (
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, category_id)
);

-- Add type column to content table
ALTER TABLE public.content ADD COLUMN type content_type NOT NULL;

-- Add parent_id column to content table for series-episode relationship
ALTER TABLE public.content ADD COLUMN parent_id UUID REFERENCES public.content(id);

-- Create indexes
CREATE INDEX idx_content_type ON public.content(type);
CREATE INDEX idx_content_attributes_content_id ON public.content_attributes(content_id);
CREATE INDEX idx_content_attributes_key ON public.content_attributes(key);
CREATE INDEX idx_content_categories_content_id ON public.content_categories(content_id);
CREATE INDEX idx_content_categories_category_id ON public.content_categories(category_id);

-- Enable Row Level Security
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to content" ON public.content FOR SELECT USING (true);
CREATE POLICY "Allow public read access to content attributes" ON public.content_attributes FOR SELECT USING (true);
CREATE POLICY "Allow public read access to content categories" ON public.content_categories FOR SELECT USING (true);

-- Create or replace featured_content view
CREATE OR REPLACE VIEW public.featured_content AS
SELECT 
  id,
  title,
  description,
  image_url,
  content_url,
  type,
  parent_id
FROM 
  public.content
WHERE 
  is_featured = TRUE;

-- Grant select permission on featured_content view
GRANT SELECT ON public.featured_content TO anon, authenticated;

-- Create triggers to set updated_at on update
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_updated_at_content
BEFORE UPDATE ON public.content
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_updated_at_content_attributes
BEFORE UPDATE ON public.content_attributes
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();


-- Add featured column to movies table
ALTER TABLE public.movies ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT FALSE;

-- Add featured column to series table
ALTER TABLE public.series ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT FALSE;

-- Create featured_content view
CREATE OR REPLACE VIEW public.featured_content AS
SELECT 
  'movie' AS content_type,
  id,
  title,
  description,
  image_url,
  video_url,
  category_id
FROM 
  public.movies
WHERE 
  is_featured = TRUE

UNION ALL

SELECT 
  'series' AS content_type,
  id,
  title,
  description,
  image_url,
  NULL AS video_url,
  category_id
FROM 
  public.series
WHERE 
  is_featured = TRUE;

-- Grant select permission on featured_content view
GRANT SELECT ON public.featured_content TO anon, authenticated;


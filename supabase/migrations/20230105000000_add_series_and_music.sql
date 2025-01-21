-- Create series table
CREATE TABLE public.series (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create episodes table
CREATE TABLE public.episodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  series_id UUID REFERENCES public.series(id),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  episode_number INT NOT NULL,
  season_number INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create music table
CREATE TABLE public.music (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  image_url TEXT,
  audio_url TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add is_downloadable column to movies, episodes, and music tables
ALTER TABLE public.movies ADD COLUMN is_downloadable BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.episodes ADD COLUMN is_downloadable BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.music ADD COLUMN is_downloadable BOOLEAN NOT NULL DEFAULT FALSE;

-- Enable Row Level Security
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to series" ON public.series FOR SELECT USING (true);
CREATE POLICY "Allow public read access to episodes" ON public.episodes FOR SELECT USING (true);
CREATE POLICY "Allow public read access to music" ON public.music FOR SELECT USING (true);

-- Create triggers to set updated_at on update
CREATE TRIGGER set_updated_at_series
BEFORE UPDATE ON public.series
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_updated_at_episodes
BEFORE UPDATE ON public.episodes
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_updated_at_music
BEFORE UPDATE ON public.music
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();


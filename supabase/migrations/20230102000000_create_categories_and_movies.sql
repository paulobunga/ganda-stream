-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create movies table
CREATE TABLE movies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to movies" ON movies FOR SELECT USING (true);

-- Create triggers to set updated_at on update
CREATE TRIGGER set_updated_at_categories
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER set_updated_at_movies
BEFORE UPDATE ON movies
FOR EACH ROW
EXECUTE FUNCTION moddatetime(updated_at);

-- Insert some sample data
INSERT INTO categories (name) VALUES
('Trending Now'),
('Top Rated'),
('Action Thrillers');

INSERT INTO movies (title, description, image_url, video_url, category_id)
SELECT 
  'Movie ' || i,
  'This is a brief description of Movie ' || i || '. It''s an exciting film that you won''t want to miss!',
  '/placeholder.svg?height=400&width=600&text=Movie ' || i,
  '/placeholder-video.mp4',
  c.id
FROM generate_series(1, 30) i
CROSS JOIN (SELECT id FROM categories ORDER BY RANDOM() LIMIT 1) c;


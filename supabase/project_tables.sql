-- Table projects
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  year INTEGER NOT NULL,
  category TEXT NOT NULL,
  agency TEXT,
  client TEXT,
  responsibilities TEXT[], -- Array PostgreSQL
  development TEXT,
  external_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table project_medias (relation 1-N)
CREATE TABLE project_medias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT CHECK (type IN ('image', 'video')) NOT NULL,
  alt TEXT,
  duration INTEGER, -- secondes
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes par projet
CREATE INDEX idx_medias_project ON project_medias(project_id);

-- RLS pour projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON projects FOR SELECT USING (true);
CREATE POLICY "Auth insert" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete" ON projects FOR DELETE TO authenticated USING (true);

-- RLS pour project_medias
ALTER TABLE project_medias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON project_medias FOR SELECT USING (true);
CREATE POLICY "Auth insert" ON project_medias FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update" ON project_medias FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete" ON project_medias FOR DELETE TO authenticated USING (true);
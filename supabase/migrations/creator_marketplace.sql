-- Creator Marketplace: campaigns, creator profiles, applications, leads

CREATE TABLE IF NOT EXISTS campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  title text NOT NULL,
  destination text NOT NULL,
  description text,
  price_per_person integer,
  departure_date date,
  return_date date,
  seats integer DEFAULT 10,
  niche text DEFAULT 'adventure',
  status text DEFAULT 'open' CHECK (status IN ('open', 'closed', 'completed')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS creator_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  name text NOT NULL,
  instagram_handle text,
  youtube_handle text,
  followers_count integer DEFAULT 0,
  niche text[] DEFAULT '{}',
  bio text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campaign_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  creator_id uuid REFERENCES creator_profiles(id) ON DELETE CASCADE,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  tracking_slug text UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  created_at timestamptz DEFAULT now(),
  UNIQUE(campaign_id, creator_id)
);

CREATE TABLE IF NOT EXISTS creator_leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid REFERENCES campaign_applications(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  travel_month text,
  budget text,
  adults integer DEFAULT 2,
  created_at timestamptz DEFAULT now()
);

-- RLS: campaigns visible to owning business
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_leads ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS (used by our API routes)

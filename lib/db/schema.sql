-- Users table
CREATE TABLE IF NOT EXISTS users (
  fid BIGINT PRIMARY KEY,
  signer_uuid TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  space TEXT CHECK (space IN ('builder', 'creator')) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  availability TEXT,
  portfolio_links TEXT[] DEFAULT '{}',
  pfp_url TEXT,
  follower_count INTEGER DEFAULT 0,
  recent_casts JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Swipes table
CREATE TABLE IF NOT EXISTS swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_fid BIGINT NOT NULL REFERENCES users(fid) ON DELETE CASCADE,
  swiped_fid BIGINT NOT NULL REFERENCES users(fid) ON DELETE CASCADE,
  action TEXT CHECK (action IN ('yes', 'maybe', 'skip')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swiper_fid, swiped_fid)
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fid_1 BIGINT NOT NULL REFERENCES users(fid) ON DELETE CASCADE,
  fid_2 BIGINT NOT NULL REFERENCES users(fid) ON DELETE CASCADE,
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(fid_1, fid_2),
  CHECK (fid_1 < fid_2)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fid BIGINT NOT NULL REFERENCES users(fid) ON DELETE CASCADE,
  notification_token TEXT,
  notification_url TEXT,
  enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(fid)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_swipes_swiper ON swipes(swiper_fid);
CREATE INDEX IF NOT EXISTS idx_swipes_swiped ON swipes(swiped_fid);
CREATE INDEX IF NOT EXISTS idx_matches_fid1 ON matches(fid_1);
CREATE INDEX IF NOT EXISTS idx_matches_fid2 ON matches(fid_2);
CREATE INDEX IF NOT EXISTS idx_notifications_fid ON notifications(fid);
CREATE INDEX IF NOT EXISTS idx_users_space ON users(space);


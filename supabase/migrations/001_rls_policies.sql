-- ============================================
-- OROMO TIMES — Row-Level Security Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS policies
-- ============================================

-- Anyone can read public user profiles
CREATE POLICY "Public profiles are viewable by everyone" ON users
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Only admins can insert/delete users
CREATE POLICY "Admins can manage users" ON users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- ARTICLES policies
-- ============================================

-- Published articles readable by everyone
CREATE POLICY "Published articles are public" ON articles
  FOR SELECT USING (status = 'published');

-- Authors can see their own articles (any status)
CREATE POLICY "Authors can view own articles" ON articles
  FOR SELECT USING (author_id = auth.uid());

-- Editors and admins can see all articles
CREATE POLICY "Editors can view all articles" ON articles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('editor', 'admin'))
  );

-- Journalists can insert articles
CREATE POLICY "Journalists can create articles" ON articles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('journalist', 'editor', 'admin'))
  );

-- Authors can update own drafts
CREATE POLICY "Authors can update own articles" ON articles
  FOR UPDATE USING (author_id = auth.uid());

-- Editors can update any article
CREATE POLICY "Editors can update articles" ON articles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('editor', 'admin'))
  );

-- Only admins can delete articles
CREATE POLICY "Admins can delete articles" ON articles
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- COMMENTS policies
-- ============================================

-- Anyone can read comments
CREATE POLICY "Comments are public" ON comments
  FOR SELECT USING (true);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can comment" ON comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update own comments
CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete own comments, admins can delete any
CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- CATEGORIES policies
-- ============================================

CREATE POLICY "Categories are public" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- TAGS policies
-- ============================================

CREATE POLICY "Tags are public" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Staff can manage tags" ON tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('journalist', 'editor', 'admin'))
  );

-- ============================================
-- ARTICLE_TAGS policies
-- ============================================

CREATE POLICY "Article tags are public" ON article_tags
  FOR SELECT USING (true);

CREATE POLICY "Staff can manage article tags" ON article_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('journalist', 'editor', 'admin'))
  );

-- ============================================
-- DISTRIBUTION_LOGS policies
-- ============================================

CREATE POLICY "Admins can view distribution logs" ON distribution_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('editor', 'admin'))
  );

CREATE POLICY "System can insert distribution logs" ON distribution_logs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('editor', 'admin'))
  );

-- ============================================
-- PERFORMANCE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_article_tags_article ON article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_article_tags_tag ON article_tags(tag_id);

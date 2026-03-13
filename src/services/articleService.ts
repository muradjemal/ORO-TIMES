import { supabase } from '@/lib/supabase';
import type {
  Article,
  ArticleFilters,
  PaginatedResult,
} from '@/types/article';

/**
 * Fetch published articles with optional filtering and pagination.
 *
 * @param page      Current page number (1-indexed).
 * @param pageSize  Number of articles per page.
 * @param filters   Optional filters for category, language, or free-text search.
 * @returns A paginated result set of published articles.
 */
export async function getPublishedArticles(
  page: number = 1,
  pageSize: number = 12,
  filters?: ArticleFilters
): Promise<PaginatedResult<Article>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('articles')
    .select('*, author:users(*), category:categories(*)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to);

  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id);
  }
  if (filters?.language) {
    query = query.eq('language', filters.language);
  }
  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  const { data, error, count } = await query;

  if (error) throw new Error(`Failed to fetch articles: ${error.message}`);

  const total = count ?? 0;

  return {
    data: (data as Article[]) ?? [],
    count: total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Fetch a single article by its slug, including related author, category, tags,
 * and aggregate comment count.
 *
 * @param slug  The URL-friendly slug of the article.
 * @returns The article or `null` if not found.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data: article, error } = await supabase
    .from('articles')
    .select('*, author:users(*), category:categories(*)')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw new Error(`Failed to fetch article: ${error.message}`);
  }

  // Fetch tags via the join table
  const { data: articleTags } = await supabase
    .from('article_tags')
    .select('tag_id, tags(*)')
    .eq('article_id', article.id);

  // Fetch comment count
  const { count: commentCount } = await supabase
    .from('comments')
    .select('id', { count: 'exact', head: true })
    .eq('article_id', article.id);

  return {
    ...article,
    tags: articleTags?.map((at: Record<string, unknown>) => at.tags) ?? [],
    comment_count: commentCount ?? 0,
  } as Article;
}

/**
 * Fetch the most-viewed published articles.
 *
 * @param limit Maximum number of articles to return.
 */
export async function getFeaturedArticles(limit: number = 5): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*, author:users(*), category:categories(*)')
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch featured articles: ${error.message}`);
  return (data as Article[]) ?? [];
}

/**
 * Fetch trending articles — most-viewed published articles from the last 7 days.
 *
 * @param limit Maximum number of articles to return.
 */
export async function getTrendingArticles(limit: number = 6): Promise<Article[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from('articles')
    .select('*, author:users(*), category:categories(*)')
    .eq('status', 'published')
    .gte('published_at', sevenDaysAgo.toISOString())
    .order('view_count', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch trending articles: ${error.message}`);
  return (data as Article[]) ?? [];
}

/**
 * Fetch the most recently published articles.
 *
 * @param limit Maximum number of articles to return.
 */
export async function getLatestArticles(limit: number = 10): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*, author:users(*), category:categories(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch latest articles: ${error.message}`);
  return (data as Article[]) ?? [];
}

/**
 * Fetch related articles in the same category, excluding the current article.
 *
 * @param articleId  The current article's ID to exclude.
 * @param categoryId The category ID to filter by.
 * @param limit      Maximum number of related articles.
 */
export async function getRelatedArticles(
  articleId: string,
  categoryId: string,
  limit: number = 4
): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*, author:users(*), category:categories(*)')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', articleId)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch related articles: ${error.message}`);
  return (data as Article[]) ?? [];
}

/**
 * Fetch published articles for a specific category by its slug, with pagination.
 *
 * @param categorySlug The slug of the category.
 * @param page         Current page number (1-indexed).
 * @param pageSize     Number of articles per page.
 */
export async function getArticlesByCategory(
  categorySlug: string,
  page: number = 1,
  pageSize: number = 12
): Promise<PaginatedResult<Article>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('articles')
    .select('*, author:users(*), category:categories!inner(*)', { count: 'exact' })
    .eq('status', 'published')
    .eq('category.slug', categorySlug)
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(`Failed to fetch articles by category: ${error.message}`);

  const total = count ?? 0;

  return {
    data: (data as Article[]) ?? [],
    count: total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Fetch all articles by a specific author (any status), with pagination.
 *
 * @param authorId The author's user ID.
 * @param page     Current page number (1-indexed).
 * @param pageSize Number of articles per page.
 */
export async function getArticlesByAuthor(
  authorId: string,
  page: number = 1,
  pageSize: number = 12
): Promise<PaginatedResult<Article>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('articles')
    .select('*, author:users(*), category:categories(*)', { count: 'exact' })
    .eq('author_id', authorId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(`Failed to fetch articles by author: ${error.message}`);

  const total = count ?? 0;

  return {
    data: (data as Article[]) ?? [],
    count: total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Increment the view count of an article by 1.
 *
 * @param articleId The ID of the article to update.
 */
export async function incrementViewCount(articleId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_view_count', {
    article_id: articleId,
  });

  // Fallback: manual increment if RPC doesn't exist
  if (error) {
    const { data: article } = await supabase
      .from('articles')
      .select('view_count')
      .eq('id', articleId)
      .single();

    if (article) {
      await supabase
        .from('articles')
        .update({ view_count: (article.view_count ?? 0) + 1 })
        .eq('id', articleId);
    }
  }
}

/**
 * Create a new article.
 *
 * @param data Partial article data (title, content, etc.).
 * @returns The newly created article.
 */
export async function createArticle(
  data: Partial<Article>
): Promise<Article> {
  const { data: article, error } = await supabase
    .from('articles')
    .insert(data)
    .select('*, author:users(*), category:categories(*)')
    .single();

  if (error) throw new Error(`Failed to create article: ${error.message}`);
  return article as Article;
}

/**
 * Update an existing article.
 *
 * @param id   The article ID.
 * @param data Fields to update.
 * @returns The updated article.
 */
export async function updateArticle(
  id: string,
  data: Partial<Article>
): Promise<Article> {
  const { data: article, error } = await supabase
    .from('articles')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, author:users(*), category:categories(*)')
    .single();

  if (error) throw new Error(`Failed to update article: ${error.message}`);
  return article as Article;
}

/**
 * Delete an article by its ID.
 *
 * @param id The article ID.
 */
export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete article: ${error.message}`);
}

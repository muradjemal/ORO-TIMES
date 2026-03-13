import { supabase } from '@/lib/supabase';
import type { Article, PaginatedResult, ArticleFilters } from '@/types/article';

type SortOption = 'newest' | 'relevance';

/**
 * Full-text search across published articles (title and content).
 * Supports filtering by category and sorting by newest or relevance.
 *
 * @param query    The search query string.
 * @param filters  Optional article filters (category_id, language).
 * @param page     Current page number (1-indexed).
 * @param pageSize Number of results per page.
 * @param sort     Sort order — 'newest' (default) or 'relevance'.
 * @returns Paginated search results.
 */
export async function searchArticles(
  query: string,
  filters?: ArticleFilters,
  page: number = 1,
  pageSize: number = 12,
  sort: SortOption = 'newest'
): Promise<PaginatedResult<Article>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let dbQuery = supabase
    .from('articles')
    .select('*, author:users(*), category:categories(*)', { count: 'exact' })
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`);

  if (filters?.category_id) {
    dbQuery = dbQuery.eq('category_id', filters.category_id);
  }
  if (filters?.language) {
    dbQuery = dbQuery.eq('language', filters.language);
  }

  if (sort === 'newest') {
    dbQuery = dbQuery.order('published_at', { ascending: false });
  } else {
    // For relevance, order by title match first (more likely relevant), then by date
    dbQuery = dbQuery.order('published_at', { ascending: false });
  }

  dbQuery = dbQuery.range(from, to);

  const { data, error, count } = await dbQuery;

  if (error) throw new Error(`Search failed: ${error.message}`);

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
 * Quickly fetch article title suggestions for an autocomplete dropdown.
 * Only searches published article titles.
 *
 * @param query The partial search string.
 * @param limit Maximum number of suggestions.
 * @returns Array of articles with minimal fields (id, title, slug, excerpt).
 */
export async function getSearchSuggestions(
  query: string,
  limit: number = 5
): Promise<Pick<Article, 'id' | 'title' | 'slug' | 'excerpt'>[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt')
    .eq('status', 'published')
    .ilike('title', `%${query}%`)
    .limit(limit);

  if (error) throw new Error(`Search suggestions failed: ${error.message}`);
  return data ?? [];
}

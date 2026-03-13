import { useState, useEffect, useCallback } from 'react';
import type { Article, ArticleFilters, PaginatedResult } from '@/types/article';
import * as articleService from '@/services/articleService';

// ---------------------------------------------------------------------------
// usePublishedArticles
// ---------------------------------------------------------------------------

/** Fetch published articles with pagination and optional filters. */
export function usePublishedArticles(
  page: number = 1,
  pageSize: number = 12,
  filters?: ArticleFilters
) {
  const [data, setData] = useState<PaginatedResult<Article> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await articleService.getPublishedArticles(page, pageSize, filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters?.category_id, filters?.language, filters?.search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useArticle
// ---------------------------------------------------------------------------

/** Fetch a single article by slug and increment its view count on mount. */
export function useArticle(slug: string) {
  const [data, setData] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const article = await articleService.getArticleBySlug(slug);
      setData(article);

      // Increment view count (fire-and-forget)
      if (article) {
        articleService.incrementViewCount(article.id).catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch article');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useFeaturedArticles
// ---------------------------------------------------------------------------

/** Fetch featured (most-viewed) articles. */
export function useFeaturedArticles() {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const articles = await articleService.getFeaturedArticles();
      setData(articles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured articles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useTrendingArticles
// ---------------------------------------------------------------------------

/** Fetch trending articles from the last 7 days. */
export function useTrendingArticles() {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const articles = await articleService.getTrendingArticles();
      setData(articles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trending articles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useLatestArticles
// ---------------------------------------------------------------------------

/** Fetch the most recently published articles. */
export function useLatestArticles() {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const articles = await articleService.getLatestArticles();
      setData(articles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch latest articles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useRelatedArticles
// ---------------------------------------------------------------------------

/** Fetch related articles in the same category, excluding the current one. */
export function useRelatedArticles(articleId: string, categoryId: string) {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!articleId || !categoryId) return;
    try {
      setLoading(true);
      setError(null);
      const articles = await articleService.getRelatedArticles(articleId, categoryId);
      setData(articles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch related articles');
    } finally {
      setLoading(false);
    }
  }, [articleId, categoryId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useArticlesByCategory
// ---------------------------------------------------------------------------

/** Fetch published articles for a given category slug. */
export function useArticlesByCategory(
  categorySlug: string,
  page: number = 1,
  pageSize: number = 12
) {
  const [data, setData] = useState<PaginatedResult<Article> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!categorySlug) return;
    try {
      setLoading(true);
      setError(null);
      const result = await articleService.getArticlesByCategory(categorySlug, page, pageSize);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category articles');
    } finally {
      setLoading(false);
    }
  }, [categorySlug, page, pageSize]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Article, ArticleFilters, PaginatedResult } from '@/types/article';
import * as searchService from '@/services/searchService';
import { cache } from '@/lib/cache';
import { CACHE_TTL } from '@/lib/constants';

/** Debounce delay for search queries (milliseconds). */
const DEBOUNCE_MS = 300;

/**
 * Full-featured search hook with debounced querying, caching, and suggestions.
 *
 * @returns Search state and controls.
 */
export function useSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<ArticleFilters>({});
  const [results, setResults] = useState<PaginatedResult<Article> | null>(null);
  const [suggestions, setSuggestions] = useState<
    Pick<Article, 'id' | 'title' | 'slug' | 'excerpt'>[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!query.trim()) {
      setResults(null);
      setSuggestions([]);
      setLoading(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      await performSearch(query.trim());
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filters]);

  // Fetch suggestions as user types (lighter query)
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const cacheKey = `suggestions:${query.trim()}`;
        const cached = cache.get<Pick<Article, 'id' | 'title' | 'slug' | 'excerpt'>[]>(cacheKey);
        if (cached) {
          setSuggestions(cached);
          return;
        }

        const data = await searchService.getSearchSuggestions(query.trim());
        cache.set(cacheKey, data, CACHE_TTL.SEARCH);
        setSuggestions(data);
      } catch {
        // Suggestions are non-critical — silently ignore errors
      }
    };

    const timer = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = useCallback(
    async (searchQuery: string, page: number = 1) => {
      try {
        setLoading(true);
        setError(null);

        const cacheKey = `search:${searchQuery}:${JSON.stringify(filters)}:${page}`;
        const cached = cache.get<PaginatedResult<Article>>(cacheKey);
        if (cached) {
          setResults(cached);
          setLoading(false);
          return;
        }

        const data = await searchService.searchArticles(searchQuery, filters, page);
        cache.set(cacheKey, data, CACHE_TTL.SEARCH);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    suggestions,
    filters,
    setFilters,
  };
}

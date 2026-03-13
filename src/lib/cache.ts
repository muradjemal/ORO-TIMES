/** Default time-to-live for cache entries (5 minutes). */
const DEFAULT_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  data: unknown;
  timestamp: number;
  ttl: number;
}

/**
 * Simple in-memory cache with per-key TTL.
 * Designed for client-side caching of API responses to reduce redundant
 * network requests during a single session.
 */
export class CacheManager {
  private cache = new Map<string, CacheEntry>();

  /**
   * Retrieve a cached value by key.
   * Returns `null` if the key does not exist or has expired.
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Store a value in the cache.
   * @param key   Unique cache key.
   * @param data  The data to cache.
   * @param ttlMs Time-to-live in milliseconds (default: 5 minutes).
   */
  set<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  /** Check whether a non-expired entry exists for the given key. */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /** Remove a specific key from the cache. */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Remove all cache entries whose key contains the given substring.
   * Useful for bulk-invalidating related entries (e.g. all article caches).
   */
  invalidatePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /** Clear the entire cache. */
  clear(): void {
    this.cache.clear();
  }
}

/** Singleton cache instance shared across the application. */
export const cache = new CacheManager();

/**
 * Helper that returns cached data when available, otherwise calls the fetcher
 * and caches the result before returning it.
 *
 * @param key     Unique cache key.
 * @param fetcher Async function that produces the data.
 * @param ttl     Time-to-live in milliseconds (default: 5 minutes).
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL_MS
): Promise<T> {
  const cached = cache.get<T>(key);
  if (cached !== null) return cached;

  const data = await fetcher();
  cache.set(key, data, ttl);
  return data;
}

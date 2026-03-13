import { useState, useEffect, useCallback } from 'react';
import type { UserRole } from '@/types/user';
import * as analyticsService from '@/services/analyticsService';
import type { DashboardStats } from '@/services/analyticsService';

/**
 * Provides convenience wrappers around the analytics service for use in
 * components. Returned functions are stable references safe for dependency
 * arrays.
 */
export function useAnalytics() {
  /** Track a page view, optionally for a specific article. */
  const trackPageView = useCallback((articleId?: string) => {
    analyticsService.trackPageView(articleId);
  }, []);

  /** Track a named event with optional metadata. */
  const trackEvent = useCallback(
    (eventName: string, metadata?: Record<string, unknown>) => {
      analyticsService.trackEvent(eventName, metadata);
    },
    []
  );

  return { trackPageView, trackEvent };
}

/**
 * Fetch aggregated dashboard statistics scoped to the requesting user's role.
 *
 * @param role The current user's role.
 */
export function useDashboardStats(role: UserRole) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getDashboardStats(role);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, loading, error, refetch: fetch };
}

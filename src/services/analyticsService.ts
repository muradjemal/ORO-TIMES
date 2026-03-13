import { supabase } from '@/lib/supabase';
import type { UserRole } from '@/types/user';

/** Dashboard statistics returned to role-based dashboards. */
export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalComments: number;
  totalUsers: number;
}

/**
 * Track a page view. If an article ID is provided the article's view_count is
 * incremented; otherwise the view is logged to the console in development.
 *
 * @param articleId Optional article ID whose view count should be incremented.
 */
export async function trackPageView(articleId?: string): Promise<void> {
  if (articleId) {
    // Increment article view count via RPC (with manual fallback)
    const { error } = await supabase.rpc('increment_view_count', {
      article_id: articleId,
    });

    if (error) {
      // Fallback: manual increment
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

  if (import.meta.env.DEV) {
    console.log('[Analytics] Page view', articleId ? `— article: ${articleId}` : '');
  }
}

/**
 * Track a generic event. Currently logs to the console in development;
 * can be extended to integrate with an external analytics provider.
 *
 * @param eventName Name of the event (e.g. 'share_article', 'search').
 * @param metadata  Optional key-value metadata.
 */
export function trackEvent(
  eventName: string,
  metadata?: Record<string, unknown>
): void {
  if (import.meta.env.DEV) {
    console.log('[Analytics] Event:', eventName, metadata ?? '');
  }
  // TODO: Integrate with external analytics (e.g. PostHog, Plausible) when ready.
}

/**
 * Get the current view count of a specific article.
 *
 * @param articleId The article ID.
 * @returns The view count number.
 */
export async function getArticleViewCount(articleId: string): Promise<number> {
  const { data, error } = await supabase
    .from('articles')
    .select('view_count')
    .eq('id', articleId)
    .single();

  if (error) throw new Error(`Failed to fetch view count: ${error.message}`);
  return data?.view_count ?? 0;
}

/**
 * Aggregate dashboard statistics based on the requesting user's role.
 *
 * - **admin**: all stats (articles, comments, users).
 * - **editor**: article and comment stats (no user count).
 * - **journalist / reader**: article stats only.
 *
 * @param role The role of the requesting user.
 * @returns Dashboard statistics object.
 */
export async function getDashboardStats(
  role: UserRole
): Promise<DashboardStats> {
  const stats: DashboardStats = {
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalComments: 0,
    totalUsers: 0,
  };

  // Total articles
  const { count: totalArticles } = await supabase
    .from('articles')
    .select('id', { count: 'exact', head: true });
  stats.totalArticles = totalArticles ?? 0;

  // Published articles
  const { count: publishedArticles } = await supabase
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');
  stats.publishedArticles = publishedArticles ?? 0;

  // Draft articles
  const { count: draftArticles } = await supabase
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'draft');
  stats.draftArticles = draftArticles ?? 0;

  // Comments (editor and admin only)
  if (role === 'editor' || role === 'admin') {
    const { count: totalComments } = await supabase
      .from('comments')
      .select('id', { count: 'exact', head: true });
    stats.totalComments = totalComments ?? 0;
  }

  // Users (admin only)
  if (role === 'admin') {
    const { count: totalUsers } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true });
    stats.totalUsers = totalUsers ?? 0;
  }

  return stats;
}

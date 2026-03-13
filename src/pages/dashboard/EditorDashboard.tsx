import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, FileCheck, Eye } from 'lucide-react';
import type { Article } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { articleService } from '@/services/articleService';
import { SEOHead } from '@/components/seo/SEOHead';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { StatusIndicator } from '@/features/dashboard/editor/StatusIndicator';
import { formatDate, formatRelativeTime } from '@/utils/formatters';

export default function EditorDashboard() {
  const { user } = useAuth();
  const [reviewQueue, setReviewQueue] = useState<Article[]>([]);
  const [recentPublished, setRecentPublished] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, publishedToday: 0, totalPublished: 0 });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [queue, published] = await Promise.all([
          articleService.getArticlesByStatus('review', { limit: 10 }),
          articleService.getArticlesByStatus('published', { limit: 5 }),
        ]);

        setReviewQueue(queue.data);
        setRecentPublished(published.data);

        const today = new Date().toISOString().split('T')[0];
        const publishedTodayCount = published.data.filter(
          (a) => a.published_at?.startsWith(today)
        ).length;

        setStats({
          pending: queue.count ?? 0,
          publishedToday: publishedTodayCount,
          totalPublished: published.count ?? 0,
        });
      } catch (err) {
        console.error('Failed to load editor data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const STAT_CARDS = [
    { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'bg-amber-100 text-amber-700' },
    { label: 'Published Today', value: stats.publishedToday, icon: CheckCircle, color: 'bg-green-100 text-green-700' },
    { label: 'Total Published', value: stats.totalPublished, icon: FileCheck, color: 'bg-navy-100 text-navy-700' },
  ];

  return (
    <>
      <SEOHead title="Editor Dashboard — Oromo Times" />

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy-900">
            Editor Dashboard
          </h1>
          <p className="text-navy-500 mt-1">
            Welcome back, {user?.full_name ?? 'Editor'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STAT_CARDS.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl shadow-sm border border-navy-100 p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-navy-900">{card.value}</p>
                  <p className="text-xs text-navy-500">{card.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Review Queue */}
        <div>
          <h2 className="text-xl font-serif font-bold text-navy-900 mb-4">Review Queue</h2>
          {reviewQueue.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-8 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-green-400 mb-3" />
              <p className="text-navy-600">All caught up! No articles pending review.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden">
              <div className="divide-y divide-navy-100">
                {reviewQueue.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-navy-50/50 transition-colors"
                  >
                    <StatusIndicator status={article.status} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-navy-900 truncate">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-navy-500">
                          by {article.author?.full_name ?? 'Unknown'}
                        </span>
                        <span className="text-xs text-navy-400">
                          {formatRelativeTime(article.created_at)}
                        </span>
                        {article.category && (
                          <Badge variant="default">{article.category.name}</Badge>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/dashboard/editor/review/${article.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gold hover:text-gold-light bg-gold/10 hover:bg-gold/20 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Publications */}
        <div>
          <h2 className="text-xl font-serif font-bold text-navy-900 mb-4">Recent Publications</h2>
          {recentPublished.length === 0 ? (
            <p className="text-navy-500 text-sm">No recent publications.</p>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden">
              <div className="divide-y divide-navy-100">
                {recentPublished.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-navy-50/50 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/article/${article.slug}`}
                        className="text-sm font-medium text-navy-900 hover:text-gold truncate block transition-colors"
                      >
                        {article.title}
                      </Link>
                    </div>
                    <span className="text-xs text-navy-500 flex-shrink-0">
                      {article.published_at ? formatDate(article.published_at) : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, FilePen, Clock, CheckCircle, PenSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { articleService } from '@/services/articleService';
import { SEOHead } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ArticleList } from '@/features/dashboard/journalist/ArticleList';

interface DashboardStats {
  total: number;
  drafts: number;
  review: number;
  published: number;
}

export default function JournalistDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({ total: 0, drafts: 0, review: 0, published: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        const [drafts, review, published, total] = await Promise.all([
          articleService.getArticlesByAuthor(user.id, { status: 'draft', limit: 1 }),
          articleService.getArticlesByAuthor(user.id, { status: 'review', limit: 1 }),
          articleService.getArticlesByAuthor(user.id, { status: 'published', limit: 1 }),
          articleService.getArticlesByAuthor(user.id, { limit: 1 }),
        ]);
        setStats({
          total: total.count ?? 0,
          drafts: drafts.count ?? 0,
          review: review.count ?? 0,
          published: published.count ?? 0,
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    loadStats();
  }, [user]);

  const STAT_CARDS = [
    { label: 'My Articles', value: stats.total, icon: FileText, color: 'bg-navy-100 text-navy-700' },
    { label: 'Drafts', value: stats.drafts, icon: FilePen, color: 'bg-gray-100 text-gray-700' },
    { label: 'Under Review', value: stats.review, icon: Clock, color: 'bg-amber-100 text-amber-700' },
    { label: 'Published', value: stats.published, icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  ];

  return (
    <>
      <SEOHead title="Journalist Dashboard — Oromo Times" />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-navy-900">
              Journalist Dashboard
            </h1>
            <p className="text-navy-500 mt-1">
              Welcome back, {user?.full_name ?? 'Journalist'}
            </p>
          </div>
          <Button
            variant="gold"
            onClick={() => navigate('/dashboard/journalist/new')}
          >
            <PenSquare className="h-4 w-4 mr-2" />
            New Article
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                  {loadingStats ? (
                    <div className="h-7 w-8 bg-navy-100 animate-pulse rounded" />
                  ) : (
                    <p className="text-2xl font-bold text-navy-900">{card.value}</p>
                  )}
                  <p className="text-xs text-navy-500">{card.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Article List */}
        <ArticleList />
      </div>
    </>
  );
}

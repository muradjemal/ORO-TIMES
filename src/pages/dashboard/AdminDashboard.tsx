import { useState, useEffect } from 'react';
import { Users, FileText, MessageSquare, Activity, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SEOHead } from '@/components/seo/SEOHead';
import { Spinner } from '@/components/ui/Spinner';
import { UserManagement } from '@/features/dashboard/admin/UserManagement';
import { CategoryManagement } from '@/features/dashboard/admin/CategoryManagement';
import { CommentModeration } from '@/features/dashboard/admin/CommentModeration';

type TabId = 'users' | 'categories' | 'comments' | 'analytics';

interface Tab {
  id: TabId;
  label: string;
  icon: typeof Users;
}

const TABS: Tab[] = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'categories', label: 'Categories', icon: LayoutDashboard },
  { id: 'comments', label: 'Comments', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: Activity },
];

interface AdminStats {
  totalUsers: number;
  totalArticles: number;
  totalComments: number;
  activeToday: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('users');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalArticles: 0,
    totalComments: 0,
    activeToday: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        // In production these would be real API calls
        // Placeholder implementation using service calls
        const { supabase } = await import('@/lib/supabase');

        const [usersRes, articlesRes, commentsRes] = await Promise.all([
          supabase.from('users').select('id', { count: 'exact', head: true }),
          supabase.from('articles').select('id', { count: 'exact', head: true }),
          supabase.from('comments').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          totalUsers: usersRes.count ?? 0,
          totalArticles: articlesRes.count ?? 0,
          totalComments: commentsRes.count ?? 0,
          activeToday: 0, // Placeholder — would need session tracking
        });
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  const STAT_CARDS = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-navy-100 text-navy-700' },
    { label: 'Total Articles', value: stats.totalArticles, icon: FileText, color: 'bg-blue-100 text-blue-700' },
    { label: 'Total Comments', value: stats.totalComments, icon: MessageSquare, color: 'bg-green-100 text-green-700' },
    { label: 'Active Today', value: stats.activeToday, icon: Activity, color: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <>
      <SEOHead title="Admin Dashboard — Oromo Times" />

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy-900">
            Admin Dashboard
          </h1>
          <p className="text-navy-500 mt-1">
            Welcome back, {user?.full_name ?? 'Admin'}
          </p>
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

        {/* Tab Navigation */}
        <div className="border-b border-navy-200">
          <nav className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-gold text-gold'
                    : 'border-transparent text-navy-500 hover:text-navy-700 hover:border-navy-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'categories' && <CategoryManagement />}
          {activeTab === 'comments' && <CommentModeration />}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-12 text-center">
              <Activity className="h-16 w-16 mx-auto text-navy-300 mb-4" />
              <h3 className="text-xl font-serif font-semibold text-navy-700 mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-navy-500 max-w-md mx-auto">
                Detailed analytics and reporting features are coming soon. Track article performance,
                user engagement, and platform growth metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

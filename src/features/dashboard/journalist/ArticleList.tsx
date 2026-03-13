import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenSquare, Search, Trash2, Edit, FileText, Filter } from 'lucide-react';
import type { Article, ArticleStatus } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { articleService } from '@/services/articleService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/utils/formatters';
import toast from 'react-hot-toast';

const STATUS_CONFIG: Record<ArticleStatus, { label: string; variant: 'default' | 'warning' | 'success' | 'danger' }> = {
  draft: { label: 'Draft', variant: 'default' },
  review: { label: 'In Review', variant: 'warning' },
  published: { label: 'Published', variant: 'success' },
  archived: { label: 'Archived', variant: 'danger' },
};

const ITEMS_PER_PAGE = 10;

export function ArticleList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchArticles = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, count } = await articleService.getArticlesByAuthor(user.id, {
        page,
        limit: ITEMS_PER_PAGE,
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search.trim() || undefined,
      });
      setArticles(data);
      setTotalCount(count ?? 0);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, [user, page, statusFilter, search]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await articleService.deleteArticle(deleteTarget.id);
      toast.success('Article deleted');
      setDeleteTarget(null);
      fetchArticles();
    } catch (err) {
      console.error('Failed to delete article:', err);
      toast.error('Failed to delete article');
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const filteredArticles = articles;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-serif font-bold text-navy-900">My Articles</h2>
        <Button
          variant="gold"
          onClick={() => navigate('/dashboard/journalist/new')}
        >
          <PenSquare className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as ArticleStatus | 'all');
              setPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-navy-200 rounded-lg bg-white text-navy-700 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="review">In Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 mx-auto text-navy-300 mb-4" />
          <h3 className="text-xl font-serif font-semibold text-navy-700 mb-2">
            No articles yet
          </h3>
          <p className="text-navy-500 mb-6">Start writing! Your articles will appear here.</p>
          <Button
            variant="gold"
            onClick={() => navigate('/dashboard/journalist/new')}
          >
            <PenSquare className="h-4 w-4 mr-2" />
            Write Your First Article
          </Button>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-navy-50 border-b border-navy-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider hidden sm:table-cell">
                      Date
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-navy-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {filteredArticles.map((article) => {
                    const statusCfg = STATUS_CONFIG[article.status];
                    return (
                      <tr key={article.id} className="hover:bg-navy-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-navy-900 line-clamp-1">
                            {article.title}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={statusCfg.variant}>
                            {statusCfg.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-sm text-navy-600">
                            {article.category?.name ?? '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className="text-sm text-navy-500">
                            {formatDate(article.created_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/dashboard/journalist/edit/${article.id}`}
                              className="p-2 text-navy-500 hover:text-navy-700 hover:bg-navy-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(article)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Article"
        >
          <p className="text-navy-600 mb-6">
            Are you sure you want to delete &ldquo;{deleteTarget.title}&rdquo;? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Spinner size="sm" /> : 'Delete'}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

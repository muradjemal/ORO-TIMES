import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Trash2, Eye, Calendar, CheckSquare } from 'lucide-react';
import type { Comment } from '@/types';
import { commentService } from '@/services/commentService';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { formatDate, formatRelativeTime } from '@/utils/formatters';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 20;

export function CommentModeration() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewingComment, setViewingComment] = useState<Comment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const { data, count } = await commentService.getRecentComments({
        page,
        limit: ITEMS_PER_PAGE,
      });
      setComments(data);
      setTotalCount(count ?? 0);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await commentService.deleteComment(deleteTarget.id);
      toast.success('Comment deleted');
      setDeleteTarget(null);
      fetchComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
      toast.error('Failed to delete comment');
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setBulkDeleting(true);
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) => commentService.deleteComment(id))
      );
      toast.success(`${selectedIds.size} comment(s) deleted`);
      setSelectedIds(new Set());
      fetchComments();
    } catch (err) {
      console.error('Failed to bulk delete:', err);
      toast.error('Failed to delete some comments');
    } finally {
      setBulkDeleting(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === comments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(comments.map((c) => c.id)));
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const todayCount = comments.filter((c) => {
    const created = new Date(c.created_at);
    const today = new Date();
    return created.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-4 flex items-center gap-3">
          <div className="p-2 bg-navy-100 rounded-lg">
            <MessageSquare className="h-5 w-5 text-navy-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy-900">{totalCount}</p>
            <p className="text-xs text-navy-500">Total Comments</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-4 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calendar className="h-5 w-5 text-green-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy-900">{todayCount}</p>
            <p className="text-xs text-navy-500">Comments Today</p>
          </div>
        </div>
      </div>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-sm text-amber-800 font-medium">
            {selectedIds.size} selected
          </span>
          <Button
            variant="danger"
            size="sm"
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
          >
            {bulkDeleting ? <Spinner size="sm" /> : <Trash2 className="h-3.5 w-3.5 mr-1" />}
            Delete Selected
          </Button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-sm text-amber-700 hover:text-amber-900 ml-auto"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Comment list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-navy-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-navy-300" />
          <p>No comments found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden">
            {/* Select all header */}
            <div className="flex items-center gap-3 px-6 py-3 bg-navy-50 border-b border-navy-100">
              <input
                type="checkbox"
                checked={selectedIds.size === comments.length && comments.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-navy-300 text-gold focus:ring-gold"
              />
              <span className="text-xs font-semibold text-navy-600 uppercase tracking-wider">
                Select All
              </span>
            </div>

            <div className="divide-y divide-navy-100">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`flex items-start gap-4 px-6 py-4 hover:bg-navy-50/50 transition-colors ${
                    selectedIds.has(comment.id) ? 'bg-gold/5' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(comment.id)}
                    onChange={() => toggleSelect(comment.id)}
                    className="mt-1 w-4 h-4 rounded border-navy-300 text-gold focus:ring-gold"
                  />
                  <Avatar
                    src={comment.user?.avatar_url}
                    name={comment.user?.full_name ?? 'User'}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-navy-900">
                        {comment.user?.full_name ?? 'Unknown User'}
                      </span>
                      <span className="text-xs text-navy-400">
                        {formatRelativeTime(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-navy-700 line-clamp-2">{comment.content}</p>
                    <Link
                      to={`/article/${comment.article_id}`}
                      className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                    >
                      View Article →
                    </Link>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setViewingComment(comment)}
                      className="p-2 text-navy-500 hover:text-navy-700 hover:bg-navy-100 rounded-lg transition-colors"
                      title="View full comment"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(comment)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {/* View Comment Modal */}
      {viewingComment && (
        <Modal
          isOpen={!!viewingComment}
          onClose={() => setViewingComment(null)}
          title="Comment Details"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar
                src={viewingComment.user?.avatar_url}
                name={viewingComment.user?.full_name ?? 'User'}
                size="md"
              />
              <div>
                <p className="text-sm font-medium text-navy-900">
                  {viewingComment.user?.full_name ?? 'Unknown User'}
                </p>
                <p className="text-xs text-navy-500">
                  {formatDate(viewingComment.created_at)}
                </p>
              </div>
            </div>
            <p className="text-sm text-navy-700 whitespace-pre-wrap">
              {viewingComment.content}
            </p>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Comment"
        >
          <p className="text-navy-600 mb-6">
            Are you sure you want to delete this comment? This action cannot be undone.
          </p>
          <div className="p-3 bg-navy-50 rounded-lg mb-6">
            <p className="text-sm text-navy-700 line-clamp-3">{deleteTarget.content}</p>
          </div>
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

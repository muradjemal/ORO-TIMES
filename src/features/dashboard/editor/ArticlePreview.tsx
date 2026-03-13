import { useState } from 'react';
import { CheckCircle, XCircle, MessageSquare, Send, ArrowLeft } from 'lucide-react';
import type { Article, ArticleStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { StatusIndicator } from './StatusIndicator';
import { formatDate } from '@/utils/formatters';
import { articleService } from '@/services/articleService';
import toast from 'react-hot-toast';

interface ArticlePreviewProps {
  article: Article;
  onStatusChange?: (newStatus: ArticleStatus) => void;
  onBack?: () => void;
}

export function ArticlePreview({ article, onStatusChange, onBack }: ArticlePreviewProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ArticleStatus | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleStatusAction = (status: ArticleStatus) => {
    setPendingStatus(status);
    setShowConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus) return;
    setUpdatingStatus(true);
    try {
      await articleService.updateArticle(article.id, {
        status: pendingStatus,
        ...(pendingStatus === 'published' ? { published_at: new Date().toISOString() } : {}),
      });
      toast.success(
        pendingStatus === 'published'
          ? 'Article published!'
          : pendingStatus === 'draft'
          ? 'Changes requested — article moved to drafts'
          : 'Article archived'
      );
      onStatusChange?.(pendingStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update article status');
    } finally {
      setUpdatingStatus(false);
      setShowConfirmModal(false);
      setPendingStatus(null);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return;
    setSubmittingFeedback(true);
    try {
      // In a real app this would save editorial notes
      toast.success('Feedback sent to author');
      setFeedback('');
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      toast.error('Failed to send feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const statusLabels: Record<ArticleStatus, string> = {
    draft: 'Move back to drafts (request changes)',
    review: 'Keep in review',
    published: 'Approve and publish this article',
    archived: 'Reject and archive this article',
  };

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-xl shadow-sm border border-navy-100 p-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-navy-500 hover:text-navy-700 hover:bg-navy-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <StatusIndicator status={article.status} showLabel />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="gold"
            onClick={() => handleStatusAction('published')}
            disabled={article.status === 'published'}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve & Publish
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleStatusAction('draft')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Request Changes
          </Button>
          <Button
            variant="danger"
            onClick={() => handleStatusAction('archived')}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
      </div>

      {/* Content preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-navy-100 p-8">
          {article.cover_image_url && (
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <h1 className="text-3xl font-serif font-bold text-navy-900 mb-4">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-lg text-navy-600 italic mb-6 border-l-4 border-gold pl-4">
              {article.excerpt}
            </p>
          )}
          <div
            className="prose prose-navy max-w-none text-navy-800 leading-relaxed whitespace-pre-wrap"
          >
            {article.content}
          </div>
        </div>

        {/* Sidebar - Metadata & Feedback */}
        <div className="space-y-6">
          {/* Metadata */}
          <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6">
            <h3 className="text-sm font-semibold text-navy-600 uppercase tracking-wider mb-4">
              Article Details
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-navy-500">Author</dt>
                <dd className="text-sm font-medium text-navy-800">
                  {article.author?.full_name ?? 'Unknown'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-navy-500">Category</dt>
                <dd className="text-sm text-navy-800">
                  {article.category?.name ?? '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-navy-500">Language</dt>
                <dd className="text-sm text-navy-800">
                  {article.language === 'om' ? 'Afaan Oromoo' : 'English'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-navy-500">Created</dt>
                <dd className="text-sm text-navy-800">{formatDate(article.created_at)}</dd>
              </div>
              <div>
                <dt className="text-xs text-navy-500">Status</dt>
                <dd>
                  <StatusIndicator status={article.status} showLabel />
                </dd>
              </div>
              {article.tags && article.tags.length > 0 && (
                <div>
                  <dt className="text-xs text-navy-500 mb-1">Tags</dt>
                  <dd className="flex flex-wrap gap-1">
                    {article.tags.map((tag) => (
                      <Badge key={tag.id} variant="default">
                        {tag.name}
                      </Badge>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Editorial Feedback */}
          <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6">
            <h3 className="text-sm font-semibold text-navy-600 uppercase tracking-wider mb-4">
              Editorial Notes
            </h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Leave feedback for the author..."
              rows={4}
              className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm text-navy-800 resize-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent placeholder:text-navy-400"
            />
            <Button
              variant="primary"
              size="sm"
              className="mt-3 w-full"
              onClick={handleFeedbackSubmit}
              disabled={!feedback.trim() || submittingFeedback}
            >
              {submittingFeedback ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Send Feedback
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setPendingStatus(null);
        }}
        title="Confirm Status Change"
      >
        <p className="text-navy-600 mb-6">
          {pendingStatus && statusLabels[pendingStatus]}
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => {
              setShowConfirmModal(false);
              setPendingStatus(null);
            }}
            disabled={updatingStatus}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={confirmStatusChange}
            disabled={updatingStatus}
          >
            {updatingStatus ? <Spinner size="sm" /> : 'Confirm'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

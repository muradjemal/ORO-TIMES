import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useComments } from '@/hooks/useComments';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { Spinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';

interface CommentSectionProps {
  /** ID of the article to show comments for */
  articleId: string;
}

const COMMENTS_PER_PAGE = 10;

/**
 * Full comment section: heading, form (if authenticated), list of comments, and pagination.
 */
export const CommentSection: React.FC<CommentSectionProps> = ({
  articleId,
}) => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const { comments, totalCount, loading, refetch } = useComments(
    articleId,
    page,
    COMMENTS_PER_PAGE,
  );

  const totalPages = Math.ceil(totalCount / COMMENTS_PER_PAGE);

  const handleCommentCreated = () => {
    // Refresh the comment list after a new comment is posted
    refetch();
  };

  return (
    <section className="mt-12 max-w-3xl mx-auto">
      {/* ── Heading ── */}
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-navy-700" />
        <h2 className="font-serif text-xl font-bold text-navy-900">
          Comments{' '}
          {totalCount > 0 && (
            <span className="text-gray-400 font-normal">({totalCount})</span>
          )}
        </h2>
      </div>

      {/* ── Comment form or login prompt ── */}
      {user ? (
        <CommentForm articleId={articleId} onSubmit={handleCommentCreated} />
      ) : (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-600">
            <Link
              to="/login"
              className="font-medium text-navy-900 underline hover:text-navy-700"
            >
              Sign in
            </Link>{' '}
            to join the conversation.
          </p>
        </div>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <div className="flex justify-center py-8">
          <Spinner size="md" />
        </div>
      )}

      {/* ── Comment list ── */}
      {!loading && (
        <div className="space-y-1">
          {comments.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </section>
  );
};

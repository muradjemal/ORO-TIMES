import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Comment } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { formatRelativeDate } from '@/utils/formatters';

interface CommentItemProps {
  /** Comment data */
  comment: Comment;
  /** If provided, shows a delete button (for admin moderation) */
  onDelete?: (commentId: string) => void;
}

/**
 * Single comment display with avatar, author name, relative date, and optional delete.
 */
export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDelete,
}) => {
  const authorName = comment.user?.full_name ?? 'Anonymous';

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-b-0">
      {/* Avatar */}
      <Avatar
        src={comment.user?.avatar_url}
        name={authorName}
        size="sm"
        className="mt-0.5"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-navy-900 truncate">
            {authorName}
          </span>
          <span className="text-xs text-gray-400">
            {formatRelativeDate(comment.created_at)}
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">
          {comment.content}
        </p>

        {/* Admin delete action */}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(comment.id)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
            aria-label="Delete comment"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

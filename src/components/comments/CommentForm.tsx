import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { validateCommentContent } from '@/utils/validators';
import { useComments } from '@/hooks/useComments';

interface CommentFormProps {
  /** ID of the article being commented on */
  articleId: string;
  /** Called after a comment is successfully created */
  onSubmit: () => void;
}

const MAX_CHARS = 2000;

/**
 * Comment composition form with character counter and validation.
 */
export const CommentForm: React.FC<CommentFormProps> = ({
  articleId,
  onSubmit,
}) => {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { createComment } = useComments(articleId);

  const charCount = content.length;
  const isOverLimit = charCount > MAX_CHARS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = content.trim();

    // Client-side validation
    const validationError = validateCommentContent(trimmed);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (isOverLimit) {
      toast.error(`Comment must be under ${MAX_CHARS} characters.`);
      return;
    }

    try {
      setSubmitting(true);
      await createComment({ article_id: articleId, content: trimmed });
      setContent('');
      toast.success('Comment posted!');
      onSubmit();
    } catch {
      toast.error('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts…"
        rows={4}
        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-navy-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 resize-none"
        disabled={submitting}
      />

      <div className="mt-2 flex items-center justify-between">
        <span
          className={`text-xs ${isOverLimit ? 'text-red-500 font-medium' : 'text-gray-400'}`}
        >
          {charCount}/{MAX_CHARS}
        </span>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={submitting}
          disabled={content.trim().length === 0 || isOverLimit}
        >
          <Send className="h-4 w-4" />
          Post Comment
        </Button>
      </div>
    </form>
  );
};

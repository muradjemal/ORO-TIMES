import { useState, useEffect, useCallback } from 'react';
import type { Comment, CommentInput } from '@/types/comment';
import type { PaginatedResult } from '@/types/article';
import * as commentService from '@/services/commentService';

// ---------------------------------------------------------------------------
// useComments
// ---------------------------------------------------------------------------

/** Fetch paginated comments for a specific article. */
export function useComments(
  articleId: string,
  page: number = 1,
  pageSize: number = 10
) {
  const [data, setData] = useState<PaginatedResult<Comment> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!articleId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await commentService.getCommentsByArticle(articleId, page, pageSize);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  }, [articleId, page, pageSize]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useCreateComment
// ---------------------------------------------------------------------------

/** Provides a `submit` function to create a new comment. */
export function useCreateComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (input: CommentInput, userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const comment = await commentService.createComment(input, userId);
      return comment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create comment';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error };
}

// ---------------------------------------------------------------------------
// useDeleteComment
// ---------------------------------------------------------------------------

/** Provides a `remove` function to delete a comment by ID. */
export function useDeleteComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async (commentId: string) => {
    try {
      setLoading(true);
      setError(null);
      await commentService.deleteComment(commentId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete comment';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}

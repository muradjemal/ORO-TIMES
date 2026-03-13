import { supabase } from '@/lib/supabase';
import type { Comment, CommentInput } from '@/types/comment';
import type { PaginatedResult } from '@/types/article';

/**
 * Fetch comments for a specific article, ordered newest first, with pagination.
 *
 * @param articleId The article's ID.
 * @param page      Current page number (1-indexed).
 * @param pageSize  Number of comments per page.
 */
export async function getCommentsByArticle(
  articleId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResult<Comment>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('comments')
    .select('*, user:users(*)', { count: 'exact' })
    .eq('article_id', articleId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(`Failed to fetch comments: ${error.message}`);

  const total = count ?? 0;

  return {
    data: (data as Comment[]) ?? [],
    count: total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Create a new comment on an article.
 *
 * @param input  The comment input containing article_id and content.
 * @param userId The authenticated user's ID.
 * @returns The newly created comment.
 */
export async function createComment(
  input: CommentInput,
  userId: string
): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      article_id: input.article_id,
      user_id: userId,
      content: input.content,
    })
    .select('*, user:users(*)')
    .single();

  if (error) throw new Error(`Failed to create comment: ${error.message}`);
  return data as Comment;
}

/**
 * Delete a comment by its ID.
 *
 * @param commentId The comment's ID.
 */
export async function deleteComment(commentId: string): Promise<void> {
  const { error } = await supabase.from('comments').delete().eq('id', commentId);
  if (error) throw new Error(`Failed to delete comment: ${error.message}`);
}

/**
 * Fetch the most recent comments across all articles (for admin dashboard).
 * Includes the comment author and associated article information.
 *
 * @param limit Maximum number of comments to return.
 */
export async function getRecentComments(limit: number = 20): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*, user:users(*), article:articles(id, title, slug)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch recent comments: ${error.message}`);
  return (data as Comment[]) ?? [];
}

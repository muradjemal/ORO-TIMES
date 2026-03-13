import type { User } from './user';

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface CommentInput {
  article_id: string;
  content: string;
}

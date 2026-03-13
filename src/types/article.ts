import type { User } from './user';
import type { Category, Tag } from './category';

export type ArticleStatus = 'draft' | 'review' | 'published' | 'archived';
export type Language = 'om' | 'en';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url?: string;
  category_id: string;
  author_id: string;
  status: ArticleStatus;
  language: Language;
  view_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author?: User;
  category?: Category;
  tags?: Tag[];
  comment_count?: number;
}

export interface ArticleFilters {
  category_id?: string;
  status?: ArticleStatus;
  language?: Language;
  author_id?: string;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

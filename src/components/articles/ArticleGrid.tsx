import React from 'react';
import type { Article } from '@/types';
import { ArticleCard } from './ArticleCard';

type GridColumns = 2 | 3 | 4;
type GridVariant = 'default' | 'compact';

interface ArticleGridProps {
  /** Array of articles to display */
  articles: Article[];
  /** Number of columns on desktop */
  columns?: GridColumns;
  /** Card variant passed to each ArticleCard */
  variant?: GridVariant;
}

const columnClasses: Record<GridColumns, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
};

/**
 * Responsive grid of ArticleCard components.
 *
 * @example
 * <ArticleGrid articles={articles} columns={3} />
 */
export const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  columns = 3,
  variant = 'default',
}) => {
  if (articles.length === 0) return null;

  return (
    <div
      className={`grid grid-cols-1 ${columnClasses[columns]} gap-6`}
    >
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} variant={variant} />
      ))}
    </div>
  );
};

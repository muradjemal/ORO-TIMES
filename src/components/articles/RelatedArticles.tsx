import React from 'react';
import type { Article } from '@/types';
import { ArticleCard } from './ArticleCard';

interface RelatedArticlesProps {
  /** Related articles to display */
  articles: Article[];
}

/**
 * "Related Articles" section rendered as a responsive grid.
 */
export const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  articles,
}) => {
  if (articles.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="compact"
          />
        ))}
      </div>
    </section>
  );
};

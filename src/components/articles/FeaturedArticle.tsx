import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import type { Article } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatRelativeDate, getReadingTime } from '@/utils/formatters';

interface FeaturedArticleProps {
  /** Featured article data */
  article: Article;
}

/**
 * Large hero card for the primary featured story.
 * Full-width cover image with gradient overlay and content at the bottom.
 */
export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({
  article,
}) => {
  const readingTime = getReadingTime(article.content);

  return (
    <Link
      to={`/article/${article.slug}`}
      className="group relative block w-full rounded-xl overflow-hidden"
    >
      {/* Cover image */}
      <div className="aspect-video w-full">
        {article.cover_image_url ? (
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="eager"
          />
        ) : (
          <div className="h-full w-full bg-navy-200" />
        )}
      </div>

      {/* Reading time badge (top-right) */}
      <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
        <Clock className="h-3 w-3" />
        {readingTime} min read
      </span>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content overlay */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        {article.category && (
          <Badge
            size="sm"
            className="mb-3 bg-gold text-white"
          >
            {article.category.name}
          </Badge>
        )}

        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight line-clamp-3">
          {article.title}
        </h2>

        <p className="mt-2 text-base text-white/80 line-clamp-2 max-w-2xl">
          {article.excerpt}
        </p>

        <div className="mt-4 flex items-center gap-3">
          {article.author && (
            <div className="flex items-center gap-2">
              <Avatar
                src={article.author.avatar_url}
                name={article.author.full_name}
                size="sm"
              />
              <span className="text-sm font-medium text-white">
                {article.author.full_name}
              </span>
            </div>
          )}
          <span className="text-sm text-white/70">
            {formatRelativeDate(article.published_at ?? article.created_at)}
          </span>
        </div>
      </div>
    </Link>
  );
};

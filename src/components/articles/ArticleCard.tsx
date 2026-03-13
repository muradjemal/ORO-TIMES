import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, MessageCircle, Clock } from 'lucide-react';
import type { Article } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatRelativeDate, formatNumber, getReadingTime } from '@/utils/formatters';

type ArticleCardVariant = 'default' | 'compact' | 'horizontal';

interface ArticleCardProps {
  /** Article data */
  article: Article;
  /** Layout variant */
  variant?: ArticleCardVariant;
}

/**
 * Versatile article card rendered in different layouts.
 *
 * - **default**: Vertical card with image on top, content below.
 * - **compact**: No image, title and metadata only.
 * - **horizontal**: Image on the left (1/3), content on the right (2/3).
 */
export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'default',
}) => {
  const readingTime = getReadingTime(article.content);

  /* ── Compact variant ── */
  if (variant === 'compact') {
    return (
      <Link
        to={`/article/${article.slug}`}
        className="block rounded-xl bg-white border border-gray-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        {article.category && (
          <Badge size="sm" className="mb-2">
            {article.category.name}
          </Badge>
        )}
        <h3 className="font-serif font-semibold text-navy-900 line-clamp-2 leading-snug">
          {article.title}
        </h3>
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
          {article.author && <span>{article.author.full_name}</span>}
          <span>{formatRelativeDate(article.published_at ?? article.created_at)}</span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {formatNumber(article.view_count)}
          </span>
        </div>
      </Link>
    );
  }

  /* ── Horizontal variant ── */
  if (variant === 'horizontal') {
    return (
      <Link
        to={`/article/${article.slug}`}
        className="group flex flex-col sm:flex-row rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        {article.cover_image_url && (
          <div className="sm:w-1/3 flex-shrink-0">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="h-48 sm:h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex flex-col justify-center p-4 sm:w-2/3">
          {article.category && (
            <Badge size="sm" className="mb-2 self-start">
              {article.category.name}
            </Badge>
          )}
          <h3 className="font-serif font-semibold text-navy-900 text-lg line-clamp-2 leading-snug group-hover:text-navy-700">
            {article.title}
          </h3>
          <p className="mt-1.5 text-sm text-gray-600 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
            {article.author && (
              <div className="flex items-center gap-1.5">
                <Avatar
                  src={article.author.avatar_url}
                  name={article.author.full_name}
                  size="sm"
                />
                <span>{article.author.full_name}</span>
              </div>
            )}
            <span>{formatRelativeDate(article.published_at ?? article.created_at)}</span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatNumber(article.view_count)}
            </span>
            {article.comment_count !== undefined && (
              <span className="inline-flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {article.comment_count}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  /* ── Default (vertical) variant ── */
  return (
    <Link
      to={`/article/${article.slug}`}
      className="group flex flex-col rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Cover image */}
      {article.cover_image_url && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {article.category && (
            <Badge
              size="sm"
              className="absolute top-3 left-3 bg-navy-900/80 text-white backdrop-blur-sm"
            >
              {article.category.name}
            </Badge>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {!article.cover_image_url && article.category && (
          <Badge size="sm" className="mb-2 self-start">
            {article.category.name}
          </Badge>
        )}

        <h3 className="font-serif font-semibold text-navy-900 text-lg line-clamp-2 leading-snug group-hover:text-navy-700">
          {article.title}
        </h3>

        <p className="mt-1.5 text-sm text-gray-600 line-clamp-2 flex-1">
          {article.excerpt}
        </p>

        {/* Meta row */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            {article.author && (
              <>
                <Avatar
                  src={article.author.avatar_url}
                  name={article.author.full_name}
                  size="sm"
                />
                <span>{article.author.full_name}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime} min
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatNumber(article.view_count)}
            </span>
            {article.comment_count !== undefined && (
              <span className="inline-flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {article.comment_count}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Twitter, Facebook, Linkedin, Share2 } from 'lucide-react';
import type { User, Category, Tag } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, getReadingTime, formatNumber } from '@/utils/formatters';

interface ArticleContentProps {
  /** HTML content string rendered in the article body */
  content: string;
  /** Article title */
  title: string;
  /** Article author */
  author: User;
  /** ISO date string when the article was published */
  publishedAt: string;
  /** Article category */
  category: Category;
  /** Tags associated with the article */
  tags: Tag[];
  /** Optional hero cover image URL */
  coverImageUrl?: string;
  /** View count */
  viewCount?: number;
}

/**
 * Full article page content: header, cover image, prose body, tags, and share buttons.
 */
export const ArticleContent: React.FC<ArticleContentProps> = ({
  content,
  title,
  author,
  publishedAt,
  category,
  tags,
  coverImageUrl,
  viewCount = 0,
}) => {
  const readingTime = getReadingTime(content);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <article className="mx-auto max-w-4xl">
      {/* ── Header ── */}
      <header className="mb-8">
        <Link
          to={`/category/${category.slug}`}
          className="inline-block mb-4"
        >
          <Badge>{category.name}</Badge>
        </Link>

        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 leading-tight">
          {title}
        </h1>

        {/* Meta row */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Avatar
              src={author.avatar_url}
              name={author.full_name}
              size="md"
            />
            <div>
              <p className="font-medium text-navy-900">{author.full_name}</p>
              <p className="text-xs text-gray-400">{formatDate(publishedAt)}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {readingTime} min read
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {formatNumber(viewCount)} views
          </span>
        </div>
      </header>

      {/* ── Cover image ── */}
      {coverImageUrl && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={coverImageUrl}
            alt={title}
            className="w-full object-cover"
            loading="eager"
          />
        </div>
      )}

      {/* ── Body ── */}
      <div
        className="prose prose-lg max-w-3xl mx-auto prose-headings:font-serif prose-headings:text-navy-900 prose-a:text-blue-600 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* ── Tags ── */}
      {tags.length > 0 && (
        <div className="mt-10 max-w-3xl mx-auto">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link key={tag.id} to={`/search?q=${encodeURIComponent(tag.name)}`}>
                <Badge variant="default" size="sm">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Share buttons ── */}
      <div className="mt-8 max-w-3xl mx-auto border-t border-gray-100 pt-6">
        <div className="flex items-center gap-3">
          <Share2 className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-500">Share:</span>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
            aria-label="Share on Twitter"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </article>
  );
};

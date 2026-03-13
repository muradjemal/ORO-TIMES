import React, { useState } from 'react';
import { SearchX } from 'lucide-react';
import type { Article } from '@/types';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';

interface SearchResultsProps {
  /** Matched articles for the current page */
  results: Article[];
  /** Whether a search request is in-flight */
  loading: boolean;
  /** Total number of matching articles (across all pages) */
  totalCount: number;
  /** The user's search query */
  query: string;
  /** Current page (1-indexed) */
  currentPage?: number;
  /** Total pages */
  totalPages?: number;
  /** Page change handler */
  onPageChange?: (page: number) => void;
  /** Category filter change */
  onCategoryChange?: (category: string) => void;
  /** Sort change */
  onSortChange?: (sort: string) => void;
}

/**
 * Search results display with header, filter bar, article list, and pagination.
 */
export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  totalCount,
  query,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onCategoryChange,
  onSortChange,
}) => {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onCategoryChange?.(value);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    onSortChange?.(value);
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-navy-900">
          {loading
            ? `Searching for "${query}"…`
            : `${totalCount} result${totalCount !== 1 ? 's' : ''} for "${query}"`}
        </h1>
      </div>

      {/* ── Filter bar ── */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          <option value="politics">Politics</option>
          <option value="business">Business</option>
          <option value="culture">Culture</option>
          <option value="sports">Sports</option>
          <option value="technology">Technology</option>
          <option value="opinion">Opinion</option>
        </select>

        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
          aria-label="Sort results"
        >
          <option value="newest">Newest</option>
          <option value="relevance">Relevance</option>
        </select>
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-gray-400">Searching articles…</p>
        </div>
      )}

      {/* ── Results ── */}
      {!loading && results.length > 0 && (
        <div className="space-y-4">
          {results.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="horizontal"
            />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && results.length === 0 && query && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <SearchX className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold text-navy-900">
            No articles found
          </h2>
          <p className="mt-1 text-sm text-gray-500 max-w-md">
            We couldn't find any articles matching "{query}". Try different
            keywords or browse our categories.
          </p>
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && onPageChange && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

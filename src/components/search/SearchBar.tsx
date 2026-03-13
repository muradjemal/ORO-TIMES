import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';

type SearchBarVariant = 'navbar' | 'page';

interface SearchBarProps {
  /** Visual context — controls size and behaviour */
  variant?: SearchBarVariant;
  /** Optional callback fired when search is triggered */
  onSearch?: (query: string) => void;
}

/**
 * Search input with debounced suggestions dropdown (navbar variant) or
 * full-width standalone input (page variant).
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  variant = 'navbar',
  onSearch,
}) => {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { suggestions, loading: suggestionsLoading } = useSearch(debouncedQuery);

  // Debounce input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Focus input when expanding in navbar mode
  useEffect(() => {
    if (expanded && inputRef.current) inputRef.current.focus();
  }, [expanded]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateToSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      onSearch?.(trimmed);
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setExpanded(false);
      setQuery('');
    },
    [navigate, onSearch],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      navigateToSearch(query);
    }
    if (e.key === 'Escape') {
      setExpanded(false);
      setQuery('');
    }
  };

  const showSuggestions =
    variant === 'navbar' &&
    expanded &&
    debouncedQuery.length > 0 &&
    (suggestions.length > 0 || suggestionsLoading);

  /* ── Page variant ── */
  if (variant === 'page') {
    return (
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search articles…"
          className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-navy-900 placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 transition-colors"
        />
      </div>
    );
  }

  /* ── Navbar variant ── */
  return (
    <div ref={wrapperRef} className="relative">
      {expanded ? (
        <div className="flex items-center gap-1">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search…"
              className="w-48 sm:w-64 rounded-lg border border-gray-300 bg-white py-1.5 pl-8 pr-3 text-sm text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setExpanded(false);
              setQuery('');
            }}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition-colors"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            // On small screens navigate to search page; on larger screens expand inline
            if (window.innerWidth < 640) {
              navigate('/search');
            } else {
              setExpanded(true);
            }
          }}
          className="rounded-lg p-2 text-navy-700 hover:bg-navy-50 transition-colors"
          aria-label="Open search"
        >
          <Search className="h-5 w-5" />
        </button>
      )}

      {/* Suggestion dropdown */}
      {showSuggestions && (
        <div className="absolute right-0 top-full mt-1 w-72 rounded-lg border border-gray-200 bg-white shadow-lg z-50 overflow-hidden">
          {suggestionsLoading ? (
            <div className="px-4 py-3 text-sm text-gray-400">Searching…</div>
          ) : (
            <ul>
              {suggestions.slice(0, 5).map((article) => (
                <li key={article.id}>
                  <Link
                    to={`/article/${article.slug}`}
                    onClick={() => {
                      setExpanded(false);
                      setQuery('');
                    }}
                    className="block px-4 py-2.5 text-sm text-navy-900 hover:bg-navy-50 transition-colors line-clamp-1"
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

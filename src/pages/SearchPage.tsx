import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import type { Category } from '@/types';
import { useSearch } from '@/hooks/useSearch';
import { categoryService } from '@/services/categoryService';
import { SEOHead } from '@/components/seo/SEOHead';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { Spinner } from '@/components/ui/Spinner';

type SortOption = 'relevance' | 'date' | 'views';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showFilters, setShowFilters] = useState(false);

  const { results, loading, totalCount } = useSearch(query, {
    categories: Array.from(selectedCategories),
    sort: sortBy,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  const handleSearch = useCallback((newQuery: string) => {
    setSearchParams({ q: newQuery });
  }, [setSearchParams]);

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  return (
    <>
      <SEOHead
        title={query ? `Search: ${query} — Oromo Times` : 'Search — Oromo Times'}
        description="Search articles on Oromo Times"
        noIndex
      />

      <div className="max-w-6xl mx-auto">
        {/* Search header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-navy-900 mb-6">Search</h1>
          <SearchBar
            variant="page"
            initialQuery={query}
            onSearch={handleSearch}
          />
          {query && !loading && (
            <p className="mt-3 text-sm text-navy-500">
              {totalCount} result{totalCount !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 sticky top-6">
              <h3 className="text-sm font-semibold text-navy-600 uppercase tracking-wider mb-4">
                Filters
              </h3>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-navy-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 py-2 border border-navy-200 rounded-lg bg-white text-navy-700 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date (newest)</option>
                  <option value="views">Most viewed</option>
                </select>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">Categories</label>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="w-4 h-4 rounded border-navy-300 text-gold focus:ring-gold"
                      />
                      <span className="text-sm text-navy-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm text-navy-600 hover:text-navy-800 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            {showFilters && (
              <div className="mt-4 bg-white rounded-xl shadow-sm border border-navy-100 p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 border border-navy-200 rounded-lg bg-white text-navy-700 text-sm"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="date">Date (newest)</option>
                    <option value="views">Most viewed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedCategories.has(cat.id)
                            ? 'bg-gold text-white'
                            : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <SearchResults results={results} query={query} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

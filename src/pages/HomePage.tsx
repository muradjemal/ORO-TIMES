import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import type { Article, Category } from '@/types';
import { articleService } from '@/services/articleService';
import { categoryService } from '@/services/categoryService';
import { SEOHead } from '@/components/seo/SEOHead';
import { FeaturedArticle } from '@/components/articles/FeaturedArticle';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

const PAGE_SIZE = 9;

export default function HomePage() {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [featured, trending, latest, cats] = await Promise.all([
          articleService.getFeaturedArticle(),
          articleService.getTrendingArticles(3),
          articleService.getLatestArticles({ page: 1, limit: PAGE_SIZE }),
          categoryService.getCategories(),
        ]);

        setFeaturedArticle(featured);
        setTrendingArticles(trending);
        setLatestArticles(latest.data);
        setHasMore(latest.data.length === PAGE_SIZE);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await articleService.getLatestArticles({ page: nextPage, limit: PAGE_SIZE });
      setLatestArticles((prev) => [...prev, ...result.data]);
      setPage(nextPage);
      setHasMore(result.data.length === PAGE_SIZE);
    } catch (err) {
      console.error('Failed to load more articles:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Oromo Times — Bilingual News for the Oromo Community"
        description="Stay informed with the latest news, analysis, and stories from the Oromo community. Available in Afaan Oromoo and English."
        type="website"
      />

      <div className="space-y-12">
        {/* Featured Article */}
        {featuredArticle && (
          <section>
            <FeaturedArticle article={featuredArticle} />
          </section>
        )}

        {/* Trending Now */}
        {trendingArticles.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-gold" />
              <h2 className="text-2xl font-serif font-bold text-navy-900">Trending Now</h2>
            </div>
            <ArticleGrid articles={trendingArticles} columns={3} />
          </section>
        )}

        {/* Category Shortcuts */}
        {categories.length > 0 && (
          <section>
            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="flex-shrink-0 px-5 py-2.5 bg-navy-50 hover:bg-navy-100 text-navy-700 hover:text-navy-900 rounded-full text-sm font-medium transition-colors border border-navy-200 hover:border-navy-300"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* QALACA AI Preview */}
        <section>
          <div className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 rounded-2xl p-8 md:p-10">
            {/* Sparkle decorations */}
            <Sparkles className="absolute top-4 right-4 h-6 w-6 text-gold/30" />
            <Sparkles className="absolute bottom-6 left-6 h-4 w-4 text-gold/20" />
            <Sparkles className="absolute top-1/2 right-1/4 h-5 w-5 text-gold/25" />

            <div className="relative max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-gold" />
                <span className="text-gold text-sm font-semibold uppercase tracking-wider">
                  AI-Powered
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                Meet QALACA AI
              </h2>
              <p className="text-navy-200 mb-6 leading-relaxed">
                Your intelligent assistant for Oromo language news. Get AI-powered summaries,
                translations, and personalized news recommendations tailored to your interests.
              </p>
              <Link to="#">
                <Button variant="gold">
                  Learn More
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-navy-900">Latest News</h2>
          </div>

          {latestArticles.length > 0 ? (
            <>
              <ArticleGrid articles={latestArticles} columns={3} />

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="secondary"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-navy-500">
              <p>No articles published yet. Check back soon!</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FolderOpen, ArrowLeft } from 'lucide-react';
import type { Article, Category } from '@/types';
import { articleService } from '@/services/articleService';
import { categoryService } from '@/services/categoryService';
import { SEOHead } from '@/components/seo/SEOHead';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';

const ITEMS_PER_PAGE = 12;

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [otherCategories, setOtherCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!slug) return;
    setPage(1);

    const loadCategory = async () => {
      setLoading(true);
      try {
        const [cat, cats] = await Promise.all([
          categoryService.getCategoryBySlug(slug),
          categoryService.getCategories(),
        ]);

        setCategory(cat);
        setOtherCategories(cats.filter((c) => c.slug !== slug));

        if (cat) {
          const result = await articleService.getArticlesByCategory(cat.id, {
            page: 1,
            limit: ITEMS_PER_PAGE,
          });
          setArticles(result.data);
          setTotalCount(result.count ?? 0);
        }
      } catch (err) {
        console.error('Failed to load category:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [slug]);

  useEffect(() => {
    if (!category || page === 1) return;

    const loadPage = async () => {
      try {
        const result = await articleService.getArticlesByCategory(category.id, {
          page,
          limit: ITEMS_PER_PAGE,
        });
        setArticles(result.data);
        setTotalCount(result.count ?? 0);
      } catch (err) {
        console.error('Failed to load page:', err);
      }
    };

    loadPage();
  }, [page, category]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-16">
        <FolderOpen className="h-16 w-16 mx-auto text-navy-300 mb-4" />
        <h1 className="text-2xl font-serif font-bold text-navy-700 mb-2">
          Category Not Found
        </h1>
        <p className="text-navy-500 mb-6">
          The category you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${category.name} — Oromo Times`}
        description={category.description ?? `Browse ${category.name} articles on Oromo Times.`}
      />

      <div className="max-w-6xl mx-auto">
        {/* Category Header */}
        <div className="mb-8 pb-6 border-b border-navy-100">
          <nav className="flex items-center gap-2 text-sm text-navy-500 mb-4">
            <Link to="/" className="hover:text-navy-700 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-navy-700">{category.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-navy-600 text-lg">{category.description}</p>
          )}
          <p className="text-sm text-navy-500 mt-2">
            {totalCount} article{totalCount !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            {articles.length > 0 ? (
              <>
                <ArticleGrid articles={articles} columns={3} />
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <FolderOpen className="h-12 w-12 mx-auto text-navy-300 mb-3" />
                <p className="text-navy-500">No articles in this category yet.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 sticky top-6">
              <h3 className="text-sm font-semibold text-navy-600 uppercase tracking-wider mb-4">
                Other Categories
              </h3>
              <ul className="space-y-2">
                {otherCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.slug}`}
                      className="text-sm text-navy-700 hover:text-gold transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

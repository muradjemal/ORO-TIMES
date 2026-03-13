import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useArticle } from '@/hooks/useArticles';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SEOHead } from '@/components/seo/SEOHead';
import { ArticleContent } from '@/components/articles/ArticleContent';
import { RelatedArticles } from '@/components/articles/RelatedArticles';
import { CommentSection } from '@/components/comments/CommentSection';
import { QalacaPanel } from '@/components/qalaca/QalacaPanel';
import { Spinner } from '@/components/ui/Spinner';
import { generateArticleMeta } from '@/utils/seo';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { article, loading, error } = useArticle(slug ?? '');
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    if (article) {
      trackPageView({
        page: `/article/${slug}`,
        title: article.title,
        articleId: article.id,
      });
    }
  }, [article, slug, trackPageView]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-navy-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-serif font-bold text-navy-300 mb-4">404</h1>
          <h2 className="text-xl font-serif font-semibold text-navy-700 mb-2">
            Article Not Found
          </h2>
          <p className="text-navy-500 mb-6">
            The article you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const seoMeta = generateArticleMeta(article);

  return (
    <>
      <SEOHead
        title={seoMeta.title}
        description={seoMeta.description}
        type="article"
        image={seoMeta.image}
        structuredData={seoMeta.structuredData}
      />

      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-navy-500 mb-6">
          <Link to="/" className="hover:text-navy-700 transition-colors">Home</Link>
          <span>/</span>
          {article.category && (
            <>
              <Link
                to={`/category/${article.category.slug}`}
                className="hover:text-navy-700 transition-colors"
              >
                {article.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-navy-700 truncate">{article.title}</span>
        </nav>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ArticleContent article={article} />
            <CommentSection articleId={article.id} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <QalacaPanel article={article} />
            <RelatedArticles
              articleId={article.id}
              categoryId={article.category_id}
            />
          </aside>
        </div>
      </div>
    </>
  );
}

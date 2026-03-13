import type { Article } from '@/types/article';
import type { Category } from '@/types/category';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';

/** Shape returned by the meta-generation helpers. */
export interface PageMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  ogType: string;
  canonical?: string;
  structuredData?: Record<string, unknown>;
}

/**
 * Generate meta tags for an article page including Open Graph and JSON-LD
 * structured data for Google News.
 *
 * @param article The article to generate meta for.
 * @returns A `PageMeta` object.
 */
export function generateArticleMeta(article: Article): PageMeta {
  const title = `${article.title} | ${APP_NAME}`;
  const description = article.excerpt || article.title;
  const canonical = `/article/${article.slug}`;

  return {
    title,
    description,
    ogTitle: article.title,
    ogDescription: description,
    ogImage: article.cover_image_url,
    ogType: 'article',
    canonical,
    structuredData: generateStructuredData(article),
  };
}

/**
 * Generate meta tags for a category listing page.
 *
 * @param category The category.
 * @returns A `PageMeta` object.
 */
export function generateCategoryMeta(category: Category): PageMeta {
  const title = `${category.name} News | ${APP_NAME}`;
  const description =
    category.description || `Latest ${category.name} news and articles on ${APP_NAME}.`;

  return {
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    canonical: `/category/${category.slug}`,
  };
}

/**
 * Generate generic page meta tags.
 *
 * @param title       The page title.
 * @param description Optional description (falls back to app description).
 * @returns A `PageMeta` object.
 */
export function generatePageMeta(title: string, description?: string): PageMeta {
  return {
    title: `${title} | ${APP_NAME}`,
    description: description || APP_DESCRIPTION,
    ogTitle: `${title} | ${APP_NAME}`,
    ogDescription: description || APP_DESCRIPTION,
    ogType: 'website',
  };
}

/**
 * Generate a JSON-LD structured data object following the `NewsArticle` schema.
 * Suitable for Google News and rich-result indexing.
 *
 * @param article The article to describe.
 * @returns A JSON-LD compatible object.
 */
export function generateStructuredData(
  article: Article
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.cover_image_url ? [article.cover_image_url] : undefined,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at,
    author: article.author
      ? {
          '@type': 'Person',
          name: article.author.full_name,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: APP_NAME,
      logo: {
        '@type': 'ImageObject',
        url: '/favicon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/article/${article.slug}`,
    },
  };
}

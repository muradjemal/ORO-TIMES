import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  /** Page title (appended with " | Oromo Times") */
  title?: string;
  /** Meta description */
  description?: string;
  /** Open Graph image URL */
  ogImage?: string;
  /** Open Graph content type */
  ogType?: string;
  /** Canonical URL */
  canonicalUrl?: string;
  /** JSON-LD structured data object */
  structuredData?: Record<string, unknown>;
  /** If true, adds noindex robots directive */
  noIndex?: boolean;
}

const DEFAULT_TITLE = 'Oromo Times — Bilingual News Platform';
const DEFAULT_DESCRIPTION =
  'Your trusted bilingual source for news and analysis from the Oromo community and beyond. Delivering stories in Afaan Oromoo and English.';

/**
 * Manages <head> meta tags for SEO and social sharing via react-helmet-async.
 *
 * @example
 * <SEOHead
 *   title="Breaking: New Trade Agreement"
 *   description="Details on the latest bilateral trade deal…"
 *   ogImage="/images/article-cover.jpg"
 * />
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  ogImage,
  ogType = 'website',
  canonicalUrl,
  structuredData,
  noIndex = false,
}) => {
  const fullTitle = title ? `${title} | Oromo Times` : DEFAULT_TITLE;

  return (
    <Helmet>
      {/* Primary meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

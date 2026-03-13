/** Application display name. */
export const APP_NAME = 'Oromo Times';

/** Default meta description for the site. */
export const APP_DESCRIPTION =
  'Your trusted source for bilingual Oromo and English news coverage.';

/** Default number of articles per page. */
export const DEFAULT_PAGE_SIZE = 12;

/** Default number of comments per page. */
export const COMMENT_PAGE_SIZE = 10;

/** Cache time-to-live values in milliseconds. */
export const CACHE_TTL = {
  ARTICLES: 5 * 60 * 1000,      // 5 minutes
  CATEGORIES: 30 * 60 * 1000,   // 30 minutes
  SEARCH: 2 * 60 * 1000,        // 2 minutes
  COMMENTS: 1 * 60 * 1000,      // 1 minute
} as const;

/** Top-level category names displayed in the navigation bar. */
export const CATEGORIES_NAV = [
  'Politics',
  'Business',
  'Culture',
  'Sports',
  'Technology',
  'Opinion',
] as const;

/** Supported languages with their human-readable labels. */
export const LANGUAGES = {
  om: 'Afaan Oromoo',
  en: 'English',
} as const;

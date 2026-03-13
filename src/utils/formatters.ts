import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format a date string into a human-readable format (e.g. "Mar 13, 2026").
 *
 * @param dateString An ISO-8601 date string.
 * @returns Formatted date.
 */
export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'MMM d, yyyy');
}

/**
 * Format a date string as a relative time (e.g. "2 hours ago").
 *
 * @param dateString An ISO-8601 date string.
 * @returns Relative time string.
 */
export function formatRelativeDate(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

/**
 * Truncate text to a maximum length and append an ellipsis if needed.
 *
 * @param text      The text to truncate.
 * @param maxLength Maximum number of characters.
 * @returns Truncated text.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Convert a string to a URL-safe slug.
 *
 * @param text The text to slugify.
 * @returns A lowercase, hyphenated slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format a number into a compact human-readable string (e.g. 1200 → "1.2K").
 *
 * @param num The number to format.
 * @returns Compact string representation.
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return num.toString();
}

/**
 * Remove all HTML tags from a string.
 *
 * @param html The HTML string to strip.
 * @returns Plain text without HTML.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Estimate the reading time of a piece of content in minutes.
 * Assumes an average reading speed of 200 words per minute.
 *
 * @param content The text content (may contain HTML).
 * @returns Estimated reading time in minutes (minimum 1).
 */
export function getReadingTime(content: string): number {
  const plainText = stripHtml(content);
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
}

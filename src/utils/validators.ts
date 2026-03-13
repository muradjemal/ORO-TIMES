/** Result of a validation check. */
export interface ValidationResult {
  valid: boolean;
  message: string;
}

/**
 * Validate an email address format using a standard regex.
 *
 * @param email The email string to validate.
 * @returns `true` if the email is in a valid format.
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate a password meets minimum strength requirements.
 * Currently requires a minimum of 8 characters.
 *
 * @param password The password string to validate.
 * @returns A `ValidationResult` with validity and a user-facing message.
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, message: 'Password is required.' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  return { valid: true, message: '' };
}

/**
 * Validate comment content.
 * Must not be empty and cannot exceed 2 000 characters.
 *
 * @param content The comment text to validate.
 * @returns A `ValidationResult`.
 */
export function validateCommentContent(content: string): ValidationResult {
  const trimmed = content.trim();
  if (!trimmed) {
    return { valid: false, message: 'Comment cannot be empty.' };
  }
  if (trimmed.length > 2000) {
    return { valid: false, message: 'Comment cannot exceed 2 000 characters.' };
  }
  return { valid: true, message: '' };
}

/**
 * Validate an article title.
 * Must not be empty and cannot exceed 200 characters.
 *
 * @param title The article title to validate.
 * @returns A `ValidationResult`.
 */
export function validateArticleTitle(title: string): ValidationResult {
  const trimmed = title.trim();
  if (!trimmed) {
    return { valid: false, message: 'Title is required.' };
  }
  if (trimmed.length > 200) {
    return { valid: false, message: 'Title cannot exceed 200 characters.' };
  }
  return { valid: true, message: '' };
}

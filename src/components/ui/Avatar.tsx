import React from 'react';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  /** Image URL */
  src?: string;
  /** Full name used for alt text and initials fallback */
  name: string;
  /** Diameter of the avatar */
  size?: AvatarSize;
  /** Additional CSS classes */
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
};

/**
 * Derives initials from a full name (first letter of first and last names).
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Circular avatar with image or initials fallback.
 *
 * @example
 * <Avatar name="Abdisa Tolera" size="md" />
 * <Avatar src="/avatars/user1.jpg" name="Abdisa Tolera" />
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
}) => {
  const baseClasses = `inline-flex items-center justify-center rounded-full flex-shrink-0 ${sizeClasses[size]} ${className}`;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${baseClasses} object-cover`}
        loading="lazy"
      />
    );
  }

  return (
    <span
      className={`${baseClasses} bg-navy-100 text-navy-700 font-semibold`}
      aria-label={name}
    >
      {getInitials(name)}
    </span>
  );
};

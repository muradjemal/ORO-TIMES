import React from 'react';

interface CardProps {
  /** Card contents */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Enables hover elevation and slight lift */
  hoverable?: boolean;
  /** Click handler — automatically makes the card hoverable */
  onClick?: () => void;
}

/**
 * Generic card container with optional hover interaction.
 *
 * @example
 * <Card hoverable onClick={() => navigate('/article/1')}>
 *   <p>Article preview…</p>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
}) => {
  const isInteractive = hoverable || !!onClick;

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={[
        'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden',
        isInteractive
          ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional label displayed above the input */
  label?: string;
  /** Error message displayed below the input */
  error?: string;
  /** Optional Lucide icon rendered inside the input (left side) */
  icon?: LucideIcon;
}

/**
 * Styled text input with optional label, icon, and error state.
 *
 * @example
 * <Input label="Email" icon={Mail} error={errors.email} placeholder="you@example.com" />
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  ...rest
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-navy-700 mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
        )}

        <input
          id={inputId}
          className={[
            'block w-full rounded-lg border bg-white px-3 py-2 text-navy-900 placeholder-gray-400 transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500',
            Icon ? 'pl-10' : '',
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300',
          ].join(' ')}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

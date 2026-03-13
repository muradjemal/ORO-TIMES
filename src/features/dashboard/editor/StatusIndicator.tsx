import { useState } from 'react';
import type { ArticleStatus } from '@/types';

interface StatusIndicatorProps {
  status: ArticleStatus;
  showLabel?: boolean;
}

const STATUS_MAP: Record<ArticleStatus, { color: string; bgColor: string; label: string; description: string }> = {
  draft: {
    color: '#9CA3AF',
    bgColor: 'bg-gray-100',
    label: 'Draft',
    description: 'Article is in draft — not yet submitted for review.',
  },
  review: {
    color: '#F59E0B',
    bgColor: 'bg-amber-100',
    label: 'In Review',
    description: 'Article is pending editorial review.',
  },
  published: {
    color: '#10B981',
    bgColor: 'bg-green-100',
    label: 'Published',
    description: 'Article is live and publicly visible.',
  },
  archived: {
    color: '#EF4444',
    bgColor: 'bg-red-100',
    label: 'Archived',
    description: 'Article has been archived and is no longer visible.',
  },
};

export function StatusIndicator({ status, showLabel = false }: StatusIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = STATUS_MAP[status];

  return (
    <div
      className="relative inline-flex items-center gap-2"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="relative flex items-center">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: config.color }}
        />
        {status === 'review' && (
          <span
            className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-75"
            style={{ backgroundColor: config.color }}
          />
        )}
      </span>

      {showLabel && (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor}`}
          style={{ color: config.color }}
        >
          {config.label}
        </span>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
          <div className="bg-navy-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            {config.description}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="w-2 h-2 bg-navy-900 rotate-45" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

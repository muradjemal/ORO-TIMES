import React from 'react';
import { BookOpen, Lightbulb, ShieldCheck, Brain, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface QalacaPanelProps {
  /** Title of the current article (optional contextual hint) */
  articleTitle?: string;
}

interface ActionButton {
  label: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const ACTIONS: ActionButton[] = [
  {
    label: 'Summarize Article',
    description: 'Get a concise AI summary',
    icon: BookOpen,
  },
  {
    label: 'Explain Concepts',
    description: 'Understand key topics',
    icon: Lightbulb,
  },
  {
    label: 'Fact Check Claims',
    description: 'Verify article claims',
    icon: ShieldCheck,
  },
];

/**
 * QALACA AI companion panel — a sidebar widget with AI-powered actions.
 * Currently all actions are disabled with a "Coming Soon" state.
 *
 * Features a subtle animated shimmer gradient background.
 */
export const QalacaPanel: React.FC<QalacaPanelProps> = ({ articleTitle }) => {
  return (
    <div className="relative rounded-xl border-2 border-transparent bg-clip-padding overflow-hidden">
      {/* Gradient border effect */}
      <div
        className="absolute inset-0 -z-10 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, #d69e2e, #1a2744, #d69e2e)',
          backgroundSize: '200% 200%',
          animation: 'qalacaShimmer 4s ease-in-out infinite',
          padding: '2px',
        }}
      />

      <div className="relative rounded-xl bg-white p-5">
        {/* ── Header ── */}
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-gold" />
          <h3 className="font-serif text-lg font-bold text-navy-900">
            QALACA AI
          </h3>
          <Badge variant="warning" size="sm">
            Beta
          </Badge>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          Your AI-powered news companion
        </p>

        {articleTitle && (
          <p className="text-xs text-gray-400 mb-4 line-clamp-1">
            Context: <span className="italic">{articleTitle}</span>
          </p>
        )}

        {/* ── Action buttons ── */}
        <div className="space-y-3">
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                disabled
                title="Coming Soon"
                className="flex w-full items-center gap-3 rounded-lg border border-navy-200 bg-navy-50 p-4 text-left opacity-60 cursor-not-allowed transition-colors"
              >
                <Icon className="h-5 w-5 text-navy-700 flex-shrink-0" />
                <div>
                  <span className="block text-sm font-medium text-navy-700">
                    {action.label}
                  </span>
                  <span className="block text-xs text-gray-400">
                    {action.description} — Coming Soon
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <Brain className="h-3.5 w-3.5" />
          <span>Powered by QALACA</span>
        </div>
      </div>

      {/* Shimmer animation keyframes (injected inline for portability) */}
      <style>{`
        @keyframes qalacaShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

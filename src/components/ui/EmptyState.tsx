import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center py-20 px-4">
      <div className="text-center max-w-sm">
        {/* Icon circle */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-28 h-28 bg-orange-50 rounded-full flex items-center justify-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <Icon className="w-10 h-10 text-orange-400" />
            </div>
          </div>
          {/* Decorative ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-200 animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">{description}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {actionLabel && onAction && (
            <button className="btn btn-primary px-8 py-3" onClick={onAction}>
              {actionLabel}
            </button>
          )}
          {secondaryLabel && onSecondary && (
            <button className="btn btn-outline px-8 py-3" onClick={onSecondary}>
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

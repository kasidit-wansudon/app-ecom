import type { ReactNode } from 'react';

interface PageBannerProps {
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function PageBanner({
  title,
  titleHighlight,
  subtitle,
  children,
  size = 'md',
}: PageBannerProps) {
  const padding = size === 'sm' ? 'py-10' : size === 'lg' ? 'py-24' : 'py-16';

  return (
    <div className={`relative bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden ${padding}`}>
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-yellow-200/20 rounded-full blur-2xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#FF6B35 1px, transparent 1px), linear-gradient(to right, #FF6B35 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
          {title}
          {titleHighlight && (
            <span className="text-gradient-orange"> {titleHighlight}</span>
          )}
        </h1>

        {subtitle && (
          <p className="text-gray-600 text-lg max-w-xl mx-auto mb-6">{subtitle}</p>
        )}

        {/* Orange accent line */}
        <div className="flex justify-center mb-6">
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-orange-600" />
        </div>

        {children}
      </div>
    </div>
  );
}

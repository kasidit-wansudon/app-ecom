interface SectionTitleProps {
  label?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionTitle({
  label,
  title,
  highlight,
  subtitle,
  align = 'left',
}: SectionTitleProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col ${alignClass} mb-8`}>
      {label && (
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">
          <span className="w-6 h-0.5 bg-orange-500 rounded-full" />
          {label}
          <span className="w-6 h-0.5 bg-orange-500 rounded-full" />
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {title}
        {highlight && <span className="text-gradient-orange"> {highlight}</span>}
      </h2>
      {subtitle && (
        <p className="text-gray-500 mt-2 max-w-lg">{subtitle}</p>
      )}
      <div className="mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-orange-400 to-orange-600" />
    </div>
  );
}

import { ChevronDown } from 'lucide-react';
import type { SelectHTMLAttributes } from 'react';

interface StyledSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export default function StyledSelect({ className = '', error, ...props }: StyledSelectProps) {
  return (
    <div className="relative group">
      <select
        {...props}
        className={`
          w-full appearance-none cursor-pointer
          bg-white border rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-800
          transition-all duration-200
          hover:border-orange-400 hover:shadow-sm
          focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20
          ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'}
          ${className}
        `}
      />
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors duration-200"
      />
    </div>
  );
}

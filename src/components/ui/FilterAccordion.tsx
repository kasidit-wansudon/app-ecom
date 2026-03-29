import { useRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterAccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function FilterAccordion({ title, defaultOpen = false, children }: FilterAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(defaultOpen ? 'auto' : '0px');

  useEffect(() => {
    if (!contentRef.current) return;
    if (open) {
      // measure real height then animate to it
      const h = contentRef.current.scrollHeight;
      setHeight(`${h}px`);
      // after transition ends, switch to 'auto' so dynamic content works
      const id = setTimeout(() => setHeight('auto'), 300);
      return () => clearTimeout(id);
    } else {
      // freeze current height first so transition has a start point
      const h = contentRef.current.scrollHeight;
      setHeight(`${h}px`);
      requestAnimationFrame(() => requestAnimationFrame(() => setHeight('0px')));
    }
  }, [open]);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full py-3.5 text-left group"
      >
        <span className="font-medium text-gray-800 group-hover:text-orange-500 transition-colors text-sm">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-all duration-300 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      <div
        ref={contentRef}
        style={{ height, overflow: 'hidden', transition: 'height 0.3s cubic-bezier(0.4,0,0.2,1)' }}
      >
        <div className="pb-4 space-y-2.5">
          {children}
        </div>
      </div>
    </div>
  );
}

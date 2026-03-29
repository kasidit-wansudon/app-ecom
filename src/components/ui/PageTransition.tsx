import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    window.scrollTo(0, 0);

    gsap.fromTo(
      container,
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
    );
  }, [location.pathname]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}

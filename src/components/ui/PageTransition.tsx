import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    // Scroll to top on route change
    window.scrollTo(0, 0);

    const tl = gsap.timeline();

    // Overlay sweeps in from left, then sweeps out to right
    tl.set(overlay, { scaleX: 0, transformOrigin: 'left center' })
      .to(overlay, { scaleX: 1, duration: 0.35, ease: 'power3.inOut' })
      .set(container, { opacity: 0, y: 16 })
      .to(overlay, { scaleX: 0, transformOrigin: 'right center', duration: 0.35, ease: 'power3.inOut' })
      .to(container, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.25');

    return () => { tl.kill(); };
  }, [location.pathname]);

  return (
    <div className="relative">
      {/* Transition overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[999] pointer-events-none bg-gradient-to-r from-orange-500 to-orange-400"
        style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }}
      />

      {/* Page content */}
      <div ref={containerRef}>
        {children}
      </div>
    </div>
  );
}

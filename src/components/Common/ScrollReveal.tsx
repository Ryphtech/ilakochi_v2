import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  scrub?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 1.0,
  distance = 70,
  className = '',
  scrub = false,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let xVal = 0;
    let yVal = 0;

    if (direction === 'left') xVal = -distance;
    else if (direction === 'right') xVal = distance;
    else if (direction === 'up') yVal = distance;
    else if (direction === 'down') yVal = -distance;

    const ctx = gsap.context(() => {
      if (scrub) {
        // Continuous scrub linked to scroll position
        gsap.fromTo(
          el,
          { x: xVal, y: yVal, opacity: 0.2 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              end: 'top 45%',
              scrub: 1.0,
            },
          }
        );
      } else {
        // Smooth trigger reveal
        gsap.fromTo(
          el,
          { x: xVal, y: yVal, opacity: 0 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: duration,
            delay: delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [direction, delay, duration, distance, scrub]);

  return (
    <div ref={elementRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
};


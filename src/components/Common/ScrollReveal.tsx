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
  duration = 0.5,
  distance = 30,
  className = '',
  scrub = false,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    // Limit distance & duration so animations are always fast, modern, and never sluggish
    const effectiveDistance = Math.min(distance, 35);
    const effectiveDuration = Math.min(duration, 0.6);

    let xVal = 0;
    let yVal = 0;

    if (direction === 'left') xVal = -effectiveDistance;
    else if (direction === 'right') xVal = effectiveDistance;
    else if (direction === 'up') yVal = effectiveDistance;
    else if (direction === 'down') yVal = -effectiveDistance;

    const ctx = gsap.context(() => {
      if (scrub) {
        gsap.fromTo(
          el,
          { x: xVal, y: yVal, opacity: 0.3 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 95%',
              end: 'top 65%',
              scrub: 0.5,
            },
          }
        );
      } else {
        // Fast, smooth, ONE-TIME entrance animation (never fades out or reverses on scroll!)
        gsap.fromTo(
          el,
          { x: xVal, y: yVal, opacity: 0 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: effectiveDuration,
            delay: Math.min(delay, 0.2),
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              once: true, // Only trigger ONCE - stays fully visible permanently!
              toggleActions: 'play none none none',
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

import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'gold';
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'light',
  showSubtitle = true,
  size = 'md',
}) => {
  const textColor = variant === 'dark' ? 'text-[#123D2A]' : variant === 'gold' ? 'text-[#C5A46D]' : 'text-[#F8F6EE]';
  const accentColor = variant === 'dark' ? 'text-[#176B45]' : 'text-[#C5A46D]';
  const subColor = variant === 'dark' ? 'text-[#315E43]' : 'text-[#A8BFA0]';

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-16',
    hero: 'h-24 md:h-32',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official Ila Kochi Brand Logo */}
      <div className="relative flex items-center justify-center">
        <img
          src="/assets/ila-kochi-logo-white.png"
          alt="ILA KOCHI Brand Emblem"
          className={`${sizeClasses[size]} w-auto object-contain transition-transform duration-500 hover:scale-105 drop-shadow-[0_2px_10px_rgba(197,164,109,0.25)] ${
            variant === 'dark' ? 'brightness-0 contrast-200' : variant === 'gold' ? 'sepia hue-rotate-15 contrast-125' : ''
          }`}
          onError={(e) => {
            // Graceful fallback to SVG calligraphy if asset path fails
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Typography Wordmark */}
      <div className="flex flex-col text-left">
        <div className="flex items-center">
          <span className={`font-serif-display font-medium tracking-[0.2em] ${size === 'sm' ? 'text-base' : 'text-lg md:text-xl'} uppercase ${textColor}`}>
            ILA KOCHI
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-[9px] md:text-[10px] tracking-[0.28em] font-sans-ui uppercase font-medium ${subColor}`}>
              Coastal Kitchen
            </span>
            <span className="w-1 h-1 rounded-full bg-[#C5A46D]/60 inline-block"></span>
            <span className={`text-[9px] md:text-[10px] tracking-[0.2em] font-sans-ui uppercase font-medium ${subColor}`}>
              Kerala
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

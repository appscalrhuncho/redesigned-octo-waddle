import React from 'react';

export interface AppLogoProps {
  size?: number | string;
  className?: string;
  variant?: 'gold' | 'azure' | 'emerald' | 'monochrome' | 'dark';
  showText?: boolean;
  textClassName?: string;
  subtitle?: string;
  badge?: string;
  animate?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 40,
  className = '',
  showText = false,
  textClassName = '',
  subtitle = 'Multi-property hotel operations',
  badge,
  animate = false
}) => (
  <div className={`inline-flex items-center gap-3 ${className}`}>
    <img
      src="/neon-gorilla-emblem.png"
      width={typeof size === 'number' ? size : undefined}
      height={typeof size === 'number' ? size : undefined}
      alt="Neon gorilla emblem"
      className={`shrink-0 object-contain drop-shadow-[0_0_12px_rgba(0,221,242,0.22)] transition-transform duration-300 ${animate ? 'hover:scale-105 hover:rotate-1' : ''}`}
      style={{ width: size, height: size }}
    />

    {showText && (
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className={`font-bold tracking-tight text-[#EAF2F6] leading-tight ${textClassName || 'text-base sm:text-lg'}`}>
            Hotel Portfolio OS
          </span>
          {badge && (
            <span className="rounded-full border border-[#B8FF00]/40 bg-[#B8FF00]/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#C8FF45]">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <span className="text-[10px] uppercase tracking-wider text-[#9AAAB3]">
            {subtitle}
          </span>
        )}
      </div>
    )}
  </div>
);

export default AppLogo;

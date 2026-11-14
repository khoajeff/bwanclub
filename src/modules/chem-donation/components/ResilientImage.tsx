import React, { useState } from 'react';
import { FlaskConical } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspectClassName?: string;
  accessionBadge?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  caption,
  className = '',
  aspectClassName = 'aspect-[16/10]',
  accessionBadge,
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <figure className={`group relative flex flex-col overflow-hidden bg-slate-100 ${className}`}>
      <div className={`relative w-full flex-1 overflow-hidden ${aspectClassName}`}>
        {!hasError && src ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50/60 to-slate-200 p-6 text-center text-[#181826]">
            <FlaskConical className="mb-3 h-10 w-10 text-[#5D50FE] opacity-90" />
            <p className="text-sm font-bold text-[#181826]">{alt}</p>
            {accessionBadge && (
              <p className="mt-1 font-mono-tabular text-xs text-[#525866]">{accessionBadge}</p>
            )}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        {accessionBadge && (
          <div className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-2.5 py-1 font-mono-tabular text-[11px] font-bold tracking-wider text-[#5D50FE] shadow-xs backdrop-blur-xs">
            {accessionBadge}
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="border-t border-slate-100 bg-slate-50/80 px-4 py-2.5 text-xs leading-relaxed text-[#525866]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

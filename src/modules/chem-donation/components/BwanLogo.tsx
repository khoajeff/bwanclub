import React, { useEffect, useState } from 'react';

interface BwanLogoProps {
  src: string;
  alt?: string;
  className?: string;
}

// Cache the processed transparent data URL across all logo instances so it only runs once
let cachedTransparentDataUrl: string | null = null;

/**
 * Automatically removes the black background (including the internal fracture lines and outer frame)
 * from the club's JPG logo and crops tightly to the hexagon bounds so it renders as a crisp,
 * larger transparent emblem on any light or colored surface.
 */
export const BwanLogo: React.FC<BwanLogoProps> = ({
  src,
  alt = 'Logo BWAN Chemistry',
  className = 'h-12 w-12',
}) => {
  const [processedSrc, setProcessedSrc] = useState<string | null>(
    cachedTransparentDataUrl
  );

  useEffect(() => {
    if (cachedTransparentDataUrl) {
      setProcessedSrc(cachedTransparentDataUrl);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (!w || !h) return;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        let minX = w;
        let minY = h;
        let maxX = 0;
        let maxY = 0;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const maxChannel = Math.max(r, g, b);

            if (maxChannel < 28) {
              data[i + 3] = 0;
            } else if (maxChannel < 90) {
              // Smooth anti-aliased edge transition
              const alpha = Math.round(((maxChannel - 28) / 62) * 255);
              data[i + 3] = alpha;
              if (alpha > 20) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            } else {
              data[i + 3] = 255;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);

        // Crop tightly to the hexagon bounding box with a tiny 2% margin
        if (maxX > minX && maxY > minY) {
          const cropW = maxX - minX + 1;
          const cropH = maxY - minY + 1;
          const pad = Math.round(Math.max(cropW, cropH) * 0.02);
          const sx = Math.max(0, minX - pad);
          const sy = Math.max(0, minY - pad);
          const sw = Math.min(w - sx, cropW + pad * 2);
          const sh = Math.min(h - sy, cropH + pad * 2);

          const croppedCanvas = document.createElement('canvas');
          croppedCanvas.width = sw;
          croppedCanvas.height = sh;
          const croppedCtx = croppedCanvas.getContext('2d');
          if (croppedCtx) {
            croppedCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
            const dataUrl = croppedCanvas.toDataURL('image/png');
            cachedTransparentDataUrl = dataUrl;
            setProcessedSrc(dataUrl);
            return;
          }
        }

        const fallbackUrl = canvas.toDataURL('image/png');
        cachedTransparentDataUrl = fallbackUrl;
        setProcessedSrc(fallbackUrl);
      } catch {
        setProcessedSrc(src);
      }
    };
    img.onerror = () => {
      setProcessedSrc(src);
    };
    img.src = src;
  }, [src]);

  return (
    <img
      src={processedSrc || src}
      alt={alt}
      referrerPolicy="no-referrer"
      className={`select-none object-contain ${className}`}
    />
  );
};

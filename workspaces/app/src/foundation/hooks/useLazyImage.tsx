import React, { useState, useEffect, useRef } from 'react';

import { getImageUrl } from '../../lib/image/getImageUrl';
import { useIntersectionObserver } from './useIntersectionObserver';

// ブラウザがWebPをサポートしているか確認
const supportsWebP = (() => {
  try {
    return document.createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0;
  } catch (e) {
    return false;
  }
})();

type Props = {
  height: number;
  imageId: string;
  width: number;
  eager?: boolean;
};

export const useLazyImage = ({ height, imageId, width, eager = false }: Props) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [containerRef, isInView] = useIntersectionObserver({
    rootMargin: '200px', // 少し余裕を持たせて先読み
    threshold: 0.1,
  }, eager);
  const hasProcessedImage = useRef(false);

  useEffect(() => {
    // eager=trueの場合や、要素がビューポートに入った場合に実行
    if ((eager || isInView) && !hasProcessedImage.current) {
      hasProcessedImage.current = true;
      
      const processImage = async () => {
        const dpr = window.devicePixelRatio;

        // WebPをサポートしていればWebP、そうでなければJPGを使用
        const format = supportsWebP ? 'webp' : 'jpg';

        const img = new Image();
        img.src = getImageUrl({
          format,
          height: height * dpr,
          imageId,
          width: width * dpr,
        });

        await img.decode();

        const canvas = document.createElement('canvas');
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        const ctx = canvas.getContext('2d')!;

        // Draw image to canvas as object-fit: cover
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const targetAspect = width / height;

        if (imgAspect > targetAspect) {
          const srcW = img.naturalHeight * targetAspect;
          const srcH = img.naturalHeight;
          const srcX = (img.naturalWidth - srcW) / 2;
          const srcY = 0;
          ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, width * dpr, height * dpr);
        } else {
          const srcW = img.naturalWidth;
          const srcH = img.naturalWidth / targetAspect;
          const srcX = 0;
          const srcY = (img.naturalHeight - srcH) / 2;
          ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, width * dpr, height * dpr);
        }

        // WebPをサポートしていればWebP、そうでなければPNGを使用
        setImageUrl(canvas.toDataURL(supportsWebP ? 'image/webp' : 'image/png', 0.8));
      };

      processImage();
    }
  }, [eager, isInView, height, imageId, width]);

  // コンテナ要素とURL
  return {
    containerRef,
    imageUrl
  };
};
import { useAsync } from 'react-use';

import { getImageUrl } from '../../lib/image/getImageUrl';

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

export const useImage = ({ height, imageId, width }: { height: number; imageId: string; width: number }) => {
  const { value } = useAsync(async () => {
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
    return canvas.toDataURL(supportsWebP ? 'image/webp' : 'image/png', 0.8);
  }, [height, imageId, width]);

  return value;
};

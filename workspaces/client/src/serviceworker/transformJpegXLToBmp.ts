// @ts-expect-error - This is a workaround for the missing type definition
import jsquashWasmBinary from '@jsquash/jxl/codec/dec/jxl_dec.wasm';
import { init as jsquashInit } from '@jsquash/jxl/decode';
import 'jimp';

declare const Jimp: typeof import('jimp');
declare const caches: CacheStorage;

// キャッシュ名を定義
const CACHE_NAME = 'jxl-image-cache';

export async function transformJpegXLToBmp(response: Response): Promise<Response> {
  const url = new URL(response.url);
  const cacheKey = url.toString();
  
  // キャッシュをチェック
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(cacheKey);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // キャッシュがない場合は変換を実行
  const { decode } = await jsquashInit(undefined, {
    locateFile: () => {},
    wasmBinary: jsquashWasmBinary,
  });

  const arrayBuffer = await response.arrayBuffer();
  const imageData = decode(arrayBuffer)!;
  const bmpBinary = await new Jimp(imageData).getBufferAsync(Jimp.MIME_BMP);

  // 変換結果をキャッシュ
  const transformedResponse = new Response(bmpBinary, {
    headers: {
      'Cache-Control': 'max-age=86400', // 1日間キャッシュ
      'Content-Type': 'image/bmp',
    },
  });
  
  // キャッシュに保存
  await cache.put(cacheKey, transformedResponse.clone());
  
  return transformedResponse;
}

/// <reference types="@types/serviceworker" />

import { transformJpegXLToBmp } from './transformJpegXLToBmp';

// キャッシュ名
const CACHE_NAME = 'jxl-image-cache';
const STATIC_CACHE_NAME = 'static-cache-v1';

// プリキャッシュするアセット
const STATIC_ASSETS = [
  '/',
  '/assets/heroImage.png',
];

self.addEventListener('install', (ev: ExtendableEvent) => {
  console.log('Service Worker installing');
  ev.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then(cache => {
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting()
    ])
  );
});

self.addEventListener('activate', (ev: ExtendableEvent) => {
  console.log('Service Worker activating');
  // 古いキャッシュを削除
  ev.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME;
            })
            .map(cacheName => {
              console.log('Deleting outdated cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (ev: FetchEvent) => {
  ev.respondWith(onFetch(ev.request));
});

async function onFetch(request: Request): Promise<Response> {
  // スタティックアセットのキャッシュを確認
  if (request.method === 'GET') {
    const staticCache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await staticCache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
  }

  try {
    const res = await fetch(request);

    // スタティックアセットをキャッシュ
    if (request.method === 'GET' && (request.url.endsWith('.css') || request.url.endsWith('.js') || request.url.includes('/assets/'))) {
      const staticCache = await caches.open(STATIC_CACHE_NAME);
      staticCache.put(request, res.clone());
    }

    if (res.headers.get('Content-Type') === 'image/jxl') {
      // JPEG XL画像をBMPに変換
      return transformJpegXLToBmp(res);
    } else {
      return res;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    
    // オフライン時にキャッシュから提供
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // キャッシュにもない場合はエラーレスポンス
    return new Response('Network error occurred', { status: 503, statusText: 'Service Unavailable' });
  }
}

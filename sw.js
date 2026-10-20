const CACHE_NAME = 'ddh-rehber-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn.tailwindcss.com/3.4.1',
    'https://unpkg.com/lucide@latest',
    'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'
];

// 1. Kurulum Aşaması: Statik dosyaları önbelleğe al
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// 2. Aktivasyon Aşaması: Eski önbellekleri temizle
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. İstekleri Yakalama (Fetch): rehber.txt her zaman ağdan (taze) çekilir, diğerleri önbellekten sunulur
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // rehber.txt veya güncel veri istekleri için her zaman önce sunucuya (ağa) git
    if (url.pathname.includes('rehber.txt')) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }

    // Diğer statik dosyalar için önce önbellek, bulunamazsa ağ
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});

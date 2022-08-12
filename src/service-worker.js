import { build, files, version } from '$service-worker';
const DIR = `cache${version}`;
const tobeCached = build.concat(files);
const assets = new Set(tobeCached);

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(DIR)
        .then((cache) => cache.addAll(tobeCached))
        .then(() => self.skipWaiting())
    );
})

self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then(async (keys) => {
        for (const key of keys) {
            if (key !== DIR) await caches.delete(key)
        }
        self.clients.claim();
    }))
})

async function fetchAndCache (req) {
    const cache = await caches.open(`offline${version}`);

    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        const res = await cache.match(req);
		if (res) return res;
		throw error;   
    }
}

self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET' || e.request.headers.has('range')) return;

	const url = new URL(e.request.url);

	const isHttp = url.protocol.startsWith('http');
	const isDevServerRequest =
		url.hostname === self.location.hostname && url.port !== self.location.port;
	const isStaticAsset = url.host === self.location.host && assets.has(url.pathname);
	const skipBecauseUncached = e.request.cache === 'only-if-cached' && !isStaticAsset;

	if (isHttp && !isDevServerRequest && !skipBecauseUncached) {
		e.respondWith(
			(async () => {
				// always serve static files and bundler-generated assets from cache.
				// if your application has other URLs with data that will never change,
				// set this variable to true for them and they will only be fetched once.
				const cachedAsset = isStaticAsset && (await caches.match(e.request));

				return cachedAsset || fetchAndCache(e.request);
			})()
		);
	}
})
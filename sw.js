// Cho app chạy khi không có mạng. Ưu tiên lấy bản mới từ mạng, mất mạng thì dùng bản đã lưu.
const CACHE = "beangi-v3";
const FILES = ["./", "index.html", "style.css?v=3", "app.js?v=3", "menu.js?v=3", "foods.json", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/cartoon.png"];

self.addEventListener("install", (e) => {
  // cache: "reload" = tải thẳng từ máy chủ, không lấy bản cũ trong bộ nhớ đệm của trình duyệt.
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: "reload" }))))
    .then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  // cache: "no-cache" = luôn hỏi lại máy chủ (rẻ, chỉ trả 304 nếu không đổi) để bản sửa mới tới ngay.
  e.respondWith(fetch(e.request, { cache: "no-cache" }).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match(e.request).then((r) => r || caches.match("index.html"))));
});

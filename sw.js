"use strict";
const CACHE_NAME="verbum-dei-install-v2";
const OFFLINE_URL=new URL("./offline.html",self.registration.scope).href;
const PREFETCH=["./offline.html","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(PREFETCH)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("verbum-dei-install-")&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  // Never cache live Maronite/OLM readings, explanations, API responses or personal information.
  // Pages are network-first; offline navigation shows an explicit offline explanation.
  if(event.request.mode!=="navigate"||event.request.method!=="GET")return;
  const target=new URL(event.request.url);
  if(target.origin!==self.location.origin||!target.href.startsWith(self.registration.scope))return;
  event.respondWith(fetch(event.request).catch(async()=>{
    const cache=await caches.open(CACHE_NAME);
    return (await cache.match(OFFLINE_URL))||Response.error();
  }));
});
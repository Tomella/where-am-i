const _CACHE = {};

export default async function(url, cacheable) {
   if(cacheable && _CACHE[url]) {
      resolve(_CACHE[url]);
      return;
   }
   let response = await fetch(url);
   let data = await response.json();

   if(cacheable) {
      _CACHE[url] = response;
   }
   return data;
}

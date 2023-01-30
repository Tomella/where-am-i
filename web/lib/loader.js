const _CACHE = {};

export default async function(url, cacheable) {
   if(cacheable && _CACHE[url]) {
      return _CACHE[url];
   }
   let response = await fetch(url);
   let data = await response.json();

   if(cacheable) {
      _CACHE[url] = data;
   }
   return data;
}

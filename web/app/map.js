export default class Map {
   constructor(config) {
      this.config = config;
   }
   create() {
      let config = this.config;
      this.map = L.map(config.id, config.options);
      config.layers.forEach(layer => {
         this.addLayer(layer);
      });
   }

   addLayer(config) {
      let layer =  L[config.type](config.url, config.options);
      layer.addTo(this.map);
      return layer;
   }
}
import loader from "./loader.js";

export default class Jobs {
   constructor(config) {
      this.config = config;
   }

   async list() {
      return loader(this.config.listUrl);
   }
}

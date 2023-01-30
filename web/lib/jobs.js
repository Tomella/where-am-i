import loader from "./loader.js";

export default class Jobs {
   constructor(config) {
      this.config = config;
   }

   async list() {
      this._list = await loader(this.config.listUrl, true);
      return this._list;
   }

   async list() {
      this._list = await loader(this.config.listUrl, true);
      return this._list;
   }

   async find(dateStr) {
      let dateArr = dateStr.split("-");
      
      let list = await this.list();
      let result = await loader(this.config.jobsForDate.replace("$year", dateArr[0]).replace("$month", dateArr[1]).replace("$date", dateArr[2]), true);
      if(result && result.length) {
         result.forEach(el => {
            el.job = list.find(item => item.id == el.job_id);
         });
      }
      return result;
   }
}

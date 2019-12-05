export default class Controls {
   constructor(config) {
      this.config = config;
      this.container = document.getElementById(config.id);
      let state = this.state = new State();

      state.addEventListener("jobs", (event) => {
         this._drawJobs(event);
      });
   }

   _drawJobs(event) {
      if(!this.jobs) {
         this.jobs = new Jobs(this.container, this.config.jobs || {});
      }
      this.jobs.draw(event.detail);
      console.log("Draw event:", event);
   }
}

class Jobs {
   constructor(target, config) {
      this.target = target;
      this.config = config;
   }

   draw(jobs) {
      this.target.innerHTML = "";
      let heading = document.createElement("h3");
      heading.innerText = this.config.title || "Jobs";
      this.target.appendChild(heading);
      let ul = document.createElement("ul");
      jobs.forEach(job => {
         let li = document.createElement("li");
         let checkbox = document.createElement("input");
         checkbox.type = "checkbox";
         li.appendChild(checkbox);
         ul.appendChild(li);
      });
      this.target.appendChild(ul);
   }
}


class State {
   constructor() {
      this.listeners = {};
   }

   set jobs(jobs) {
      this._jobs = jobs;
      this._fireEvent("jobs", jobs);
   }

   _fireEvent(name, details) {
      let listeners = this.listeners[name];
      if(listeners) {
         let event = new CustomEvent(name, {detail:details});
         listeners.forEach(listener => listener(event));

      }
   }

   addEventListener(name, func) {
      if(this.listeners[name]) {
         this.listeners[name].push(func);
      } else {
         this.listeners[name] = [func];
      }
   }
}
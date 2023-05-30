
export default class DeltaTime {
    constructor() {
        this.start = this.last = Date.now();
        this.delta = 0;
    }

    tick() {
        let now = Date.now();
        this.delta = now - this.last;
        this.last = now;
        return this.delta;
    }

    get age() {
        console.log("Age ", this.last, this.start)
        return this.last - this.start; 
    }
}
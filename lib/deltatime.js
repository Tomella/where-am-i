
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
        return this.last - this.start; 
    }
}

export default class Properties {
    constructor(initial) {
       Object.assign(this, initial);
    }

    get remainingDistance() {
        let pointer = this.next ? this.next.properties: null;
        let d = 0;
        while(pointer) {
            d += pointer.distanceLast;
            pointer = pointer.next ? pointer.next.properties : null;
        }
        return d;
    }

    get travelledDistance() {
        let pointer = this.previous ? this.previous.properties: null;
        let d = this.distanceLast; 
        while(pointer) {
            d += pointer.distanceLast;
            pointer = pointer.previous ? pointer.previous.properties: null;
        }
        return d;
    }

}
import decorateSpeed from "../lib/speed.js";
import Properties from "../lib/properties.js";

export default class Decorator {
    static SUMMARY_EVENT = "DECORATOR_CUSTOM_EVENT";

    constructor(config) {
        this.config = config;
    }

    decorate(features) {
        this.linkedList(features);
        this.speed(features);
        let sortedFeatures = features.toSorted((f1, f2) => f1.properties.speed - f2.properties.speed);
        let steps = this.config.speedSteps * 0.999;
        let counts = sortedFeatures.length / steps;
        sortedFeatures.forEach((feature, index) => {
            feature.properties = new Properties(feature.properties);
            feature.properties.speedGroup = Math.floor(index / counts);
        });
     
        let summary = {
            first: features[0],
            last: features[features.length - 1],
            max: sortedFeatures[sortedFeatures.length - 1]
        };
        console.log("Summary: ", summary);
        let event = new CustomEvent(this.SUMMARY_EVENT, {detail:summary});
        //console.log("Length of path", features.length ? features[0].properties.remainingDistance: 0)
    }

    linkedList(features) {
        let length = features.length;

        features.forEach((element, index, array) => {
            let properties = element.properties;
            properties.previous = index ? array[index - 1] : null;
            properties.next = index < length - 2 ? array[index + 1] : null;
        });
    }

    speed(features) {
        decorateSpeed(features);
    }   
}

class Summary {
    constructor() {

    }

    get startTime () {
        return this.first ? this.first.properties.dateStamp : null;
    }

    get endTime () {
        return this.last ? this.last.properties.dateStamp : null;
    }
}
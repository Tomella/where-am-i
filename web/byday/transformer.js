export default class Transformer {
    static pointsToLinestring(data) {
        let attributeType = data.features[0].properties.name.substr(0, 16);
        return [{
            type: "FeatureCollection",
            features: [{
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: data.features.filter(el => el.geometry.coordinates[2] > -89).reduce((acc, feature) => {
                        acc.push(feature.geometry.coordinates);
                        return acc;
                    }, [])
                },
                properties: {
                    attributeType
                }
            }],
            properties: {
                Creator: "GeoSpeedster.com",
                records: 2,
                summary: attributeType.substr(6)
            }
        }];
    }
    
}
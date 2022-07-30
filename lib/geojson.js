
let GeoJSON = {
   journalJson(records, name = "points") {
      return {
         type: "FeatureCollection",
         name,
         crs: {
            type: "name",
            properties: {
               name: "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
         },
         features: records.map(record => ({
            type: "Feature",
            properties: {
               id: record.id,
               job_id: 1,
               time_point: record.time_point,
               elevation: record.elevation,
               satellites: record.satellites,
               accuracy: record.accuracy
            },
            geometry: {
               type: "Point",
               coordinates: [
                  record.latitude,
                  record.longitude
               ]
            }
         }))
      };
   },

   pathsJson(paths, name = "paths") {
      return {
         type: "FeatureCollection",
         name,
         features: paths.map(path => ({
            type: "Feature",
            properties: {
               name: "Path " + path.points[0].time_point.toLocaleString("en-AU"),
               job_id: path.points[0].job_id,
               start_time: path.points[0].time_point,
               end_time: path.points[path.points.length - 1].time_point
            },
            geometry: {
               type: "LineString",
               coordinates: path.points.map(record => [
                  record.longitude,
                  record.latitude
               ])
            }
         }))
      };
   },

   pointsToJson(points, name = "points") {
      return {
         type: "FeatureCollection",
         name,
         features: points.map(point => ({
            type: "Feature",
            properties: {
               name: "Point " + point.time_point.toLocaleString("en-AU"),
               job_id: point.job_id,
               time_point: point.time_point
            },
            geometry: {
               type: "Point",
               coordinates: [
                  point.longitude,
                  point.latitude
               ]
            }
         }))
      };
   }
};

export default GeoJSON;

export default function decorateSpeed(features) {
   console.log("Phht!");

   if(features && features.length) {
      // Get a date stamp on all.
      features.forEach((current, index, array) => {
         current.properties.dateStamp = new Date(current.properties.time_point);
      });

      features.forEach((current, index, array) => {
         let next, previous = null;
          
         if(index) {
            previous = array[index - 1];
         }
         if(index < array.length - 1) {
            next = array[index + 1];
         }

         if(next && previous) {
            // Average over the two distances
            let dn = map.distance(current.geometry.coordinates, next.geometry.coordinates) +  map.distance(current.geometry.coordinates, previous.geometry.coordinates);
            let dt = next.properties.dateStamp.getTime() - previous.properties.dateStamp.getTime();

            extendName(current, dn, dt);
         } else {
            if(next) {
               // Speed between element and next
               let dn = map.distance(current.geometry.coordinates, next.geometry.coordinates);
               let dt = next.properties.dateStamp.getTime() - current.properties.dateStamp.getTime();

               extendName(current, dn, dt);
            }
            if(previous) {
               // Speed between element and previous
               // Speed between element and next
               let dn = map.distance(current.geometry.coordinates, previous.geometry.coordinates);
               let dt = current.properties.dateStamp.getTime() - previous.properties.dateStamp.getTime();

               extendName(current, dn, dt);
            }
         }

      });      
   }
}

function extendName(feature, dn, dt) {
   let kmh = dn * 3600 / dt;
   feature.properties.speed = kmh; // Convert m/ms to km/hr;
   feature.properties.name += ", speed " + kmh.toFixed(1) + "km/h";
}
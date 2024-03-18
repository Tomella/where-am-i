export default function decorateSpeed(features) {

   if (features && features.length) {
      // Get a date stamp on all.
      features.forEach((current, index, array) => {
         current.properties.dateStamp = new Date(current.properties.time_point);
      });

      features.forEach((current, index, array) => {
         let next, previous = null;
         let properties = current.properties;
         let dn = 0;
         let dt = 0;

         if (index) {
            previous = array[index - 1];
            dn = properties.distanceLast = distVincenty(current.geometry.coordinates, previous.geometry.coordinates).distance;
            dt = properties.millisLast = current.properties.dateStamp.getTime() - previous.properties.dateStamp.getTime();
         } else {
            properties.distanceLast = 0;
            properties.millisLast = 0;
         }
         decorateProperties(current, dn, dt);
      });
   }
}

function decorateProperties(feature, dn, dt) {
   let properties = feature.properties;
   let kmh = dn * 3600 / dt;
   properties.speed = kmh; // Convert m/ms to km/hr;
   properties.name += ", speed " + kmh.toFixed(1) + "km/h";
}


function toRad(Value) {
   /** Converts numeric degrees to radians */
   return Value * Math.PI / 180;
}

function toDeg(Value) {
   /** Converts radians to numeric degrees */
   return Value * 180 / Math.PI;
}

function distVincenty(latLon1, latLon2) {
   const a = 6378137;
   const b = 6356752.314245;
   const f = 1 / 298.257223563;  // WGS-84 ellipsoid params

   let lon1 = latLon1[0];
   let lon2 = latLon2[0];
   let lat1 = latLon1[1];
   let lat2 = latLon2[1];


   let L = toRad((lon2 - lon1));
   let U1 = Math.atan((1 - f) * Math.tan(toRad(lat1)));
   let U2 = Math.atan((1 - f) * Math.tan(toRad(lat2)));
   let sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
   let sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);

   let lambda = L, lambdaP, iterLimit = 100;
   let cosSqAlpha, sinLambda, sinSigma, cosLambda, cos2SigmaM, cosSigma, sigma, sinAlpha ; 
   do {
      sinLambda = Math.sin(lambda);
      cosLambda = Math.cos(lambda);
      sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) +
         (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
      if (sinSigma == 0) {
         let result = { distance: 0, initialBearing: 0, finalBearing: 0 };
         return result;
      };  // co-incident points
      cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
      sigma = Math.atan2(sinSigma, cosSigma);
      let sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
      cosSqAlpha = 1 - sinAlpha * sinAlpha;
      cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
      
      if (isNaN(cos2SigmaM)) cos2SigmaM = 0;  // equatorial line: cosSqAlpha=0 (§6)
      let C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
      lambdaP = lambda;
      lambda = L + (1 - C) * f * sinAlpha *
         (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
   } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);

   if (iterLimit == 0) return null  // formula failed to converge

   let uSq = cosSqAlpha * (a * a - b * b) / (b * b);
   let A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
   let B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
   let deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
      B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
      let s = b * A * (sigma - deltaSigma);

   s = Number(s.toFixed(3)); // round to 1mm precision

   // note: to return initial/final bearings in addition to distance, use something like:
   let fwdAz = Math.atan2(cosU2 * sinLambda, cosU1 * sinU2 - sinU1 * cosU2 * cosLambda);
   let revAz = Math.atan2(cosU1 * sinLambda, -sinU1 * cosU2 + cosU1 * sinU2 * cosLambda);
   let result = { distance: s, initialBearing: toDeg(fwdAz), finalBearing: toDeg(revAz) };
   return result;
}

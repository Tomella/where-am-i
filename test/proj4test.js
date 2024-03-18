import proj4 from "proj4";

const epsg7844 = proj4.defs("EPSG:7844","+proj=longlat +ellps=GRS80 +no_defs +type=crs");
const epsg7843 = proj4.defs("EPSG:7843","+proj=longlat +ellps=GRS80 +no_defs +type=crs");
const epsg7854 = proj4.defs("EPSG:7854","+proj=utm +zone=54 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
// proj4.defs("EPSG:7842","+proj=geocent +ellps=GRS80 +units=m +no_defs +type=crs");

const epsg8059 = proj4.defs("EPSG:8059","+proj=lcc +lat_0=-32 +lon_0=135 +lat_1=-28 +lat_2=-36 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");


console.log("[-34.5, 138.2]", proj4("EPSG:4326", "EPSG:7854", [-34.5, 138.2]))
console.log("[-34.6, 138.3]", proj4("EPSG:4326", "EPSG:7854", [-34.6, 138.3]))
console.log("[-34.8, 138.4]", proj4("EPSG:4326", "EPSG:7854", [-34.8, 138.4]))

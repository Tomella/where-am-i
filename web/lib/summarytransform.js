export default class SummaryTransform {

    static daysToMonths(data ={}) {
        window.df = data;
        console.log(data)
        return Object.entries(data).reduce((months, [key, value]) => {
            let monthKey = key.substring(0, 7);
            let month = months[monthKey]
            if(!month) {
                months[monthKey] = {firstDate: key, lastDate: key, days: 1, ...value};    // destructure as we don't want to touch the original
            } else {
                month.total += value.total;
                ++month.days;
                month.minlng = Math.min(month.minlng, value.minlng);
                month.minlat = Math.min(month.minlat, value.minlat);
                month.maxlng = Math.max(month.maxlng, value.maxlng);
                month.maxlat = Math.max(month.maxlat, value.maxlat);
                month.lastDate = key;
            }
            return months;
        }, {});
    }

    static daysToSeasons(data ={}) {
        let seasonKeys = [,"Summer", "Summer", "Autumn", "Autumn", "Autumn", "Winter", "Winter", "Winter", "Spring", "Spring", "Spring", "Summer"];
        let seasonIndex = ["Autumn", "Winter", "Spring", "Summer"];
        return Object.entries(data).reduce((seasons, [key, value]) => {
            let month = parseInt(key.substring(5, 7));
            let season = seasonKeys[month];
            
            let year = parseInt(key.substring(2, 4));
            year -= month < 3 ? 1 : 0;              // Summer started year
            let seasonKey = year + "-" + seasonIndex.indexOf(season);

            let entry = seasons[seasonKey];
            if(!entry) {
                seasons[seasonKey] = {season: (season + " " + year + (season === "Summer"? "/" + (year + 1) : "")), 
                    firstDate: key, lastDate: key, days: 1, ...value};    // destructure as we don't want to touch the original
            } else {
                entry.total += value.total;
                ++entry.days;
                entry.minlng = Math.min(entry.minlng, value.minlng);
                entry.minlat = Math.min(entry.minlat, value.minlat);
                entry.maxlng = Math.max(entry.maxlng, value.maxlng);
                entry.maxlat = Math.max(entry.maxlat, value.maxlat);
                entry.lastDate = key;
            }
            return seasons;
        }, {});
    }
}
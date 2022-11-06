export default L.Control.extend({
    _container: null,
    options: {
        position: 'bottomleft'
    },

    onAdd: function (map) {
        var latlng = L.DomUtil.create('div', 'mouseposition');
        this._latlng = latlng;

        map.addEventListener('mousemove', (event) => {
            this.updateHTML(event.latlng.lat, event.latlng.lng);
        });
        return latlng;
    },

    updateHTML: function (lat, lng) {
        this._latlng.innerHTML = "Lat: " + lat.toFixed(5) + "&deg;   Lng: " + lng.toFixed(5) + "&deg;";
        //this._latlng.innerHTML = "LatLng: " + latlng;
    }
});


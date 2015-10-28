// JavaScript source code
var googleApiService = {
    autoComplete: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var circle = new google.maps.Circle({
                    center: geolocation,
                    radius: position.coords.accuracy
                });

                var input = document.getElementById('txtRestaurant');
                var options = {
                    bounds: circle.getBounds(),
                    types: ['establishment']
                };

                autocomplete = new google.maps.places.Autocomplete(input, options);
            });
        }
    }
};
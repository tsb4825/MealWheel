// JavaScript source code
var googleApiService = {
    autoComplete: function (keyword, isGoodRestaurant) {
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
                
                var request = {
                    bounds: circle.getBounds(),
                    types: ['food'],
                    keyword: keyword
                };

                var service = new google.maps.places.PlacesService($("#googleAttribution").get(0));
                var result = service.nearbySearch(request, callback);
            });
        }

        function callback(results, status) {
            var firstFiveResults = results.slice(0,5).map(function(item){return item.name});

        }
    }
};
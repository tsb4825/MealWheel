// JavaScript source code
var googleApiService = {
    nearbyFood: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var circle = new google.maps.Circle({
                    location: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    radius: 20
                });
                
                var request = {
                    location: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    radius: 1000,
                    types: ['food']
                };

                var service = new google.maps.places.PlacesService($("#googleAttribution").get(0));
                var result = service.nearbySearch(request, callback);
            });
        }

        function callback(results, status) {
            $("#nearbyFood").html();
            var firstFiveResults = results.map(function(item){return item.name});
            firstFiveResults.forEach(function (element) {
                $("#nearbyFood").append("<h6 class=\"nearbyFoodText\" onclick=\"$('#txtRestaurant').val('" + element.replace("'","\\'").replace("\"", "\"\"") + "');\">" + element + "</h6>");
            });
        }
    }
};
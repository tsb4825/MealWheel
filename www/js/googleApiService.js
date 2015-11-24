// JavaScript source code
var googleApiService = {
    googleResults: [],
    cacheExpireTime: "",
    setNearbyFood: function () {
        var self = this;
        if (this.cacheExpireTime < new Date()) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var geolocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    var request = {
                        location: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                        radius: 2000,
                        types: ['restaurant']
                    };

                    var service = new google.maps.places.PlacesService($("#googleAttribution").get(0));
                    var result = service.nearbySearch(request, callback);

                    self.cacheExpireTime = new Date();
                    self.cacheExpireTime.setHours(new Date().getHours() + 1);
                });
            }
            else {
                $("#nearbyFood").html();
                reMappedResults.forEach(function (element) {
                    $("#nearbyFood").append("<h6 class=\"nearbyFoodText\" onclick=\"$('#txtRestaurant').val('" + element.replace("'", "\\'").replace("\"", "\"\"") + "');\">" + element + "</h6>");
                });
            }
        }

        function callback(results, status) {
            var self = this;
            $("#nearbyFood").html();
            var reMappedResults = results.map(function (item) { return item.name });
            self.googleResults = reMappedResults;
            reMappedResults.forEach(function (element) {
                $("#nearbyFood").append("<h6 class=\"nearbyFoodText\" onclick=\"$('#txtRestaurant').val('" + element.replace("'","\\'").replace("\"", "\"\"") + "');\">" + element + "</h6>");
            });
        }
    }
};
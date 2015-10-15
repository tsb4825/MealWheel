// JavaScript source code
var yelpService = {
    search: function(zipCode) {
        var auth = {
            consumerKey: "ux2ndNHOYPxRyLgnkxl5nQ",
            consumerSecret: "gPKZqQwNkxIJTqpAv8XrclAOv90",
            accessToken: "pw6kRbtHm-ywmST9mSxOrUpArMTp5-4L",
            accessTokenSecret: "IQbhLbSgO2zL7FVibtOxTuFf908",
            serviceProvider: {
                signatureMethod: "HMAC-SHA1"
            }
        };

        var terms = 'food';
        var near = zipCode;

        var accessor = {
            consumerSecret: auth.consumerSecret,
            tokenSecret: auth.accessTokenSecret
        };
        parameters = [];
        parameters.push(['term', terms]);
        parameters.push(['location', near]);
        parameters.push(['callback', 'cb']);
        parameters.push(['oauth_consumer_key', auth.consumerKey]);
        parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
        parameters.push(['oauth_token', auth.accessToken]);
        parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

        var message = {
            'action': 'http://api.yelp.com/v2/search',
            'method': 'GET',
            'parameters': parameters
        };

        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);

        var parameterMap = OAuth.getParameterMap(message.parameters);
        console.log(parameterMap);

        $.ajax({
            'url': message.action,
            'data': parameterMap,
            'dataType': 'jsonp',
            'jsonpCallback': 'cb',
            'success': function (data, textStats, XMLHttpRequest) {
                console.log(data);
            }
        });
    }
};
//cordova-plugin-admobpro
var adMobService = {
    admobid: {},
    setupAds: function () {
        var self = this;
        self.admobid = {};
        if (/(android)/i.test(navigator.userAgent)) { // for android & amazon-fireos
            self.admobid = {
                banner: 'ca-app-pub-xxx/xxx', // or DFP format "/6253334/dfp_example_ad"
                interstitial: 'ca-app-pub-xxx/yyy'
            };
        } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
            self.admobid = {
                banner: 'ca-app-pub-xxx/zzz', // or DFP format "/6253334/dfp_example_ad"
                interstitial: 'ca-app-pub-2576388243018105/7664732077'
            };
        } else { // for windows phone
            self.admobid = {
                banner: 'ca-app-pub-xxx/zzz', // or DFP format "/6253334/dfp_example_ad"
                interstitial: 'ca-app-pub-xxx/yyy'
            };
        }
        if (AdMob) AdMob.prepareInterstitial({ adId: self.admobid.interstitial, autoShow: false });
    },
    showAdInterstitial: function() {
        var self = this;

        if (AdMob) AdMob.showInterstitial();
    }
};
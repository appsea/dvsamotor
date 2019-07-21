var admob = {};

admob.AD_SIZE = {
    SMART_BANNER: "SMART",
    LARGE_BANNER: "LARGE",
    BANNER: "BANNER",
    MEDIUM_RECTANGLE: "MEDIUM",
    FULL_BANNER: "FULL",
    LEADERBOARD: "LEADERBOARD",
    SKYSCRAPER: "SKYSCRAPER",
    FLUID: "FLUID"
};

admob._getBannerType = function (size) {
    if (size == admob.AD_SIZE.BANNER) {
        return com.google.android.gms.ads.AdSize.BANNER;
    } else if (size == admob.AD_SIZE.LARGE_BANNER) {
        return com.google.android.gms.ads.AdSize.LARGE_BANNER;
    } else if (size == admob.AD_SIZE.MEDIUM_RECTANGLE) {
        return com.google.android.gms.ads.AdSize.MEDIUM_RECTANGLE;
    } else if (size == admob.AD_SIZE.FULL_BANNER) {
        return com.google.android.gms.ads.AdSize.FULL_BANNER;
    } else if (size == admob.AD_SIZE.FLUID) {
        return com.google.android.gms.ads.AdSize.FLUID;
    } else if (size == admob.AD_SIZE.LEADERBOARD) {
        // doesn't seem to work on Android - using large instead
        //return com.google.android.gms.ads.AdSize.LEADERBOARD;
        return com.google.android.gms.ads.AdSize.LARGE_BANNER;
    } else if (size == admob.AD_SIZE.SKYSCRAPER) {
        return com.google.android.gms.ads.AdSize.WIDE_SKYSCRAPER;
    } else if (size == admob.AD_SIZE.SMART_BANNER) {
        return com.google.android.gms.ads.AdSize.SMART_BANNER;
    } else {
        return null;
    }
};

admob.defaults = {
    margins: {
        top: -1,
        bottom: -1
    },
    testing: false,
    size: admob.AD_SIZE.SMART_BANNER
};

admob.merge = function merge(obj1, obj2) { // Our merge function
    var result = {}; // return result
    for (var i in obj1) {      // for every property in obj1
        if ((i in obj2) && (typeof obj1[i] === "object") && (i !== null)) {
            result[i] = merge(obj1[i], obj2[i]); // if it's an object, merge
        } else {
            result[i] = obj1[i]; // add it to result
        }
    }
    for (i in obj2) { // add the remaining properties from object 2
        if (i in result) { //conflict
            continue;
        }
        result[i] = obj2[i];
    }
    return result;
};

module.adView = null;
module.interstitialView = null;
module.videoView = null;

module.exports = admob;
export class CoolAds {

    static getInstance(): CoolAds;

    createBanner(arg): Promise<any>;

    createInterstitial(arg): Promise<any>;

    hideBanner(): Promise<any>;

    preloadInterstitial(arg): Promise<any>;

    showInterstitial(): Promise<any>;

    preloadVideoAd(arg, rewardCB, reload, afterAdLoaded): Promise<any>;

    showVideoAd(): Promise<any>;

    adLoaded(): boolean;
}

import * as httpModule from "@nativescript/core/http";
import { AES, enc } from "crypto-js";

declare let myGlobal: any;

export class HttpService {

    static getInstance(): HttpService {
        return HttpService._instance;
    }

    private static _instance: HttpService = new HttpService();

    private static url: string;

    private constructor() {
        const bytes  = AES.decrypt(myGlobal.monica, myGlobal.gupit);
        HttpService.url = bytes.toString(enc.Utf8);
    }

    showAds(): Promise<string> {
        const url = HttpService.url + "ads.json";

        return httpModule.getString(url);
    }

    getQuestions<T>(): Promise<T> {
        const url = HttpService.url + "questions.json";

        return httpModule.getJSON(url);
    }

    getPremiumQuestions<T>(): Promise<T> {
        const url = HttpService.url + "premium.json";

        return httpModule.getJSON(url);
    }

    findLatestQuestionVersion(): Promise<string> {
        const url = HttpService.url + "questionVersion.json";

        return httpModule.getString(url);
    }

    findPremiumRange<T>(orderBy: string, startAt: number, endAt: number): Promise<T> {
        const url = HttpService.url + "premium.json" + "?orderBy=\"" + orderBy
            + "\"&startAt=" + startAt + "&endAt=" + endAt;

        return httpModule.getJSON(url);
    }

    checkPlayStoreVersion(): Promise<string> {
        const url = HttpService.url + "playStoreVersion.json";

        return httpModule.getString(url);
    }

    checkTotalQuestions(): Promise<string> {
        const url = HttpService.url + "totalQuestions.json";

        return httpModule.getString(url);
    }

    getCategories<T>(): Promise<T> {
        const url = HttpService.url + "categories.json";

        return httpModule.getJSON(url);
    }

    getCodes<T>(): Promise<T> {
        const url = HttpService.url + "codes.json";

        return httpModule.getJSON(url);
    }

    httpPost(postfix: string, data: any) {
        httpModule.request({
            url: HttpService.url + postfix,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        });
    }
}

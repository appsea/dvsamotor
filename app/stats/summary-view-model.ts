import * as Toast from "nativescript-toast";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { setTimeout } from "tns-core-modules/timer";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { AdService } from "~/admob/ad.service";
import { HttpService } from "~/services/http.service";
import { PersistenceService } from "~/services/persistence.service";
import { QuestionService } from "~/services/question.service";
import { QuestionUtil } from "~/services/question.util";
import { ConnectionService } from "~/shared/connection.service";
import { IPracticeStats, IResult } from "~/shared/questions.model";
import { QuizUtil } from "~/shared/quiz.util";
import * as constantsModule from "../shared/constants";
import * as navigationModule from "../shared/navigation";

export class SummaryViewModel extends Observable {

    static getInstance(): SummaryViewModel {
        return SummaryViewModel._instance;
    }

    private static _instance: SummaryViewModel = new SummaryViewModel();

    get overall() {
        const results: Array<IResult> = PersistenceService.getInstance().getResult();
        let correct: number = 0;
        let total: number = 0;
        const totalExams: number = results.length;
        results.forEach((re) => {
            correct += re.correct;
            total += re.total;
        });
        const overall: Array<IResult> = [];
        let percentage = total === 0 ? 0 : Math.floor(correct * 100 / total);
        percentage = QuestionUtil.validatePercentage(percentage);
        const percentageString: string = percentage + "%";
        const result: IResult = {
            date: QuizUtil.getDateString(new Date()),
            correct,
            total,
            totalExams,
            percentage: percentageString,
            pass: percentage > 70
        };
        overall.push(result);

        return result;
    }

    get ps(): IPracticeStats {
        return this._ps;
    }

    get practiceAccuracy() {
        return this._practiceAccuracy;
    }

    get practiceCoverage() {
        return this._practiceCoverage;
    }

    get mock(): IResult {
        return this._mock;
    }

    get questionSize() {
        return this._questionSize;
    }

    get serverQuestionSize() {
        return !isNaN(this._serverQuestionSize) ? this._serverQuestionSize : constantsModule.TOTAL_QUESTIONS;
    }

    get isPremium() {
        return this._isPremium;
    }

    get allQuestionsLoaded() {
        return this._allQuestionsLoaded;
    }

    get rewards() {
        return this._rewards;
    }

    get adLoaded() {
        return AdService.getInstance().adLoaded();
    }

    get error() {
        return this._error;
    }

    private _checked: boolean = false;

    private _ps: IPracticeStats;

    private _mock: IResult;
    private _practiceAccuracy: number;
    private _practiceCoverage: number;
    private _serverQuestionSize: number = constantsModule.TOTAL_QUESTIONS;
    private _questionSize: number = 200;
    private _rewards: number = 10;
    private _isPremium: boolean = false;
    private _error: boolean = false;

    private _allQuestionsLoaded: boolean = false;

    private constructor() {
        super();
        this.load();
        this.preloadVideoAd();
    }

    load(): any {
        this.calculate();
        if (!this._checked && ConnectionService.getInstance().isConnected()) {
            HttpService.getInstance().checkTotalQuestions().then((st) => {
                this._serverQuestionSize = !isNaN(Number(st)) ? Number(st) : constantsModule.TOTAL_QUESTIONS;
                this.calculate();
                this._checked = true;
            });
        }
    }

    topUpRewards() {
        if (ConnectionService.getInstance().isConnected()) {
            this.showVideoAd();
        } else {
            dialogs.alert("Please connect to internet!!!");
        }
    }

    goPremium() {
        navigationModule.toPage("premium/premium-page");
    }

    preloadVideoAd() {
        if (!PersistenceService.getInstance().isPremium() && !AdService.getInstance().adLoaded()) {
            AdService.getInstance().preloadVideoAd({
                testing: AdService._testing,
                iosInterstitialId: constantsModule.REWARD_AD_ID, // add your own
                androidInterstitialId: constantsModule.REWARD_AD_ID, // add your own
                // Android automatically adds the connected device as test device with testing:true, iOS does not
                iosTestDeviceIds: ["ce97330130c9047ce0d4430d37d713b2"],
                keywords: ["games", "education"] // add keywords for ad targeting
            }, (reward) => {
                QuestionService.getInstance().findPremiumRange((this._questionSize + 1),
                    (this._questionSize + this._rewards)).then(() => this.calculate(),
                    (e) => console.log("Got error....", e));
            }, () => {
                this.preloadVideoAd();
            }, () => {
                this._error = false;
                this.calculate();
            }).then(
                (reward) => {
                    console.log("interstitial reward but this does nothing..", reward);
                },
                (error) => {
                    console.log("admob preloadInterstitial error:: " + error);
                    this._error = true;
                    this.calculate();
                }
            );
        }
    }

    calculate() {
        this._isPremium = PersistenceService.getInstance().isPremium();
        this._questionSize = QuestionService.getInstance().readQuestionSize();
        this._ps = PersistenceService.getInstance().readPracticeStats();
        this._practiceAccuracy = this._ps.attempted.length === 0 ? 0
            : Math.floor(this._ps.correct.length * 100 / this._ps.attempted.length);
        this._practiceCoverage = this._questionSize === 0 ? 0 : Math.floor(this._ps.attempted.length * 100 / this._questionSize);
        this._mock = this.overall;
        this._allQuestionsLoaded = this._questionSize === this._serverQuestionSize;
        this._rewards = this._serverQuestionSize - this._questionSize > 10 ? 10
            : this._serverQuestionSize - this._questionSize;
        this._practiceAccuracy = QuestionUtil.validatePercentage(this._practiceAccuracy);
        this._practiceCoverage = QuestionUtil.validatePercentage(this._practiceCoverage);
        this.publish();
    }

    resetAllStats() {
        dialogs.confirm("Are you sure you want to clear practice and Mock exam stats?").then((proceed) => {
            if (proceed) {
                PersistenceService.getInstance().resetAllStats();
                this.calculate();
                Toast.makeText("Cleared Practice and Mock Stats!!!", "long").show();
            }
        });
    }

    private publish() {
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "serverQuestionSize", value: this._serverQuestionSize
        });
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "mock", value: this._mock
        });
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "questionSize", value: this._questionSize
        });
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "ps", value: this._ps
        });
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "premium", value: this._isPremium
        });
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "allQuestionsLoaded", value: this._allQuestionsLoaded
        });
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "adLoaded", value: this.adLoaded
        });
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "error", value: this.error
        });
    }

    private showVideoAd() {
        AdService.getInstance().showVideoAd().then(
            () => {
                console.log("interstitial showing");
            },
            (error) => {
                console.log("admob showInterstitial error: " + error);
            }
        );
    }
}

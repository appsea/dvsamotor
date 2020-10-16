import * as appSettings from "@nativescript/core/application-settings";
import { EventData, Observable } from "@nativescript/core/data/observable";
import * as dialogs from "@nativescript/core/ui/dialogs";
import { TextField } from "@nativescript/core/ui/text-field";
import * as purchase from "nativescript-purchase";
import { AdService } from "~/admob/ad.service";
import { HttpService } from "~/services/http.service";
import { PersistenceService } from "~/services/persistence.service";
import { QuestionService } from "~/services/question.service";
import { IPromoCode } from "~/shared/questions.model";
import * as constantsModule from "../shared/constants";

export class PremiumModel extends Observable {

    get item() {
        return this._item;
    }

    get loading() {
        return this._loading;
    }

    get showPromoBox() {
        return this._showPromoBox;
    }

    get premium() {
        return this._premium;
    }

    private _loading: boolean = true;
    private _showPromoBox: boolean = false;
    private _premium: boolean = false;
    private _item: any;

    constructor() {
        super();
        if (!PersistenceService.getInstance().isPremium()) {
            purchase.getProducts()
                .then((res) => {
                    // this._items = res;
                    this._item = res[0];
                    this._loading = false;
                    this.publish();
                })
                .catch((e) => {
                    this._item.priceFormatted = "Oops..Please try again!!";
                    this._loading = false;
                });

        } else {
            this._premium = true;
            this.publish();
        }
    }

    restorePurchase() {
        try {
            purchase.restorePurchases();
        } catch (error) {
            console.error(error);
        }
    }

    pay() {
        try {
            purchase.buyProduct(this._item);
        } catch (error) {
            if (error.message.includes("Product already purchased")) {
                this.grantRights();
                dialogs.alert("You are a premium user now! You wont be charged twice as you've already paid earlier!");
            }
        }
    }

    grantRights() {
        appSettings.setBoolean(constantsModule.PREMIUM, true);
        AdService.getInstance().showAd = false;
        this._premium = true;
        this.publish();
        QuestionService.getInstance().readAllQuestions();
    }

    togglePromoBox() {
        this._showPromoBox = !this._showPromoBox;
        this.publish();
    }

    submitPromoCode(args) {
        this._loading = true;
        this.publish();
        const textField = <TextField>args.object;
        HttpService.getInstance().getCodes().then((promoCodes: Array<IPromoCode>) => {
            const codes: Array<IPromoCode> = promoCodes.filter((m: IPromoCode) => m.code.toUpperCase() === textField.text.toUpperCase());
            if (codes.length > 0) {
                const code: IPromoCode = codes[0];
                const startDate: Date = new Date(code.startDate);
                const endDate: Date = new Date(code.endDate);
                const currentDate: Date = new Date();
                if (currentDate >= startDate && currentDate <= endDate) {
                    this.grantRights();
                } else {
                    dialogs.alert("Invalid Code");
                }
            } else {
                dialogs.alert("Invalid Code");
            }
            this._loading = false;
            this.publish();
        }).catch((e) => {
            dialogs.alert("Invalid Code");
        });
    }

    private publish() {
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "item", value: this._item
        });
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "premium", value: this.premium
        });
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "loading", value: this._loading
        });
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "showPromoBox", value: this._showPromoBox
        });
    }
}

import * as purchase from "nativescript-purchase";
import * as appSettings from "tns-core-modules/application-settings";
import { EventData, Observable } from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { AdService } from "~/admob/ad.service";
import { PersistenceService } from "~/services/persistence.service";
import { QuestionService } from "~/services/question.service";
import * as constantsModule from "../shared/constants";

export class PremiumModel extends Observable {

    get item() {
        return this._item;
    }

    get loading() {
        return this._loading;
    }

    get premium() {
        return this._premium;
    }

    private _loading: boolean = true;
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

    private publish() {
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "item", value: this._item
        });
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "loading", value: this._loading
        });
        this.notify({
            object: this, eventName: Observable.propertyChangeEvent,
            propertyName: "premium", value: this.premium
        });
    }
}

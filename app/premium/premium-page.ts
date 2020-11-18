import * as appSettings from "@nativescript/core/application-settings";
import { EventData } from "@nativescript/core/data/observable";
import * as dialogs from "@nativescript/core/ui/dialogs";
import { ItemEventData } from "@nativescript/core/ui/list-view";
import { NavigatedData, Page } from "@nativescript/core/ui/page";
import * as purchase from "nativescript-purchase";
import { Transaction, TransactionState } from "nativescript-purchase/transaction";
import { AdService } from "~/admob/ad.service";
import { QuestionViewModel } from "~/question/question-view-model";
import { QuestionService } from "~/services/question.service";
import { SelectedPageService } from "~/shared/selected-page-service";
import * as constantsModule from "../shared/constants";
import * as navigationModule from "../shared/navigation";
import { PremiumModel } from "./premium-model";

let vm: PremiumModel;
let showDialog: boolean = true;

export function onNavigatingTo(args: NavigatedData) {
    /* ***********************************************************
    * The "onNavigatingTo" event handler lets you detect if the user navigated with a back button.
    * Skipping the re-initialization on back navigation means the user will see the
    * page in the same data state that he left it in before navigating.
    *************************************************************/
    const page = <Page>args.object;
    vm = new PremiumModel();
    page.bindingContext = vm;
    SelectedPageService.getInstance().updateSelectedPage("premium");
    purchase.on(purchase.transactionUpdatedEvent, (transaction: Transaction) => {
        if (transaction.transactionState === TransactionState.Restored
            || transaction.transactionState === TransactionState.Purchased) {
            appSettings.setBoolean(constantsModule.PREMIUM, true);
            AdService.getInstance().showAd = false;
            QuestionService.getInstance().readAllQuestions();
            if (showDialog) {
                dialogs.alert("Congratulations! You are a premium user now!");
                showDialog = false;
            }
        }
    });
    AdService.getInstance().hideAd();
}

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function pay(data: ItemEventData) {
    showDialog = true;
    vm.pay();
}

export function onRestoreTap(data: ItemEventData) {
    showDialog = true;
    vm.restorePurchase();
}

export function practice(args: EventData) {
    navigationModule.toPage("category/category-page");
}

export function havePromo(args: EventData) {
    vm.togglePromoBox();
}

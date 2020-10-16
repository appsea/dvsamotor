import { AndroidActivityBackPressedEventData, AndroidApplication } from "@nativescript/core/application";
import { EventData, Observable } from "@nativescript/core/data/observable";
import { isAndroid } from "@nativescript/core/platform";
import * as dialogs from "@nativescript/core/ui/dialogs";
import { topmost } from "@nativescript/core/ui/frame";
import { StackLayout } from "@nativescript/core/ui/layouts/stack-layout";
import { NavigatedData, Page } from "@nativescript/core/ui/page";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { AdService } from "~/admob/ad.service";
import { QuestionViewModel } from "~/question/question-view-model";
import * as navigationModule from "../navigation";
import { IState } from "../questions.model";
import { ResultViewModel } from "./result-view-model";

let page: Page;
let state: IState;
let vm: ResultViewModel;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    const pg = args.object;
    if (pg != null && !pg.hasListeners(AndroidApplication.activityBackPressedEvent)) {
        pg.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
    }
    AdService.getInstance().hideAd();
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    dialogs.confirm("Do you want to start new exam?").then((proceed) => {
        if (proceed) {
            navigationModule.toPage("question/" + state.mode.toLowerCase());
        }
    });
    args.cancel = true;
}

export function onNavigatingTo(args: NavigatedData) {
    if (args.isBackNavigation) {
        return;
    }
    page = <Page>args.object;
    state = <IState> page.navigationContext;
    vm = new ResultViewModel(state);
    page.bindingContext = vm;
}

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function detailedResult(): void {
    vm.detailedResult();
}

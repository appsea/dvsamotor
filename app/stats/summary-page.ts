import { AndroidActivityBackPressedEventData, AndroidApplication } from "@nativescript/core/application";
import { EventData, Observable } from "@nativescript/core/data/observable";
import { isAndroid, isIOS } from "@nativescript/core/platform";
import { topmost } from "@nativescript/core/ui/frame";
import { NavigatedData, Page } from "@nativescript/core/ui/page";
import { CreateViewEventData } from "@nativescript/core/ui/placeholder";
import { Progress } from "@nativescript/core/ui/progress";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { QuestionViewModel } from "~/question/question-view-model";
import { SelectedPageService } from "~/shared/selected-page-service";
import { SummaryViewModel } from "~/stats/summary-view-model";
import * as navigationModule from "../shared/navigation";

declare let CGAffineTransformMakeScale: any; // or use tns-platform-declarations instead of casting to any

let vm: SummaryViewModel;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    const page = args.object;
    page.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    navigationModule.toPage("category/category-page");
    args.cancel = true;
}

export function onNavigatingTo(args: NavigatedData) {
    /* ***********************************************************
    * The "onNavigatingTo" event handler lets you detect if the user navigated with a back button.
    * Skipping the re-initialization on back navigation means the user will see the
    * page in the same data state that he left it in before navigating.
    *************************************************************/
    const page = <Page>args.object;
    vm = SummaryViewModel.getInstance();
    page.bindingContext = vm;
    SelectedPageService.getInstance().updateSelectedPage("stats");
    setTimeout(() => {
        vm.calculate();
    }, 100);

}

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function topUpRewards(args: EventData) {
    vm.topUpRewards();
}

export function goPremium() {
    vm.goPremium();
}

export function onProgressLoaded(args: EventData) {

    const progress = <Progress>args.object;

    if (isAndroid) {
        progress.android.setScaleY(8);  //  progress.android === android.widget.ProgressBar
    } else if (isIOS) {
        const transform = CGAffineTransformMakeScale(1.0, 5.0);
        progress.ios.transform = transform; // progress.ios === UIProgressView
    }
}

export function showProgress() {
    navigationModule.toPage("stats/progress-page");
}

export function calculate() {
    vm.calculate();
}

export function resetAllStats() {
    vm.resetAllStats();
}

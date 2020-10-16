import { AndroidActivityBackPressedEventData, AndroidApplication } from "@nativescript/core/application";
import { EventData, Observable } from "@nativescript/core/data/observable";
import * as dialogs from "@nativescript/core/ui/dialogs";
import { topmost } from "@nativescript/core/ui/frame";
import { StackLayout } from "@nativescript/core/ui/layouts/stack-layout";
import { NavigatedData, Page } from "@nativescript/core/ui/page";
import * as Toast from "nativescript-toast";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { AdService } from "~/admob/ad.service";
import { QuestionViewModel } from "~/question/question-view-model";
import * as navigationModule from "~/shared/navigation";
import { SelectedPageService } from "~/shared/selected-page-service";
import { ProgressViewModel } from "./progress-view-model";

let page: Page;
let vm: ProgressViewModel;

export function onPageLoaded(args: EventData): void {
    const pg = args.object;
    pg.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
    AdService.getInstance().hideAd();
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    onDrawerButtonTap(args);
    args.cancel = true;
}

export function onNavigatingTo(args: NavigatedData): void {
    page = <Page>args.object;
    vm = new ProgressViewModel();
    page.bindingContext = vm;
    SelectedPageService.getInstance().updateSelectedPage("stats");
}

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function startTest(args: EventData) {
    navigationModule.toPage("question/mock-page");
}

export function showChart(args: EventData) {
    navigationModule.toPage("stats/chart-page");
}

export function resetExamStats(): void {
    dialogs.confirm("Are you sure you want to clear your test statistics?").then((proceed) => {
        if (proceed) {
            vm.resetExamStats();
            navigationModule.toPage("stats/progress-page");
            Toast.makeText("Cleared Exam Stats!!!", "long").show();
        }
    });
}

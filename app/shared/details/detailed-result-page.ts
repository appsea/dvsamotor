import { AndroidActivityBackPressedEventData, AndroidApplication } from "@nativescript/core/application";
import { EventData, Observable } from "@nativescript/core/data/observable";
import { isAndroid } from "@nativescript/core/platform";
import { topmost } from "@nativescript/core/ui/frame";
import * as ListView from "@nativescript/core/ui/list-view";
import { NavigatedData, Page } from "@nativescript/core/ui/page";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { QuestionViewModel } from "~/question/question-view-model";
import { QuizUtil } from "~/shared/quiz.util";
import * as navigationModule from "../navigation";
import { IState } from "../questions.model";
import { DetailedResultViewModel } from "./detailed-result-view-model";

let page: Page;
let vm: DetailedResultViewModel;
let list: ListView.ListView;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    const pg = args.object;
    pg.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    navigationModule.goBack();
    args.cancel = true;
}

export function onNavigatingTo(args: NavigatedData): void {
    page = <Page>args.object;
    list = page.getViewById("listView");
    const state: IState = <IState> page.navigationContext;
    vm = new DetailedResultViewModel(state);
    page.bindingContext = vm;
}

export function onNavigatedFrom(args): void {
    QuizUtil.hideKeyboard();
}

export function onDrawerButtonTap(args: EventData) {
    QuizUtil.hideKeyboard();
    QuestionViewModel.showDrawer();
}

export function toggleSearch(args: EventData) {
    vm.toggleSearch();
}

export function clear() {
    vm.clear();
}

export function all(): void {
    vm.all();
    list.scrollToIndex(0);
}

export function correct(): void {
    vm.correct();
    list.scrollToIndex(0);
}

export function incorrect(): void {
    vm.incorrect();
    list.scrollToIndex(0);
}

export function skipped(): void {
    vm.skipped();
    list.scrollToIndex(0);
}

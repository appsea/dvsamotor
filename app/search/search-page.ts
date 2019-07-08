import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { AndroidActivityBackPressedEventData, AndroidApplication } from "tns-core-modules/application";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { isAndroid } from "tns-core-modules/platform";
import { topmost } from "tns-core-modules/ui/frame";
import * as ListView from "tns-core-modules/ui/list-view";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { QuestionViewModel } from "~/question/question-view-model";
import { SearchPageModel } from "~/search/search-page-model";
import { QuizUtil } from "~/shared/quiz.util";
import { SelectedPageService } from "~/shared/selected-page-service";
import * as navigationModule from "../shared/navigation";

let page: Page;
let vm: SearchPageModel;
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
    SelectedPageService.getInstance().updateSelectedPage("search");
    vm = new SearchPageModel();
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

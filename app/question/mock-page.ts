import { android, AndroidActivityBackPressedEventData, AndroidApplication } from "@nativescript/core/application";
import { EventData } from "@nativescript/core/data/observable";
import { isAndroid } from "@nativescript/core/platform";
import * as dialogs from "@nativescript/core/ui/dialogs";
import { topmost } from "@nativescript/core/ui/frame";
import { SwipeDirection } from "@nativescript/core/ui/gestures";
import * as ListView from "@nativescript/core/ui/list-view";
import { NavigatedData, Page } from "@nativescript/core/ui/page";
import { CreateViewEventData } from "@nativescript/core/ui/placeholder";
import { ScrollView } from "@nativescript/core/ui/scroll-view";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { AdService } from "~/admob/ad.service";
import { QuestionViewModel } from "~/question/question-view-model";
import { ConnectionService } from "~/shared/connection.service";
import { SelectedPageService } from "~/shared/selected-page-service";
import * as constantsModule from "../shared/constants";
import { TimerViewModel } from "./timer-view-model";

let vm: TimerViewModel;
let optionList: ListView.ListView;
let scrollView: ScrollView;
let banner: any;
let loaded: boolean = false;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    loaded = false;
    setTimeout(() => showBannerAd(), 1000);
}

function showBannerAd(): void {
    if (AdService.getInstance().showAd && (!loaded || (banner && banner.height === "auto"))) {
        AdService.getInstance().showSmartBanner().then(
            () => {
                loaded = true;
                banner.height = AdService.getInstance().getAdHeight() + "dpi";
            },
            (error) => {
                resetBanner();
            }
        );
    }
}

export function resetBanner() {
    if (banner) {
        banner.height = "0";
    }
    loaded = false;
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    previous();
    args.cancel = true;
}

export function onNavigatingFrom(args: NavigatedData) {
    vm.stopTimer();
}

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/
export function onNavigatingTo(args: NavigatedData) {
    /* ***********************************************************
    * The "onNavigatingTo" event handler lets you detect if the user navigated with a back button.
    * Skipping the re-initialization on back navigation means the user will see the
    * page in the same data state that he left it in before navigating.
    *************************************************************/
    SelectedPageService.getInstance().updateSelectedPage("mock");
    if (args.isBackNavigation) {
        vm.startTimer();

        return;
    }
    const page = <Page>args.object;
    page.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
    optionList = page.getViewById("optionList");
    scrollView = page.getViewById("scrollView");
    banner = page.getViewById("banner");
    vm = new TimerViewModel(constantsModule.MOCK);
    page.bindingContext = vm;
}

export function handleSwipe(args) {
    if (args.direction === SwipeDirection.left) {
        next();
    } else if (args.direction === SwipeDirection.right) {
        previous();
    }
}

export function showMap(): void {
    vm.showMap();
}

/* ***********************************************************
* According to guidelines, if you have a drawer on your page, you should always
* have a button that opens it. Get a reference to the RadSideDrawer view and
* use the showDrawer() function to open the app drawer section.
*************************************************************/
export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function previous(): void {
    vm.previous();
    if (scrollView) {
        scrollView.scrollToVerticalOffset(0, false);
    }
}

export function flag(): void {
    vm.flag();
}

export function next(): void {
    if (AdService.getInstance().showAd && !ConnectionService.getInstance().isConnected()) {
        dialogs.alert("Please connect to internet so that we can fetch next question for you!");
    } else {
        vm.next();
        showBannerAd();
        if (scrollView) {
            scrollView.scrollToVerticalOffset(0, false);
        }
        vm.showInterstitial();
    }
}

export function submit(): void {
    vm.submit();
}

export function quit(): void {
    vm.quit();
}

export function showAnswer(): void {
    vm.showAnswer();
}

export function selectOption(args): void {
    vm.selectOption(args);
    optionList.refresh();
}

export function goToEditPage(): void {
    vm.goToEditPage();
}

export function firstOption(args) {
    divert(0);
}
export function secondOption(args: CreateViewEventData) {
    divert(1);
}
export function thirdOption(args: CreateViewEventData) {
    divert(2);
}
export function fourthOption(args: CreateViewEventData) {
    divert(3);
}

export function divert(index: number) {
    vm.selectIndex(index);
    optionList.refresh();
}

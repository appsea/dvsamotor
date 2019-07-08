import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { AndroidActivityBackPressedEventData, AndroidApplication } from "tns-core-modules/application";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { isAndroid, screen } from "tns-core-modules/platform";
import * as ButtonModule from "tns-core-modules/ui/button";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { topmost } from "tns-core-modules/ui/frame";
import { SwipeDirection } from "tns-core-modules/ui/gestures";
import { Label } from "tns-core-modules/ui/label";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { CreateViewEventData } from "tns-core-modules/ui/placeholder";
import { Repeater } from "tns-core-modules/ui/repeater";
import { ScrollView } from "tns-core-modules/ui/scroll-view";
import { TextView } from "tns-core-modules/ui/text-view";
import { AdService } from "../admob/ad.service";
import { ConnectionService } from "../shared/connection.service";
import { CategoryPracticeViewModel } from "./category-practice-view-model";

let vm: CategoryPracticeViewModel;
let optionList: Repeater;
let suggestionButton: ButtonModule.Button;
let numbers: Array<number>;
let _page: any;
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

export function resetBanner() {
    if (banner) {
        banner.height = "0";
    }
    loaded = false;
}

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/
export function onNavigatingTo(args: NavigatedData): void {
    if (args.isBackNavigation) {
        return;
    }
    _page = <Page>args.object;
    numbers = <Array<number>> _page.navigationContext;
    optionList = _page.getViewById("optionList");
    scrollView = _page.getViewById("scrollView");
    banner = _page.getViewById("banner");
    vm = new CategoryPracticeViewModel(numbers);
    _page.bindingContext = vm;
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    previous();
    args.cancel = true;
}

/* ***********************************************************
* According to guidelines, if you have a drawer on your page, you should always
* have a button that opens it. Get a reference to the RadSideDrawer view and
* use the showDrawer() function to open the app drawer section.
*************************************************************/
export function onDrawerButtonTap(args: EventData) {
    resetBanner();
    vm.showDrawer();
}

export function handleSwipe(args) {
    if (args.direction === SwipeDirection.left) {
        next();
    } else if (args.direction === SwipeDirection.right) {
        previous();
    }
}

export function moveToLast() {
    suggestionButton = _page.getViewById("suggestionButton");
    if (suggestionButton) {
        const locationRelativeTo = suggestionButton.getLocationRelativeTo(scrollView);
        if (scrollView && locationRelativeTo) {
            scrollView.scrollToVerticalOffset(locationRelativeTo.y, false);
        }
    }
}

export function goToEditPage(): void {
    vm.goToEditPage();
}

export function previous(): void {
    if (!vm) {
        vm = new CategoryPracticeViewModel([]);
    }
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
    }
}

export function showAnswer(): void {
    vm.showAnswer();
    optionList.refresh();
    moveToLast();
}

export function selectOption(args): void {
    if (!vm.enableSelection()) {
        vm.showAnswer();
        vm.selectOption(args);
        optionList.refresh();
        // moveToLast();
        vm.updatePracticeStats();
    }
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
    if (!vm.enableSelection()) {
        vm.showAnswer();
        vm.selectIndex(index);
        optionList.refresh();
    }
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

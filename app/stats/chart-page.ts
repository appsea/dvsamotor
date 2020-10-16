import { EventData } from "@nativescript/core/data/observable";
import { topmost } from "@nativescript/core/ui/frame";
import * as orientationModule from "nativescript-screen-orientation";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { QuestionViewModel } from "~/question/question-view-model";
import { ChartViewModel } from "./chart-view-model";

export function onPageLoaded(args) {
    const page = args.object;
    orientationModule.setCurrentOrientation("landscape", () => console.log("Changed"));
    page.bindingContext = new ChartViewModel();
}

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function onNavigatedFrom(args) {
    orientationModule.orientationCleanup();
}

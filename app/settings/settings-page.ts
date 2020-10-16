import { AndroidActivityBackPressedEventData, AndroidApplication } from "@nativescript/core/application";
import { EventData, Observable } from "@nativescript/core/data/observable";
import { isAndroid } from "@nativescript/core/platform";
import { topmost } from "@nativescript/core/ui/frame";
import { NavigatedData, Page } from "@nativescript/core/ui/page";
import { CreateViewEventData } from "@nativescript/core/ui/placeholder";
import * as Toast from "nativescript-toast";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { AdService } from "~/admob/ad.service";
import { QuestionViewModel } from "~/question/question-view-model";
import { SelectedPageService } from "~/shared/selected-page-service";
import { SettingsViewModel } from "./settings-view-model";

let vm: SettingsViewModel;

export function onNavigatingTo(args: NavigatedData) {
    /* ***********************************************************
    * The "onNavigatingTo" event handler lets you detect if the user navigated with a back button.
    * Skipping the re-initialization on back navigation means the user will see the
    * page in the same data state that he left it in before navigating.
    *************************************************************/
    const page = <Page>args.object;
    vm = new SettingsViewModel();
    page.bindingContext = vm;
    SelectedPageService.getInstance().updateSelectedPage("settings");
    AdService.getInstance().hideAd();
}

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function save(): void {
    vm.save();
    Toast.makeText("Saved!!!", "long").show();
}

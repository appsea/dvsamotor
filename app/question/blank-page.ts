import { EventData } from "@nativescript/core/data/observable";
import { AdService } from "~/admob/ad.service";
import { QuestionService } from "~/services/question.service";
import * as navigationModule from "../shared/navigation";

export function onPageLoaded(args) {
    AdService.getInstance().delayedPreloadInterstitial();
    if (QuestionService.getInstance().hasQuestions()) {
        navigationModule.route();
    } else {
        QuestionService.getInstance().readAllQuestions().then(() => {
            navigationModule.route();
        });
    }
}

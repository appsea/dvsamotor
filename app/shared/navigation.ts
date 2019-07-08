import * as frameModule from "tns-core-modules/ui/frame";
import { SettingsService } from "~/services/settings.service";
import { IState, ISubTopic } from "./questions.model";

export function route() {
    let path = SettingsService.getInstance().getRoute();
    if (!path || path === "question/practice-page") {
        path = "category/category-page";
    }
    toPage(path);
}

export function	gotoResultPage(state: IState) {
    frameModule.topmost().navigate({
        moduleName: "shared/result/result-page",
        clearHistory: true,
        context: state,
        transition: {
            name: "fade"
        }
    });
}

export function	gotoEditPage(state: IState) {
    frameModule.topmost().navigate({
        moduleName: "question/edit-question-page",
        context: state,
        transition: {
            name: "fade"
        }
    });
}

export function	gotoQuestionMap(state: IState) {
    frameModule.topmost().navigate({
        moduleName: "question/map-page",
        context: state,
        transition: {
            name: "fade"
        }
    });
}

export function	toPage(path: string) {
    frameModule.topmost().navigate({
        moduleName: path,
        transition: {
            name: "fade"
        }
    });
}

export function	gotoDetailsPage(state: IState) {
    frameModule.topmost().navigate({
        moduleName: "shared/details/detailed-result-page",
        context: state,
        transition: {
            name: "fade"
        }
    });
}

export function	goBack() {
    frameModule.topmost().goBack();
}

export function	gotoCategoryPractice(numbers: Array<number>) {
    frameModule.topmost().navigate({
        moduleName: "category/category-practice-page",
        context: numbers,
        transition: {
            name: "fade"
        }
    });
}

export function	gotoSubtopics(topic: string) {
    frameModule.topmost().navigate({
        moduleName: "topics/subtopic-list-page",
        context: topic,
        transition: {
            name: "fade"
        }
    });
}

export function	gotoChapters(subTopic: ISubTopic) {
    frameModule.topmost().navigate({
        moduleName: subTopic.link,
        context: subTopic,
        transition: {
            name: "fade"
        }
    });
}

import { Observable } from "@nativescript/core/data/observable";
import * as dialogs from "@nativescript/core/ui/dialogs";
import { AdService } from "~/admob/ad.service";
import { QuestionViewModel } from "~/question/question-view-model";
import { QuestionService } from "~/services/question.service";
import { IOption, IQuestion, IState } from "~/shared/questions.model";
import * as constantsModule from "../shared/constants";
import * as navigationModule from "../shared/navigation";

export class BookmarkQuestionModel extends Observable {

    get question() {
        if (!this._question) {
            this._question = {options: [], explanation: "", show: false};
        }

        return this._question;
    }

    get options() {
        return this._question.options;
    }

    get questionNumber() {
        return this._questionNumber;
    }

    get flagged() {
        return this._question.flagged;
    }

    get length() {
        return this._questions.length;
    }

    get showAdOnNext(): boolean {
        return !QuestionViewModel._errorLoading && AdService.getInstance().showAd
            && this.questionNumber === this.count
            && this.questionNumber % constantsModule.AD_COUNT === 0
            && this.count % constantsModule.AD_COUNT === 0;
    }

    private count: number;
    private _questions: Array<IQuestion> = [];
    private _question: IQuestion;
    private _questionNumber: number = 0;
    private _mode: string;
    private _message: string;

    constructor(questions: Array<IQuestion>, mode: string, message: string) {
        super();
        this._questions = questions;
        this._mode = mode;
        this._message = message;
        this.count = 0;
    }

    showInterstitial(): any {
        if (AdService.getInstance().showAd && this.count > 1
            && this.questionNumber === this.count
            && (this.questionNumber - 1) % constantsModule.AD_COUNT === 0
            && ((this.count - 1) % constantsModule.AD_COUNT === 0)) {
            AdService.getInstance().showInterstitial();
        }
    }

    showDrawer() {
        QuestionViewModel.showDrawer();
    }

    previous(): void {
        if (this._questionNumber > 1) {
            this._questionNumber = this._questionNumber - 1;
            this._question = this._questions[this._questionNumber - 1];
            this.publish();
        }
    }

    next(): void {
        if (this._questions.length > this._questionNumber) {
            this._question = this._questions[this._questionNumber];
            this._questionNumber = this._questionNumber + 1;
            this.increment();
            this.publish();
            this.showInterstitial();
        } else {
            dialogs.confirm(this._message).then((proceed) => {
                if (proceed || this.length < 1) {
                    navigationModule.toPage("category/category-page");
                }
            });
        }
    }

    flag(): void {
        QuestionService.getInstance().handleFlagQuestion(this._question);
        this.publish();
    }

    publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "question",
            value: this._question
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "options",
            value: this._question.options
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "questionNumber",
            value: this._questionNumber
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "showAdOnNext",
            value: this.showAdOnNext
        });
    }

    showAnswer(): void {
        this.question.options.forEach((option) => option.show = true);
        this.question.show = true;
        this.publish();
    }

    selectIndex(index: number) {
        this.selectedOption(this._question.options[index]);
    }

    selectOption(args: any) {
        const selectedOption: IOption = args.view.bindingContext;
        if (selectedOption.selected) {
            selectedOption.selected = false;
            this.question.skipped = true;
        } else {
            this.question.options.forEach((item, index) => {
                item.selected = item.tag === selectedOption.tag;
            });
            this.question.skipped = false;
        }
        this.publish();
        QuestionService.getInstance().handleWrongQuestions(this.question);
    }

    goToEditPage() {
        const state: IState = {questions: [this.question], questionNumber: 1, totalQuestions: 1, mode: this._mode};
        navigationModule.gotoEditPage(state);
    }

    private selectedOption(selectedOption: IOption) {
        if (selectedOption.selected) {
            selectedOption.selected = false;
            this.question.skipped = true;
        } else {
            this.question.options.forEach((item, index) => {
                item.selected = item.tag === selectedOption.tag;
            });
            this.question.skipped = false;
        }
        this.publish();
        QuestionService.getInstance().handleWrongQuestions(this.question);
    }

    private increment() {
        if (this.questionNumber > this.count) {
            this.count = this.count + 1;
        }
    }
}

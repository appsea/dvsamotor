import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { EventData, Observable } from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { topmost } from "tns-core-modules/ui/frame";
import { AdService } from "~/admob/ad.service";
import { QuestionService } from "~/services/question.service";
import { QuestionUtil } from "~/services/question.util";
import { SettingsService } from "~/services/settings.service";
import { StatsService } from "~/services/stats.service";
import { IOption, IQuestion, IState } from "~/shared/questions.model";
import { QuizUtil } from "~/shared/quiz.util";
import * as constantsModule from "../shared/constants";
import * as navigationModule from "../shared/navigation";

export class QuestionViewModel extends Observable {

    get question() {
        if (!this._question) {
            this._question = {options: [], explanation: "", show: false};
        }

        for (const option of this._question.options) {
            if (option.description) {
                if (option.description.startsWith("A.")) {
                    option.description = option.description.replace("A. ", "").trim();
                } else if (option.description.startsWith("B.")) {
                    option.description = option.description.replace("B. ", "").trim();
                } else if (option.description.startsWith("C.")) {
                    option.description = option.description.replace("C. ", "").trim();
                } else if (option.description.startsWith("D.")) {
                    option.description = option.description.replace("D. ", "").trim();
                }
            }
        }

        return this._question;
    }

    get state() {
        return this._state;
    }

    get allQuestionsAsked() {
        return this._state.questions.length === this._state.totalQuestions;
    }

    get options() {
        return this._question.options;
    }

    get questionNumber() {
        this._questionNumber = this._state.questionNumber;

        return this._questionNumber;
    }

    static _errorLoading = false;

    static showDrawer() {
        const sideDrawer: RadSideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    private _loading = true;

    private count: number = 0;

    private _questionService: QuestionService;
    private _settingsService: SettingsService;

    private _question: IQuestion;
    private _state: IState;
    private _questionNumber: number;

    private _mode: string;

    constructor(mode: string) {
        super();
        this._questionService = QuestionService.getInstance();
        this._settingsService = SettingsService.getInstance();
        this._state = this._settingsService.readCache(mode);
        this._mode = mode;
        this.count = this._state.questionNumber;
        this.showFromState();
    }

    showInterstitial(): any {
        if (AdService.getInstance().showAd && this.count > 1
            && (this.questionNumber - 1) % constantsModule.AD_COUNT === 0
            && (((this.count - 1) % constantsModule.AD_COUNT) === 0)) {
            AdService.getInstance().showInterstitial();
        }
    }

    get showAdOnNext(): boolean {
        return !QuestionViewModel._errorLoading && AdService.getInstance().showAd
            && this.questionNumber % constantsModule.AD_COUNT === 0
            && this.count % constantsModule.AD_COUNT === 0;
    }

    previous(): void {
        this.goPrevious();
    }

    goPrevious() {
        if (this._state.questionNumber > 1) {
            this._state.questionNumber = this._state.questionNumber - 1;
            this._question = this._state.questions[this._state.questionNumber - 1];
            this.saveAndPublish(this._mode, this._state);
        }
    }

    next(): void {
        if ((this._state.questionNumber < this._state.totalQuestions) || this.isPractice()) {
            if (this._state.questions.length > 0 && this._state.questions.length > this._state.questionNumber) {
                this._state.questionNumber = this._state.questionNumber + 1;
                this._question = this._state.questions[this._state.questionNumber - 1];
                this.saveAndPublish(this._mode, this._state);
            } else {
                this.fetchUniqueQuestion();
            }
        }
    }

    flag(): void {
        this._questionService.handleFlagQuestion(this._question);
        this.saveAndPublish(this._mode, this._state);
    }

    alreadyAsked(newQuestion: IQuestion): boolean {
        const result = this.state.questions.find((question) => question.number === newQuestion.number);

        return result != null;
    }

    quit(): void {
        dialogs.confirm("Are you sure you want to quit?").then((proceed) => {
            if (proceed) {
                AdService.getInstance().showInterstitial();
                this.showResult();
            }
        });
    }

    submit(): void {
        dialogs.confirm("Are you sure you want to submit?").then((proceed) => {
            if (proceed) {
                AdService.getInstance().showInterstitial();
                this.showResult();
            }
        });
    }

    isPractice(): boolean {
        return this._mode === constantsModule.PRACTICE;
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
            propertyName: "state",
            value: this._state
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "questionNumber",
            value: this._state.questionNumber
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "showAdOnNext",
            value: this.showAdOnNext
        });
    }

    showResult() {
        this._settingsService.clearCache(this._mode);
        this._state.mode = this._mode;
        navigationModule.gotoResultPage(this._state);
    }

    showIfSelected() {
        if (this._question && this._question.prashna && this.allOptionSelected()) {
            this.showAnswer();
        }
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
        this.saveAndPublish(this._mode, this._state);
        QuestionService.getInstance().handleWrongQuestions(this.question);
    }

    allOptionSelected(): boolean {
        return QuestionUtil.allOptionSelected(this.question);
    }

    saveAndPublish(_mode: string, _state: IState) {
        this._settingsService.saveCache(this._mode, this._state);
        this.publish();
    }

    showMap() {
        this._state.mode = this._mode;
        navigationModule.gotoQuestionMap(this._state);
    }

    goToEditPage() {
        this._state.mode = this._mode;
        navigationModule.gotoEditPage(this._state);
    }

    enableSelection(): boolean {
        return this._question.options.filter((option) => option.selected).length > 0 || this._question.show;
    }

    updatePracticeStats() {
        StatsService.getInstance().updatePracticeStats(this.question);
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
        this.saveAndPublish(this._mode, this._state);
        QuestionService.getInstance().handleWrongQuestions(this.question);
    }

    private increment() {
        this.count = this.count + 1;
    }

    private showFromState(): void {
        if (this._state.questionNumber !== 0
            && (this._state.questions.length >= this._state.questionNumber
                || this._state.questionNumber === this._state.totalQuestions)) {
            this._question = this._state.questions[this._state.questionNumber - 1];
        } else {
            this.next();
        }
    }

    private fetchUniqueQuestion() {
        this._loading = true;
        this._questionService.getNextQuestion().then((que: IQuestion) => {
            if (!this.alreadyAsked(que) && this.hasValidImages(que)) {
                this._state.questionNumber = this._state.questionNumber + 1;
                this._question = que;
                this._state.questions.push(this._question);
                this._loading = false;
                this.increment();
                this.saveAndPublish(this._mode, this._state);
                this.showInterstitial();
            } else {
                if (this._settingsService.hasMoreQuestions(this.state.questions.length)) {
                    this.fetchUniqueQuestion();
                } else {
                    dialogs.confirm("Hurray!! You are done practicing all the questions. Click Ok to restart.")
                        .then((proceed) => {
                            if (proceed) {
                                SettingsService.getInstance().clearCache(this._mode);
                                navigationModule.toPage("category/category-page");
                            }
                        });
                }
            }
        });
    }

    private hasValidImages(que: IQuestion): boolean {
        QuizUtil.correctImagePath(que);
        if (que.prashna.image && !QuizUtil.exist(que.prashna.image)) {
            return false;
        }
        for (const option of que.options) {
            if (option.image && !QuizUtil.exist(option.image)) {
                return false;
            }
        }

        return true;
    }
}

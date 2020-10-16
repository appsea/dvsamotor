import { EventData, Observable, PropertyChangeData } from "@nativescript/core/data/observable";
import { isIOS } from "@nativescript/core/platform";
import { SearchBar } from "@nativescript/core/ui/search-bar";
import { TextField } from "@nativescript/core/ui/text-field";
import { QuestionUtil } from "~/services/question.util";
import { QuizUtil } from "~/shared/quiz.util";
import { ObservableProperty } from "../observable-property-decorator";
import { IQuestion, IState } from "../questions.model";

declare const IQKeyboardManager: any;

export class DetailedResultViewModel extends Observable {

    @ObservableProperty() searchPhrase: string = "";

    private readonly ALL: string = "All";
    private readonly INCORRECT: string = "Incorrect";
    private readonly CORRECT: string = "Correct";
    private readonly SKIPPED: string = "Skipped";

    private _searching: boolean = false;
    private _questions: Array<IQuestion> = [];
    private allQuestions: Array<IQuestion>;
    private _type: string;
    private _message: string;
    private _size: number;
    private state: IState;
    private searchBar: SearchBar;
    private textField: TextField;

    get size() {
        return this._size;
    }

    get message() {
        return this._message;
    }

    get type() {
        return this._type;
    }

    get questions() {
        return this._questions;
    }

    get searching() {
        return this._searching;
    }

    constructor(state: IState) {
        super();
        this.state = state;
        this.allQuestions = state.questions;
        this.on(Observable.propertyChangeEvent, (propertyChangeData: PropertyChangeData) => {
            if (propertyChangeData.propertyName === "searchPhrase") {
                this.refilter();
            }
        });
        this.all();
        if (isIOS) {
            const keyboard = IQKeyboardManager.sharedManager();
            keyboard.shouldResignOnTouchOutside = true;
        }
    }

    all(): void {
        this._type = this.ALL;
        this._message = "found";
        this.allQuestions.forEach((question) => {
            question.skipped = QuestionUtil.isSkipped(question);
        });
        this._questions = this.allQuestions;
        this._size = this._questions.length;
        this.searchPhrase = "";
        this.publish();
    }

    correct(): void {
        this._type = this.CORRECT;
        this._message = "were correct!";
        this._questions = this.allQuestions.filter((question) => QuestionUtil.isCorrect(question));
        this._size = this._questions.length;
        this.searchPhrase = "";
        this.publish();
    }

    incorrect(): void {
        this._questions = this.allQuestions.filter((question) => QuestionUtil.isWrong(question));
        this._type = this.INCORRECT;
        this._message = "were incorrect!";
        this._size = this._questions.length;
        this.searchPhrase = "";
        this.publish();
    }

    skipped(): void {
        this._type = this.SKIPPED;
        this._message = "were skipped!";
        this._questions = this.allQuestions.filter((question) => QuestionUtil.isSkipped(question));
        this._size = this._questions.length;
        this.searchPhrase = "";
        this.publish();
    }

    onSearchSubmit(args): void {
        this.refilter();
        const searchBar = <SearchBar>args.object;
        searchBar.dismissSoftInput();
        QuizUtil.hideKeyboard();
    }

    clear(): void {
        if (this._type === this.CORRECT) {
            this.correct();
        } else if (this._type === this.INCORRECT) {
            this.incorrect();
        } else if (this._type === this.SKIPPED) {
            this.skipped();
        } else {
            this.all();
        }
    }

    refilter() {
        if (this.searchPhrase && this.searchPhrase !== "") {
            const f = this.searchPhrase.trim().toLowerCase();
            this._type = "Searched";
            this._message = "matched!";
            this._questions = this.allQuestions.filter((q) => q.prashna.text.toLowerCase().includes(f)
                || q.options.filter((o) => o.description && o.description.toLowerCase().includes(f)).length > 0
                || q.explanation.toLowerCase().includes(f));
            this.publish();
        }
    }

    textFieldLoaded(args): void {
        this.textField = <TextField>args.object;
        setTimeout(() => {
            {
                this.textField.focus();
                this.textField.dismissSoftInput();
            }
        }, 100);
    }

    searchBarLoaded(args): void {
        this.searchBar = <SearchBar>args.object;
    }

    toggleSearch(): void {
        this._searching = !this._searching;
        if (this._searching) {
            QuizUtil.showKeyboard(this.searchBar);
        }
        this.publish();
    }

    private publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "questions",
            value: this._questions
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "size",
            value: this._size
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "type",
            value: this._type
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "message",
            value: this._message
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "searching",
            value: this._searching
        });
    }
}

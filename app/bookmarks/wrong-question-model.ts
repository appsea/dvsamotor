import { EventData, Observable } from "@nativescript/core/data/observable";
import { PersistenceService } from "~/services/persistence.service";
import { QuestionService } from "~/services/question.service";
import * as constantsModule from "../shared/constants";
import { BookmarkQuestionModel } from "./bookmark-question-model";

export class WrongQuestionModel extends BookmarkQuestionModel {

    private static message: string = "Hurray!! No more wrong questions. Click Ok to go to practice.";

    constructor() {
        super(PersistenceService.getInstance().readWrongQuestions(), "wrong", WrongQuestionModel.message);
        super.next();
    }

    next(): void {
        super.next();
    }

    flag(): void {
        super.flag();
        QuestionService.getInstance().update(constantsModule.WRONG_QUESTION, this.question);
    }
}

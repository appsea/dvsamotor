import { EventData, Observable } from "@nativescript/core/data/observable";
import { PersistenceService } from "~/services/persistence.service";
import { BookmarkQuestionModel } from "./bookmark-question-model";

export class FlagQuestionModel extends BookmarkQuestionModel {
    private static message: string = "No more flagged questions. Click Ok to go to practice.";

    constructor() {
        super(PersistenceService.getInstance().readFlaggedQuestions(), "flag", FlagQuestionModel.message);
        super.next();
    }

    next(): void {
        super.next();
    }
}

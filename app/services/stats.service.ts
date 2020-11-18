/**
 * Created by rakesh on 15-Nov-2017.
 */
import * as appSettings from "@nativescript/core/application-settings";
import { CategoryService } from "~/services/category.service";
import { PersistenceService } from "~/services/persistence.service";
import { QuestionUtil } from "~/services/question.util";
import { PRACTICE_STATS } from "~/shared/constants";
import { IPracticeStats, IQuestion } from "~/shared/questions.model";

export class StatsService {

    static getInstance(): StatsService {
        return StatsService._instance;
    }

    private static _instance: StatsService = new StatsService();

    readPracticeStats(): IPracticeStats {
        return appSettings.hasKey(PRACTICE_STATS) ? JSON.parse(appSettings.getString(PRACTICE_STATS))
            : {attempted: new Array<number>(), correct: new Array<number>()};
    }

    updatePracticeStats(question: IQuestion) {
        const practiceStats: IPracticeStats = PersistenceService.getInstance().readPracticeStats();

        const questionNumber: number = +question.number;
        if (practiceStats.attempted.indexOf(questionNumber) < 0) {
            practiceStats.attempted.push(questionNumber);
        }
        if (QuestionUtil.isCorrect(question)) {
            practiceStats.correct.push(+question.number);
        } else {
            const index = practiceStats.correct.indexOf(questionNumber, 0);
            if (index > -1) {
                practiceStats.correct.splice(index, 1);
            }
        }
        PersistenceService.getInstance().savePracticeStats(practiceStats);
        CategoryService.getInstance().attemptQuestion(question);
    }

}

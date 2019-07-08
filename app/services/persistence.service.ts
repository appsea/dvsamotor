/**
 * Created by rakesh on 15-Nov-2017.
 */
import * as appSettings from "tns-core-modules/application-settings";
import { Observable } from "tns-core-modules/data/observable";
import { PRACTICE_STATS, PREMIUM, RESULT } from "~/shared/constants";
import { ICategory, IPracticeStats, IQuestion, IResult, ITopic } from "~/shared/questions.model";
import * as constantsModule from "../shared/constants";

export class PersistenceService {

    static getInstance(): PersistenceService {
        return PersistenceService._instance;
    }

    private static _instance: PersistenceService = new PersistenceService();

    readWrongQuestions(): Array<IQuestion> {
        return this.readQuestions(constantsModule.WRONG_QUESTION);
    }

    readFlaggedQuestions(): Array<IQuestion> {
        return this.readQuestions(constantsModule.FLAG_QUESTION);
    }

    addQuestions(key: string, questions: Array<IQuestion>) {
        appSettings.setString(key, JSON.stringify(questions));
    }

    resetAllStats(): any {
        this.resetPracticeStats();
        this.resetMockExamStats();
    }

    resetPracticeStats() {
        appSettings.remove(PRACTICE_STATS);
    }

    resetMockExamStats(): void {
        appSettings.remove(RESULT);
    }

    readPracticeStats(): IPracticeStats {
        return appSettings.hasKey(PRACTICE_STATS) ? JSON.parse(appSettings.getString(PRACTICE_STATS))
            : {attempted: new Array<number>(), correct: new Array<number>()};
    }

    getResult(): Array<IResult> {
        let items: Array<IResult> = [];
        if (appSettings.hasKey(RESULT)) {
            items = JSON.parse(appSettings.getString(RESULT));
        }

        return items;
    }

    saveResult(result: IResult): void {
        if (appSettings.hasKey(RESULT)) {
            const items: Array<IResult> = JSON.parse(appSettings.getString(RESULT));
            items.push(result);
            appSettings.setString(RESULT, JSON.stringify(items));
        } else {
            const items: Array<IResult> = [];
            items.push(result);
            appSettings.setString(RESULT, JSON.stringify(items));
        }
    }

    resetExamStats(): void {
        appSettings.remove(RESULT);
    }

    saveCategories(categories: Array<ICategory>) {
        appSettings.setString(constantsModule.CATEGORIES, JSON.stringify(categories));
    }

    readCategories(): Array<ICategory> {
        let categories: Array<ICategory>;
        try {
            const key = constantsModule.CATEGORIES;
            categories = appSettings.hasKey(key) ? JSON.parse(appSettings.getString(key)) : [];
        } catch (error) {
            console.error("failed to load categories");
            categories = [];
        }

        return categories;
    }

    clearCategories() {
        appSettings.remove(constantsModule.CATEGORIES);
    }

    hasCategories(): boolean {
        return appSettings.hasKey(constantsModule.CATEGORIES);
    }

    hasTopics(): boolean {
        return appSettings.hasKey(constantsModule.TOPICS);
    }

    saveTopics(topics: Array<ITopic>) {
        appSettings.setString(constantsModule.TOPICS, JSON.stringify(topics));
    }

    readTopics(): Array<ITopic> {
        let topics: Array<ITopic>;
        try {
            const key = constantsModule.TOPICS;
            topics = appSettings.hasKey(key) ? JSON.parse(appSettings.getString(key)) : [];
        } catch (error) {
            topics = [];
        }

        return topics;
    }

    isPremium(): boolean {
        return appSettings.hasKey(PREMIUM);
    }

    savePracticeStats(practiceStats: IPracticeStats) {
        appSettings.setString(PRACTICE_STATS, JSON.stringify(practiceStats));
    }

    private readQuestions(key: string): Array<IQuestion> {
        let questions: Array<IQuestion>;
        try {
            questions = this.hasBookmarkedQuestions(key) ? JSON.parse(appSettings.getString(key)) : [];
        } catch (error) {
            questions = [];
        }

        return questions;
    }

    private hasBookmarkedQuestions(key: string): boolean {
        return appSettings.hasKey(key);
    }

}

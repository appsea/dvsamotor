import { ICategory, IQuestion } from "~/shared/questions.model";
import { HttpService } from "./http.service";
import { PersistenceService } from "./persistence.service";
import { QuestionUtil } from "./question.util";

export class CategoryService {

    static getInstance(): CategoryService {
        return CategoryService._instance;
    }

    private static _instance: CategoryService = new CategoryService();

    private _categories: Array<ICategory> = [];

    private constructor() {
        this._categories = this.getCategories();
    }

    getSize(search: string): number {
        return this.getCategory(search).questionNumbers.length;
    }

    getCategory(search: string): ICategory {
        return this._categories.filter((category) => category.name === search)[0];
    }

    attemptQuestion(question: IQuestion) {
        const category = this._categories.filter((c) => c.name === question.category)[0];
        if (category.name === question.category) {
            if (!category.wronglyAnswered) {
                category.wronglyAnswered = [];
            }
            if (!category.attempted) {
                category.attempted = [];
            }
            console.log(category.questionNumbers.indexOf(+question.number));
            if (category.questionNumbers.indexOf(+question.number) > -1) {
                if (category.attempted.indexOf(+question.number) === -1) {
                    category.attempted.push(+question.number);
                }
                if (QuestionUtil.isWrong(question)) {
                    if (category.wronglyAnswered.indexOf(+question.number) < 0) {
                        category.wronglyAnswered.push(+question.number);
                    }
                } else {
                    category.wronglyAnswered = category.wronglyAnswered
                        .filter((value) => value !== +question.number);
                }
                category.percentage = Math.floor((1 - category.wronglyAnswered.length / category.attempted.length)
                    * 100);
                category.percentage = QuestionUtil.validatePercentage(category.percentage);
            }
            PersistenceService.getInstance().saveCategories(this._categories);
        }
    }

    getCategories(): Array<ICategory> {
        const categories: Array<ICategory> = PersistenceService.getInstance().readCategories();
        /*categories.forEach((c) => console.log("c service", c.icon));
        categories.forEach((c) => {
            c.icon = String.fromCharCode(+c.icon);
        });
        categories.forEach((c) => console.log("c service After", c.icon));*/

        return categories;
    }

    readCategoriesFromFirebase(): Promise<void> {
        return HttpService.getInstance().getCategories<Array<ICategory>>().then((categories: Array<ICategory>) => {
            for (const category of categories) {
                if (!category.wronglyAnswered) {
                    category.wronglyAnswered = [];
                }
                if (!category.attempted) {
                    category.attempted = [];
                }
            }
            this.mergeWithSaved(categories);
        });
    }

    mergeWithSaved(newCategories: Array<ICategory>) { // Our mergeWithSaved function
        const existingCategories: Array<ICategory> = PersistenceService.getInstance().readCategories();
        const merged: Array<ICategory> = [];
        for (const category of newCategories) {      // for every property in obj1
            category.icon = String.fromCharCode(+category.icon);
            if (this.contains(category, existingCategories)) {
                const savedCategory = this.getCategory(category.name);
                savedCategory.questionNumbers = category.questionNumbers;
                savedCategory.percentage = this.calculatePercentage(savedCategory);
                merged.push(savedCategory);
            } else {
                category.percentage = this.calculatePercentage(category);
                merged.push(category);
            }
        }
        this._categories = merged;
        PersistenceService.getInstance().saveCategories(merged);
    }

    contains(search: ICategory, categories: Array<ICategory>): boolean {
        return categories.filter((c) => c.name === search.name).length > 0;
    }

    private calculatePercentage(category: ICategory): number {
        return category.wronglyAnswered.length === 0 ? 0
            : Math.floor(category.wronglyAnswered.length * 100 / category.attempted.length);
    }
}

import { IQuestion } from "../shared/questions.model";

export class QuestionUtil {

    static allOptionSelected(question: IQuestion): boolean {
        return QuestionUtil.countCorrectOptions(question) === QuestionUtil.countSelectedOption(question);
    }

    static isCorrect(question: IQuestion) {
        let isCorrect = false;
        for (const option of question.options) {
            if (option.selected && option.correct) {
                isCorrect = true;
                break;
            }
        }

        return isCorrect;
    }

    static countCorrectOptions(question: IQuestion) {
        let count = 0;
        for (const option of question.options) {
            if (option.correct) {
                count = count + 1;
            }
        }

        return count;
    }

    static isSkipped(question: IQuestion) {
        let isSkipped = true;
        for (const option of question.options) {
            if (option.selected) {
                isSkipped = false;
                break;
            }
        }

        return isSkipped;
    }

    static isWrong(question: IQuestion) {
        return !this.isSkipped(question) && !this.isCorrect(question);
    }

    static isOptionUpdated(question: IQuestion) {
        return !this.isCorrect(question);
    }

    static countSelectedOption(question: IQuestion): number {
        let count = 0;
        for (const option of question.options) {
            if (option.selected) {
                count = count + 1;
            }
        }

        return count;
    }

    static validatePercentage(percentage: number): number {
        return percentage < 100 ? percentage : 100;
    }

    private constructor() {}
}

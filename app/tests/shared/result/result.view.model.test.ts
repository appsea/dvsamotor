import { IOption, IQuestion, IResult, IState } from "~/shared/questions.model";
import { ResultViewModel } from "~/shared/result/result-view-model";
import * as TKUnit from "../../TKUnit";

describe("Result View Model calculateResult", () => {
    it("Calculate Result works correctly", () => {
        const questions: Array<IQuestion> = createQuestions();
        const state: IState = {questionNumber: 0, questions, totalQuestions: questions.length};
        const vm: ResultViewModel  = new ResultViewModel(state);
        const result: IResult = vm.resultInstance;
        TKUnit.assert(result.total === 5, "Expected Total Questions 5 but were "  + result.total);
        TKUnit.assert(result.correct === 2, "Expected Correct 2 but was "  + result.correct);
        TKUnit.assert(result.wrong === 1, "Expected Wrong 1 but was "  + result.wrong);
        TKUnit.assert(result.skipped === 2, "Expected skipped 2 but was "  + result.skipped);
        TKUnit.assert(!result.pass, "Expected failed but was passed");
        TKUnit.assert(result.percentage === "40%", "Percentage expected was 40 but was "  + result.percentage);
    });
});

function createQuestions() {
    const questions: Array<IQuestion> = [];
    for (let i = 0; i < 5; i++) {
        const q: IQuestion = createQuestion();
        if (i % 2 === 0) {
            q.options[i % 4].selected = true;
        }
        questions.push(q);
    }
    console.log("questions", questions);

    return questions;
}

function createQuestion() {

    const iq: IQuestion = { description: "test" } as any as IQuestion;
    const option1: IOption = { tag: "A", description: "A. test",  correct: true} as any as IOption;
    const option2: IOption = { tag: "B", description: "B. test",  correct: false} as any as IOption;
    const option3: IOption = { tag: "C", description: "C. test",  correct: false} as any as IOption;
    const option4: IOption = { tag: "D", description: "D. test",  correct: false} as any as IOption;
    const options: Array<IOption> = [option1, option2, option3, option4] ;
    iq.options = options;

    return iq;
}

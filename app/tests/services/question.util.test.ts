import { QuestionUtil } from "~/services/question.util";
import * as TKUnit from "../TKUnit";

describe("Question Util Percentage", () => {
    it("Expected percentage when number greater than 100", () => {
        const actualCorrectAnswers = QuestionUtil.validatePercentage(110);
        TKUnit.assert(actualCorrectAnswers === 100, "Expected percentage as 100 but was "  + actualCorrectAnswers);
    });
});

describe("Question Util Percentage 90", () => {
    it("Expected percentage when number greater than 90", () => {
        const actualCorrectAnswers = QuestionUtil.validatePercentage(90);
        TKUnit.assert(actualCorrectAnswers === 90, "Expected percentage as 90 but was "  + actualCorrectAnswers);
    });
});

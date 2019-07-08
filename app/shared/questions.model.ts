export interface IQuestion {
    number?: string;
    prashna?: IPrashna;
    explanation?: string;
    category?: string;
    options?: Array<IOption>;
    skipped?: boolean;
    flagged?: boolean;
    show?: boolean;
    suggestionHint?: string;
}

export interface IPrashna {
    text?: string;
    image?: string;
}

export interface IOption {
    tag: string;
    description: string;
    correct: boolean;
    image?: string;
    selected?: boolean;
    show?: boolean;
}

export interface ISetting {
    totalQuestionsQuick: number;
    totalQuestionsMock: number;
    totalTime: number;
}

export interface IState {
    questionWrapper?: IQuestion;
    questions: Array<IQuestion>;
    questionNumber: number;
    totalQuestions: number;
    mode?: string;
    time?: number;
}

export interface IMap {
    value: number;
    status: string;
}

export interface IResult {
    itemType?: string;
    date?: string;
    correct: number;
    wrong?: number;
    skipped?: number;
    total: number;
    totalExams: number;
    percentage: string;
    pass: boolean;
}

export interface ICategory {
    icon?: any;
    name: string;
    questionNumbers: Array<number>;
    wronglyAnswered?: Array<number>;
    attempted?: Array<number>;
    selected?: boolean;
    percentage?: number;
}

export interface ITopicStatus {
    icon?: string;
    name?: string;
    attempted?: number;
    total?: number;
    percentage?: string;
}

export interface ITopic {
    icon?: string;
    name?: string;
    subTopics: Array<ISubTopic>;
}

export interface ISubTopic {
    name?: string;
    link: string;
    complete?: boolean;
}

export interface IPracticeStats {
    attempted: Array<number>;
    correct: Array<number>;
}

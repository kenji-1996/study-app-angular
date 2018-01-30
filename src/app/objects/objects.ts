/**
 * Created by Kenji on 1/4/2018.
 */

export class submittedTest {
    _id: String;
    user: String;
    test: String;
    submittedQuestions: submittedQuestion[];
    dateSubmitted: Date;
    mark: String;
    constructor() {
        this.submittedQuestions = [];
    }
}

export class submittedQuestion {
    _id: String;
    question: String;
    type: String;
    keywordsAnswer: [String];
    choicesAnswer: [String];
    arrangement: [String];
    shortAnswer: String;
    feedback: String;
}

export class allocatedTest {
    _id: String;
    //testId: String,//Reference test for result settings
    test: newTest;
    user: String;//Only 1 result per test per user, can have x amount of submitted tests depending on attempts
    allocatedDate: Date;
    submittedTests: [String];
    finalMark: String;//String or number?
    feedback: String;
    showMarker: Boolean;//Should the user see who marked them
    marker: String; //Only shown if above is correct
    started: boolean;
}

export class newTest {
    _id: String;
    title: String;
    questions: newQuestion[];
    category: String;
    authors: [String];
    expire: boolean;//Should the test expire
    fullPage: boolean;//If the layout should be 1 question at a time or
    expireDate: Date;//If expire, default at 1 week later
    handMarked: boolean;//Results not calculated internally but rather by the markers
    private: boolean;//If public, will be available to find on test browser
    attemptsAllowed: Number;//How many attempts allowed
    userEditable: boolean;
    shareable: boolean;
    timerEnabled: boolean;
    timer: number;//Number of minutes a test can be live after started, question specific timer in question schema
    hintAllowed: boolean;
    showMarks: boolean;//If it is marked, can we show?
    markDate: Date;
    constructor(_title,_category,_questions,_authors) {
        this.title = _title;
        this.category = _category;
        this.questions = _questions;
        this.authors = _authors;
    }
    //sponsoredFeedback: boolean;//In future, markers can get rewarded for providing info/feedback
    //markDate: Date; //If author wants user to have to wait till all users have done the test for it to be auto marked.
    //marked: boolean;//Has the server/author marked this?
    //currentAttempts: { type: Number, default:0 },//Should be moved
}

//New reformatted question and answer models
export class newQuestion {
    _id: String;
    hint: String;
    resources: [String];//References for attempting this question - Unused
    images: [String];//Images relating to this question - Unused
    //keywords,choices,arrangement,shortAnswer
    type: String;
    //Answer/Question variables, only one will be filled out depending on 'type' - Not user submitted (When they complete tests, creates 'submittedQuestion' + submittedTest)
    question: String;
    keywordsAnswer: [String];//Actual keywords in answer
    //keywordsQuestion: String;//Question for keyword answer

    choicesAnswer: [String];//Actual choices (contains only the choices that are correct)
    choicesAll: [String];//Array of choices for one question (recommended 4, minimum of 2)
    //choicesQuestion: String;

    arrangement: [String];//The actual arrangment of the items in normal order
    //arrangementQuestion: [String];//The 4-x provided arrangment in random order

    shortAnswer: String;//Short answer question, THIS SHOULD ONLY BE DONE IN CASE OF 'handMarked' TESTS!

    enableTimer: boolean;
    timer: Number;
    //shortAnswerQuestion: String;//Short answer question
    //Allow author HTML (ensure XSS security though!!!) - Not yet implimented
    constructor() {
        this.keywordsAnswer = <[String]>[];
        this.choicesAnswer = <[String]>[];
        this.choicesAll = <[String]>[];
        this.arrangement = <[String]>[];
        this.shortAnswer = '';
        this.enableTimer = false;//false on default
    }
}

export class Test {
    _id: String;
    title: String;
    questions: [String];
    author: String;
}
export class TestToQuestion {
    _id: String;
    title: String;
    questions: Question[];
    author: String;
    constructor(__id: string,_title:string, _questions: Question[],_author:string) {
        this._id = __id;
        this.title = _title;
        this.questions = _questions;
        this.author = _author;
    }
}
export class Question {
    _id: String;
    question: String;
    answer: String;
    category: String;
    hint: String;
    keywords: String[];
    constructor(__id:string,_question:string,_answer:string,_category:string,_hint:string,_keywords:string[]) {
        this._id = __id;
        this.question = _question;
        this.answer = _answer;
        this.category = _category;
        this.hint = _hint;
        this.keywords = _keywords;
    }
}

export class Result {
    _id: String;
    question: String;
    answer: String;
    category: String;
    givenAnswer: String;
    timeLeft: number;
    markPercent: number;
    markCount: number;
    constructor(__id:string,_question:string,_answer:string,_category:string,_givenAnswer:string,_timeLeft:number,_markPercent:number,_markCount:number) {
        this._id = __id;
        this.question = _question;
        this.answer = _answer;
        this.category = _category;
        this.givenAnswer = _givenAnswer;
        this.timeLeft = _timeLeft;
        this.markPercent = _markPercent;
        this.markCount = _markCount;
    }
}

export class NavList {
    categoryName: String;
    icon: String;
    dropDown: boolean;
    subCategory: NavListItem[];
    constructor(_categoryName:string,_icon:string,_dropDown:boolean,_subCategory:NavListItem[]) {
        this.categoryName = _categoryName;
        this.icon = _icon;
        this.dropDown = _dropDown;
        this.subCategory = _subCategory;
    }
}

export class NavListItem {
    subCategoryName: String;
    subCategoryLink: String;
    visable: boolean;
}

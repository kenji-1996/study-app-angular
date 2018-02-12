/**
 * Created by Kenji on 1/4/2018.
 */
export class user {
    _id: string;
    unique_id: string;
    permissions: number;
    userGroups: [string];
    organizations: [string];
    dateCreated: Date;
    lastLogin: Date;
    email: string;
    name: string;
    picture: string;
    source: string;
    results: allocatedTest[];
}

export class submittedTest {
    _id: string;
    user: string;
    test: string;
    submittedQuestions: submittedQuestion[];
    dateSubmitted: Date;
    obtainedMark: Number;
    marksAvailable: Number;
    constructor() {
        this.submittedQuestions = [];
    }
}

export class submittedQuestion {
    _id: string;
    question: string;
    type: string;
    keywordsAnswer: [string];
    choicesAnswer: [string];
    arrangement: [string];
    shortAnswer: string;
    feedback: string;
    mark: number;
}

export class allocatedTest {
    _id: string;
    //testId: string,//Reference test for result settings
    test: newTest;
    user: string;//Only 1 result per test per user, can have x amount of submitted tests depending on attempts
    allocatedDate: Date;
    submittedTests: [any];
    finalMark: Number;//string or number?
    marksAvailable: Number;
    feedback: string;
    showMarker: Boolean;//Should the user see who marked them
    marker: string; //Only shown if above is correct
    started: boolean;
    //client only options
    selected: boolean;
}

export class newTest {
    _id: string;
    title: string;
    questions: newQuestion[];
    category: string;
    authors: [string];
    expire: boolean;//Should the test expire
    fullPage: boolean;//If the layout should be 1 question at a time or
    expireDate: Date;//If expire, default at 1 week later
    handMarked: boolean;//Results not calculated internally but rather by the markers
    privateTest: boolean;//If public, will be available to find on test browser
    attemptsAllowed: number;//How many attempts allowed
    userEditable: boolean;
    shareable: boolean;
    canSelfRemove: boolean;
    timerEnabled: boolean;
    timer: number;//number of minutes a test can be live after started, question specific timer in question schema
    hintAllowed: boolean;
    showMarks: boolean;//If it is marked, can we show?
    showMarker: boolean;
    markDate: Date;
    locked: boolean;
    constructor(_title,_category,_questions,_authors) {
        this.title = _title;
        this.category = _category;
        this.questions = _questions;
        this.authors = _authors;
    }
    //sponsoredFeedback: boolean;//In future, markers can get rewarded for providing info/feedback
    //markDate: Date; //If author wants user to have to wait till all users have done the test for it to be auto marked.
    //marked: boolean;//Has the server/author marked this?
    //currentAttempts: { type: number, default:0 },//Should be moved
}

//New reformatted question and answer models
export class newQuestion {
    _id: string;
    hint: string;
    resources: [string];//References for attempting this question - Unused
    images: [string];//Images relating to this question - Unused
    //keywords,choices,arrangement,shortAnswer
    type: string;
    possibleMarks: Number;
    //Answer/Question variables, only one will be filled out depending on 'type' - Not user submitted (When they complete tests, creates 'submittedQuestion' + submittedTest)
    question: string;
    feedback: string;
    mark: string;
    possibleAllocatedMarks: string;
    keywordsAnswer: [string];//Actual keywords in answer
    //keywordsQuestion: string;//Question for keyword answer

    choicesAnswer: [string];//Actual choices (contains only the choices that are correct)
    choicesAll: [string];//Array of choices for one question (recommended 4, minimum of 2)
    //choicesQuestion: string;

    arrangement: [string];//The actual arrangment of the items in normal order
    //arrangementQuestion: [string];//The 4-x provided arrangment in random order

    shortAnswer: string;//Short answer question, THIS SHOULD ONLY BE DONE IN CASE OF 'handMarked' TESTS!

    enableTimer: boolean;
    timer: number;
    //shortAnswerQuestion: string;//Short answer question
    //Allow author HTML (ensure XSS security though!!!) - Not yet implimented
    constructor() {
        this.keywordsAnswer = <[string]>[];
        this.choicesAnswer = <[string]>[];
        this.choicesAll = <[string]>[];
        this.arrangement = <[string]>[];
        this.shortAnswer = '';
        this.enableTimer = false;//false on default
    }
}

export class NavList {
    categoryName: string;
    icon: string;
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
    subCategoryName: string;
    subCategoryLink: string;
    visable: boolean;
}

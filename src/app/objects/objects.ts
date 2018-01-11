/**
 * Created by Kenji on 1/4/2018.
 */
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
    constructor(__id:string,_question:string,_answer:string,_category:string) {
        this._id = __id;
        this.question = _question;
        this.answer = _answer;
        this.category = _category;
    }
}

export class testQuestion {
    _id: String;
    question: String;
    answer: String;
    category: String;
    givenAnswer: String;
    timeLeft: number;
    mark: number;
    constructor(__id:string,_question:string,_answer:string,_category:string,_givenAnswer:string,_timeLeft:number,_mark:number) {
        this._id = __id;
        this.question = _question;
        this.answer = _answer;
        this.category = _category;
        this.givenAnswer = _givenAnswer;
        this.timeLeft = _timeLeft;
        this.mark = _mark;
    }
}

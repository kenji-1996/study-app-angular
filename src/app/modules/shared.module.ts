import { NgModule } from '@angular/core';
import {EditTestComponent} from "../components/edit-test/edit-test.component";
import {ImportsModule} from "./imports.module";
import {KeywordQuestionComponent} from "../components/keyword-question/keyword-question.component";
import {ArrangementComponent} from "../components/arrangement-question/arrangement-question.component";
import {ShortanswerQuestionComponent} from "../components/shortanswer-question/shortanswer-question.component";
import {ChoiceQuestionComponent} from "../components/choice-question/choice-question.component";
import {QuestionComponent} from "../components/question/question.component";

@NgModule({
    imports: [
        ImportsModule,
    ],
    declarations: [
        EditTestComponent,
        KeywordQuestionComponent,
        ArrangementComponent,
        ShortanswerQuestionComponent,
        ChoiceQuestionComponent,
        QuestionComponent,
    ],
    providers: [
    ],

    exports: [
        EditTestComponent,
        KeywordQuestionComponent,
        ArrangementComponent,
        ShortanswerQuestionComponent,
        ChoiceQuestionComponent,
        QuestionComponent,
    ]
})
export class SharedModule {}

/**
 * Created by Kenji on 12/31/2017.
 *
 * Question schema, This is the end of the 'many' database where,
 * Questions -> Tests -> User
 * Aka a user can hold many tests made up of many questions
 *
 * Types: keyword,multichoice,arrange,shortanswer
 *
 */
let mongoose     = require('mongoose');
let Schema = mongoose.Schema;

let submittedQuestionsSchema  = new Schema({
    //Submitted questions unique ID
    _id: Schema.Types.ObjectId,
    //questionId related to this ID
    testId: { type: String, required: true },
    questionId: {type:String, required: true },

    //Answer variables (if type is 'keywords', only these variables will be checked and validated) (subject to change)
    keywordsAnswer: [String],//User submitted answer
    choicesAnswer: [String],
    arrangementAnswer: [String],
    shortAnswer: String,

    //Temp
    feedback: String,
});

module.exports = mongoose.model('submittedquestions', submittedQuestionsSchema);
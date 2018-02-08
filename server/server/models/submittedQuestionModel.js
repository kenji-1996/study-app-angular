/**
 * Created by Kenji on 12/31/2017.
 *
 * Question schema, This is the end of the 'many' database where,
 * Questions -> Tests -> User
 * Aka a user can hold many tests made up of many questions
 *
 * Types: keyword,multichoice,arrange,shortanswer
 *
 * Fully populated by user, references original ID to get answers to calculate a result
 *
 */
let mongoose     = require('mongoose');
let Schema = mongoose.Schema;
let mongoosePaginate = require('mongoose-paginate');

let submittedQuestionsSchema  = new Schema({
    //Submitted questions unique ID
    _id: Schema.Types.ObjectId,
    //submittedTestId: { type: String, required: true },
    question: { type: Schema.Types.ObjectId, ref: 'questions' },
    type: String,

    //Answer variables (if type is 'keywords', only these variables will be checked and validated) (subject to change)
    keywordsAnswer: [String],//User submitted answer
    choicesAnswer: [String],
    arrangement: [String],
    shortAnswer: String,

    //Temp
    feedback: String,
});

module.exports = mongoose.model('submittedquestion', submittedQuestionsSchema);
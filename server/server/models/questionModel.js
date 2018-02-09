/**
 * Created by Kenji on 12/31/2017.
 *
 * Question schema, This is the end of the 'many' database where,
 * Questions -> Tests -> User
 * Aka a user can hold many tests made up of many questions
 *
 * Types: keyword,multichoice,arrange,shortanswer
 *
 * No 'parent/test' id provided, so question can be shared
 */
let mongoose     = require('mongoose');
let Schema = mongoose.Schema;
let mongoosePaginate = require('mongoose-paginate');

let questionSchema  = new Schema({
    //Question general information
    _id: Schema.Types.ObjectId,
    hint: String,
    date: { type: Date, default: Date.now },

    resources: [String],//References for attempting this question - Unused
    images: [String],//Images relating to this question - Unused

    //keywords,choices,arrangement,shortAnswer
    type: { type:String, required: true, default: 'keywords'},
    possibleMarks: { type: Number, default: 0 },

    question: { type:String, required:true },
    //Answer/Question variables, only one will be filled out depending on 'type' - Not user submitted (When they complete tests, creates 'submittedQuestion' + submittedTest)
    keywordsAnswer: [String],//Actual keywords in answer
    //keywordsQuestion: String,//Question for keyword answer

    choicesAnswer: [String],//Actual choices (contains only the choices that are correct)
    choicesAll: [String],//Array of choices for one question (recommended 4, minimum of 2)
    //choicesQuestion: String,

    arrangement: [String],//The arrangment in random order
    //arrangementOriginal: [String],//The 4-x provided arrangment actual order

    shortAnswer: String,//Short answer question, THIS SHOULD ONLY BE DONE IN CASE OF 'handMarked' TESTS!

    //Settings
    bonus: { type: Boolean, default: false },//If bonus, not counted on total answers mark, but will increase answer (implying user can get over 100% if bonus questions exist)
});
questionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('questions', questionSchema);
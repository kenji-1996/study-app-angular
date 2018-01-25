/**
 * Created by Kenji on 12/31/2017.
 * Submitted test, when a user completes a test the information is saved like so
 * Then the user can get feedback and a mark,
 *
 * userId and testId are found in parent resultSchema
 */
let mongoose     = require('mongoose');
let Schema = mongoose.Schema;

let submittedTestSchema  = new Schema({
    //Unique testSubmitted ID
    _id: Schema.Types.ObjectId,
    userId: {type:String, required: true},//Who submitted it, also held
    //submittedQuestions ID array
    submittedQuestions: [String],
    //Date submitted
    dateSubmitted: { type: Date, default: Date.now },
    //Result-related, mark saved if not manually marked by human
    mark: String,
    /**
     * Commented out for now, usage found in parent 'resultSchema'
     */
    //Feedback only shown if it contains something, can only be submitted by a marker/author
    //feedback: String,
    //target test ID (must be valid) - Get test settings from here
    //testId: {type:String, required: true}, //Points to parent because there can only be one test it references, One(Test) -> Many[submittedTest]
    //Who submitted it

});

/*submittedTestSchema.virtual('parentTest').get(function () {
    return this.name.first + ' ' + this.name.last;
});

submittedTestSchema.methods.findSimilarTypes = function(cb) {
    return this.constructor.find({ type: this.type }, cb);
};*/

module.exports = mongoose.model('submittedtest', submittedTestSchema);
/**
 * Created by Kenji on 12/31/2017.
 * Submitted test, when a user completes a test the information is saved like so
 * Then the user can get feedback and a mark,
 *
 * userId and testId are found in parent resultSchema
 */
let mongoose     = require('mongoose');
let Schema = mongoose.Schema;
let submittedQuestionModel = require('../models/submittedQuestionModel');
let mongoosePaginate = require('mongoose-paginate');

let submittedTestSchema  = new Schema({
    //Unique testSubmitted ID
    _id: Schema.Types.ObjectId,
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    test: { type: Schema.Types.ObjectId, ref: 'tests' },
    //submittedQuestions ID array
    submittedQuestions: [{type: Schema.Types.ObjectId, ref: 'submittedquestion'}],
    //Date submitted
    dateSubmitted: { type: Date, default: Date.now },
    //Result-related, mark saved if not manually marked by human
    obtainedMark: {type:Number, default: 0 }

    //Get these from test
    //marksAvailable: Number,
    //gradedMarksAvailable: Number,
    /**
     * Commented out for now, usage found in parent 'resultSchema'
     */
    //Feedback only shown if it contains something, can only be submitted by a marker/author
    //feedback: String,
    //target test ID (must be valid) - Get test settings from here
    //testId: {type:String, required: true}, //Points to parent because there can only be one test it references, One(Test) -> Many[submittedTest]
    //Who submitted it
});

submittedTestSchema.pre('remove', function(next) {
    submittedQuestionModel.remove({_id: { $in: this.submittedQuestions}}).exec();
    next();
});
submittedTestSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('submittedtest', submittedTestSchema);
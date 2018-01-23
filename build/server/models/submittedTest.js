/**
 * Created by Kenji on 12/31/2017.
 * Submitted test, when a user completes a test the information is saved like so
 * Then the user can get feedback and a mark,
 */
let mongoose     = require('mongoose');
let Schema = mongoose.Schema;
let settings = require('../misc/settings');

let submittedTestSchema  = new Schema({
    //Unique testSubmitted ID
    _id: Schema.Types.ObjectId,
    //target test ID (must be valid) - Get test settings from here
    //testId: {type:String, required: true}, ------ Might need later, but resultSchema holds testId
    //Who submitted it
    userId: {type:String, required: true},
    //submittedQuestions ID array
    submittedQuestions: [String],
    //Date submitted
    dateSubmitted: { type: Date, default: Date.now },
    //Result-related, mark saved if not manually marked by human
    mark: Number,
    //Feedback only shown if it contains something, can only be submitted by a marker/author
    feedback: String,
});

module.exports = mongoose.model('tests', submittedTestSchema);
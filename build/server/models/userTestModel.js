/**
 * Created by Kenji on 12/31/2017.
 *
 * The test model, has standard items and holds a standard string array of question IDs, also contains the author ID
 * This isnt used to lock in the ownership of the test but more to point to the creator.
 *
 * Result points to only 1 user and only 1 test, will only accept new submitted tests from that user
 * and increases amount of attempts every submit
 *
 * When a user first submits a test attempt, a resultsSchema is created with their id and the test id.
 */
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

//One user only has 1 result object per 1 test
var userTestSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    //testId: String,//Reference test for result settings
    test: {type: Schema.Types.ObjectId, ref: 'tests'},
    userId: String,//Only 1 result per test per user, can have x amount of submitted tests depending on attempts
    allocatedDate: { type: Date, default: Date.now },

    //List of submitted tests from different users
    submittedTests: [String],//The size of this array is the amount of attempts
    finalMark: { type: String, default: null },
    feedback: { type: String, default: null },
    showMarker: { type: Boolean, default:false },//Should the user see who marked them
    markerId: { type: String, default: null }, //Only shown if above is correct
    //THIS IS ONLY FOR THE AUTHOR(S), Talks to submittedTests and its children submittedQuestions in order to validate/mark them!
    //Who is allowed to mark this - Moved to test.js - Multiple authorIDs for marking
    //markerUserIds: [String],

    /**
     * future ideas:
     * - average % mark
     * - Amount of test takers
     * -
     */
});

module.exports = mongoose.model('usertest', userTestSchema);
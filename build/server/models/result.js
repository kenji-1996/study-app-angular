/**
 * Created by Kenji on 12/31/2017.
 *
 * The test model, has standard items and holds a standard string array of question IDs, also contains the author ID
 * This isnt used to lock in the ownership of the test but more to point to the creator.
 *
 * CURRENTLY STORING RESULTS IN test.js SCHEMA
 */
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var resultSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    //Author can allocate new markers.
    testId: String,//Reference test for result settings
    //List of submitted tests from different users
    submittedTests: [String],

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

module.exports = mongoose.model('results', resultSchema);
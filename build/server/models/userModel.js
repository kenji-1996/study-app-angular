/**
 * Created by Kenji on 12/31/2017.
 * User schema, holds various details including most importantly 'permissions' which is a number from 0-5
 * that allows how much the user can do (Teacher, Mod, Admin, User, etc)
 */
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema  = new Schema({
    //General information (collected from socials/submitted on registration)
    _id: Schema.Types.ObjectId,
    unique_id: String,
    email: String,
    name: String,
    source: String,
    picture: String,

    //User specific
    permissions: { type: Number, default: 0 },
    userGroup: { type: String, default: 'user' },
    organization: String,

    /**
     * @param test - List of non-editable tests allocated to the user                same ID
     * @param authoredTests - List of tests that the user has created or can edit    same ID
     * @param submittedTests - List of test attempts holding submitted answers and pointer to 'test'
     */
    tests: [String],//Tests that are allocated, no editing freedom but can soft delete them from ones self
    authoredTests: [String],//Tests created by this user, can edit and hard delete this
    results: [String], //Array of submitted tests that will hold marks/feedback/etc
    //Retrieve authoredTestResults from authoredTests (after being approved as author by server) -- selectedTest.testResults(testResults is an array of submitted tests)
    //authoredTestResults: [String],//Array of results schema for tests user has authored

    //Misc
    lastLogin: { type: Date, default: Date.now },
    dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('users', UserSchema);
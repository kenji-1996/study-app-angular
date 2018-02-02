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
let mongoose     = require('mongoose');
let Schema = mongoose.Schema;
let submittedTestModel = require('../models/submittedTestModel');
let testsModel = require('../models/testModel');
let usersModel = require('../models/userModel');

//One user only has 1 result object per 1 test
let userTestSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    //testId: String,//Reference test for result settings
    test: {type: Schema.Types.ObjectId, ref: 'tests'},
    user: {type: Schema.Types.ObjectId, ref: 'users'},
    allocatedDate: { type: Date, default: Date.now },
    started: { type: Boolean, default: false },

    //List of submitted tests from different users
    submittedTests: [{type: Schema.Types.ObjectId, ref: 'submittedtest'}],//The size of this array is the amount of attempts
    finalMark: { type: Number, default: null },
    marksAvailable: { type: Number, default: null },
    feedback: { type: String, default: null },
    marker: {type: Schema.Types.ObjectId, ref: 'users' }, //Marker is the author who marked the test or provided feedback
    //Show marker
    //showMarker: { type: Boolean, default:false },//Should the user see who marked them

    //If an author overrides values for a specific user
    //Aka if they are late etc
    testSettingsOverride: [{ setting: String, value: String, }]

    /**
     * future ideas:
     * - average % mark
     * - Amount of test takers
     * -
     */
});

userTestSchema.pre('remove', function(next) {
    console.log('attempting to remove user test');
    usersModel.update({ $pull: { results: this._id } }, { multi: true }).exec();
    testsModel.update({ $pull: { userTestList: this._id } }, { multi: true }).exec();
    submittedTestModel.findOneAndRemove({test: this.test}).exec(function (err,subTest) { subTest.remove(); });
    next();
});

module.exports = mongoose.model('usertests', userTestSchema);
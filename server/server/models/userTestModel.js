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
let usersModel = require('../models/userModel');
let mongoosePaginate = require('mongoose-paginate');

//One user only has 1 result object per 1 test
let userTestSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    //testId: String,//Reference test for result settings
    test: {type: Schema.Types.ObjectId, ref: 'tests'},
    user: {type: Schema.Types.ObjectId, ref: 'users'},
    date: { type: Date, default: Date.now },
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
userTestSchema.plugin(mongoosePaginate);

userTestSchema.pre('remove', function(next) {
    console.log('user test pre remove ' + this._id);
    //submittedTestModel.findOneAndRemove({test: this.test}).exec(function (err,subTest) { if(subTest) { subTest.remove(); } });
    submittedTestModel.find({test: this.test, user: this.user}).exec(function (err,subTest) {
        for(let i = 0; i < subTest.length; i++) {
            console.log('attempting to remove usertest ' + subTest[i]._id);
            subTest[i].remove();
        }
    });
    next();
});



module.exports = mongoose.model('usertests', userTestSchema);
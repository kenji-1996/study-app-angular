/**
 * Created by Kenji on 12/31/2017.
 *
 * The test model, has standard items and holds a standard string array of question IDs, also contains the author ID
 * This isnt used to lock in the ownership of the test but more to point to the creator.
 *
 * This object is simply allocated to anyone according to its permissions!!!!
 * Only author can hard delete this item and its children (if children dont belong to other tests?)
 */
let mongoose     = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let Schema = mongoose.Schema;
let questionsModel = require('./questionModel');
let usersModel = require('../userModel');
let userTestModel = require('./userTestModel');

let testSchema  = new Schema({
    //General test information
    _id: Schema.Types.ObjectId,
    title: {type:String, required: true},
    questions: [{type: Schema.Types.ObjectId, ref: 'questions'}],
    tags: [String],
    date: { type: Date, default: Date.now },
    //Query all user tests from user?
    //[{ type : ObjectId, ref: 'User' }],
    userTestList: [{type: Schema.Types.ObjectId, ref: 'usertests'}],//Array of resultsSchema._id that can hold x amount of submittedTests (depending on attemptsAllowed)
    selfAllocatedTestList: [{type: Schema.Types.ObjectId, ref: 'selfallocatedtests'}],
    authors: [{type: Schema.Types.ObjectId, ref: 'users'}],
    marksAvailable: {type: Number, default: 0 },

    //Settings
    locked:{ type: Boolean, default:false },
    expire: { type: Boolean, default:false },//Should the test expire
    expireDate: { type: Date, default: new Date(+new Date() + 7*24*60*60*1000) },//If expire, default at 1 week later
    fullPage: { type: Boolean, default:false },//If the layout should be 1 question at a time or
    handMarked: { type: Boolean, default:false },//Results not calculated internally but rather by the markers
    attemptsAllowed: { type: Number, default:0 },//If 0, infinite!
    userEditable: { type: Boolean, default:false },//Can the user edit this test
    canSelfRemove: { type: Boolean, default:false },//Can the user unallocate themselves
    timerEnabled: { type: Boolean, default:false },
    timer: { type: Number, default:60 },//Number of minutes a test can be live after started, question specific timer in question schema
    hintAllowed: { type: Boolean, default:false },//allow hint
    sponsoredFeedback: { type: Boolean, default:false },//In future, markers can get rewarded for providing info/feedback
    markDate: {type: Date }, //If author wants user to have to wait till all users have done the test for it to be auto marked.
    showMarks: { type: Boolean, default:false },//If it is marked, can we show?
    showMarker: { type: Boolean, default:false },//Can the user see who marked them

    /**If shareable it can be self assigned by any user with the ID
     * If privateTest, wont show in the test browser but sharing settings depend on above
     */
    shareable: { type: Boolean, default:false },
    private: { type: Boolean, default:false },
    /*Future concepts
    allowedUserGroups: [String],
    allowedOrganizations: [String],
    assignedGroup: [String]/String, (Will require the author to be a leader of said group)
    sponsoredFeedback: { type: Boolean, default:false },
    */
});
testSchema.plugin(mongoosePaginate);

/**
 * When removing a test, we call middleware function to remove all related documents
 * loop through user tests and remove them
 *
 */

testSchema.pre('remove', function(next) {
    userTestModel.find({test: this._id}).exec(function (err,userTest) {
        for(let i = 0; i < userTest.length; i++) {
            userTest[i].remove();
        }
    });
    next();
});
testSchema.post('remove', function() {
    questionsModel.remove({_id: { $in: this.questions}}).exec();
});

module.exports = mongoose.model('tests', testSchema);
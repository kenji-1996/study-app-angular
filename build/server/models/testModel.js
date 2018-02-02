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
let Schema = mongoose.Schema;
let questionsModel = require('../models/questionModel');
let usersModel = require('../models/userModel');
let userTestModel = require('../models/userTestModel');

let testSchema  = new Schema({
    //General test information
    _id: Schema.Types.ObjectId,
    title: {type:String, required: true},
    questions: [{type: Schema.Types.ObjectId, ref: 'questions'}],
    category: String,
    date: { type: Date, default: Date.now },
    //Query all user tests from user?
    //[{ type : ObjectId, ref: 'User' }],
    userTestList: [{type: Schema.Types.ObjectId, ref: 'usertests'}],//Array of resultsSchema._id that can hold x amount of submittedTests (depending on attemptsAllowed)
    authors: [{type: Schema.Types.ObjectId, ref: 'users'}],

    //Settings
    expire: { type: Boolean, default:false },//Should the test expire
    expireDate: { type: Date, default: new Date(+new Date() + 7*24*60*60*1000) },//If expire, default at 1 week later
    fullPage: { type: Boolean, default:false },//If the layout should be 1 question at a time or
    handMarked: { type: Boolean, default:false },//Results not calculated internally but rather by the markers
    attemptsAllowed: { type: Number, default:0 },//If 0, infinite!
    userEditable: { type: Boolean, default:false },
    canSelfRemove: { type: Boolean, default:false },
    timerEnabled: { type: Boolean, default:false },
    timer: { type: Number, default:60 },//Number of minutes a test can be live after started, question specific timer in question schema
    hintAllowed: { type: Boolean, default:true },//allow hint
    sponsoredFeedback: { type: Boolean, default:false },//In future, markers can get rewarded for providing info/feedback
    markDate: {type: Date }, //If author wants user to have to wait till all users have done the test for it to be auto marked.
    showMarks: { type: Boolean, default:true },//If it is marked, can we show?
    showMarker: { type: Boolean, default:true },//Can the user see who marked them

    /**If shareable it can be self assigned by any user with the ID
     * If private, wont show in the test browser but sharing settings depend on above
     */
    shareable: { type: Boolean, default:true },
    private: { type: Boolean, default:false },
    /*Future concepts
    allowedUserGroups: [String],
    allowedOrganizations: [String],
    assignedGroup: [String]/String, (Will require the author to be a leader of said group)
    sponsoredFeedback: { type: Boolean, default:false },
    */
});

/**
 * When removing a test, we call middleware function to remove all related documents
 * loop through user tests and remove them
 *
 */
testSchema.pre('remove', function(next) {
    console.log('attempting to remove test');
    usersModel.update({ $pull: { authoredTests: this._id } }, { multi: true }).exec();
    userTestModel.find({test: this.test}).exec(function (err,userTest)  { for(let i = 0; i < userTest.length; i++) {userTest[i].remove();} });
    questionsModel.find({_id: { $in: this.questions}}).exec(function (err,testQuestion)  { for(let i = 0; i < testQuestion.length; i++) {testQuestion[i].remove();} });
    next();
});

module.exports = mongoose.model('tests', testSchema);
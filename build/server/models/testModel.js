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

let testSchema  = new Schema({
    //General test information
    _id: Schema.Types.ObjectId,
    title: {type:String, required: true},
    questions: [String],
    category: String,
    started: { type: Boolean, default:false },//Stop user bailing from tests
    date: { type: Date, default: Date.now },
    //Should resultsList hold a user.id with the related result.id
    resultsList: [String],//Array of resultsSchema._id that can hold x amount of submittedTests (depending on attemptsAllowed)
    //testResults: [String],//Array of submittedTest results


    /**
     * Temp removed authorID and authorIMG as we have multiple author ids.
     */
    //authorID: String, //Make this [String] allowing for multiple authors/editors
    //authorIMG: String,
    authors: [String],


    //Settings
    expire: { type: Boolean, default:false },//Should the test expire
    fullPage: { type: Boolean, default:false },//If the layout should be 1 question at a time or
    expireDate: { type: Date, default: new Date(+new Date() + 7*24*60*60*1000) },//If expire, default at 1 week later
    handMarked: { type: Boolean, default:false },//Results not calculated internally but rather by the markers
    private: { type: Boolean, default:false },//If public, will be available to find on test browser
    attemptsAllowed: { type: Number, default:10 },//How many attempts allowed
    //currentAttempts: { type: Number, default:0 },//Should be moved
    userEditable: { type: Boolean, default:false },
    shareable: { type: Boolean, default:true },
    //Only for overall, need to add individual timer settings
    timerEnabled: { type: Boolean, default:false },
    timer: { type: Number, default:60 },//Number of minutes a test can be live after started, question specific timer in question schema


    hintAllowed: { type: Boolean, default:true },//allow hint
    sponsoredFeedback: { type: Boolean, default:false },//In future, markers can get rewarded for providing info/feedback

    markDate: {type: Date }, //If author wants user to have to wait till all users have done the test for it to be auto marked.
    //marked: { type: Boolean, default:false },//Has the server/author marked this?
    showMarks: { type: Boolean, default:true },//If it is marked, can we show?

    /*Future concepts
    allowedUserGroups: [String],
    allowedOrganizations: [String],
    assignedGroup: [String]/String, (Will require the author to be a leader of said group)
    sponsoredFeedback: { type: Boolean, default:false },
    */
});

module.exports = mongoose.model('tests', testSchema);
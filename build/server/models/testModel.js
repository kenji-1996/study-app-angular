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
    questions: [{type: Schema.Types.ObjectId, ref: 'questions'}],
    category: String,
    date: { type: Date, default: Date.now },
    resultsList: [String],//Array of resultsSchema._id that can hold x amount of submittedTests (depending on attemptsAllowed)
    authors: [String],

    //Settings
    expire: { type: Boolean, default:false },//Should the test expire
    fullPage: { type: Boolean, default:false },//If the layout should be 1 question at a time or
    expireDate: { type: Date, default: new Date(+new Date() + 7*24*60*60*1000) },//If expire, default at 1 week later
    handMarked: { type: Boolean, default:false },//Results not calculated internally but rather by the markers
    private: { type: Boolean, default:false },//If public, will be available to find on test browser
    attemptsAllowed: { type: Number, default:0 },//If 0, infinite!
    instantResult: { type: Boolean, default:false },
    userEditable: { type: Boolean, default:false },
    canSelfRemove: { type: Boolean, default:false },
    shareable: { type: Boolean, default:true },
    //Only for overall, need to add individual timer settings
    timerEnabled: { type: Boolean, default:false },
    timer: { type: Number, default:60 },//Number of minutes a test can be live after started, question specific timer in question schema


    hintAllowed: { type: Boolean, default:true },//allow hint
    sponsoredFeedback: { type: Boolean, default:false },//In future, markers can get rewarded for providing info/feedback

    markDate: {type: Date }, //If author wants user to have to wait till all users have done the test for it to be auto marked.
    //marked: { type: Boolean, default:false },//Has the server/author marked this?
    showMarks: { type: Boolean, default:true },//If it is marked, can we show?
    showMarker: { type: Boolean, default:true },//Can the user see who marked them

    /*Future concepts
    allowedUserGroups: [String],
    allowedOrganizations: [String],
    assignedGroup: [String]/String, (Will require the author to be a leader of said group)
    sponsoredFeedback: { type: Boolean, default:false },
    */
});

module.exports = mongoose.model('tests', testSchema);
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
    markers: [String],//Undecided if im keeping this
    started: { type: Boolean, default:false },
    users: { type: Number, default: 0 },//Probably a waste of time, can be calculated a different way anyway.
    date: { type: Date, default: Date.now },
    testResults: [String],//Array of submittedTest results

    //Author information - Author can edit test, but cant mark, only the markers array can mark!
    authorID: String, //Make this [String] allowing for multiple authors/editors
    author: String,
    authorIMG: String,

    //Settings
    expire: { type: Boolean, default:false },
    expireDate: { type: Date, default: new Date(+new Date() + 7*24*60*60*1000) },
    handMarked: { type: Boolean, default:false },//Results not calculated internally but rather by the markers
    private: { type: Boolean, default:false },//If public, will be available to find on test browser
    showResult: { type: Boolean, default:true },
    attemptsAllowed: { type: Number, default:10 },
    currentAttempts: { type: Number, default:0 },
    userEditable: { type: Boolean, default:false },
    shareable: { type: Boolean, default:true },
    timerEnabled: { type: Boolean, default:false },
    timer: { type: Number, default:60 },//Number of minutes a test can be live after started, question specific timer in question schema
    hintAllowed: { type: Boolean, default:true },
    sponsoredFeedback: { type: Boolean, default:false },//In future, markers can get rewarded for providing info/feedback
    markDate: {type: Date, default: Date.now } //If author wants user to have to wait till all users have done the test for it to be auto marked.

    /*Future concepts
    allowedUserGroups: [String],
    allowedOrganizations: [String],
    assignedGroup: [String]/String, (Will require the author to be a leader of said group)
    sponsoredFeedback: { type: Boolean, default:false },
    */
});

module.exports = mongoose.model('tests', testSchema);
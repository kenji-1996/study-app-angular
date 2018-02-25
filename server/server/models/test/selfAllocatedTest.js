/**
 * Created by Kenji on 12/31/2017.
 * Submitted test, when a user completes a test the information is saved like so
 * Then the user can get feedback and a mark,
 *
 * userId and testId are found in parent resultSchema
 */
let mongoose     = require('mongoose');
let Schema = mongoose.Schema;
let submittedTestModel = require('./submittedTestModel');
let mongoosePaginate = require('mongoose-paginate');

//One user only has 1 result object per 1 test
let selfAllocatedTest  = new Schema({
    _id: Schema.Types.ObjectId,
    //testId: String,//Reference test for result settings
    test: {type: Schema.Types.ObjectId, ref: 'tests', unique : true, required : true, dropDups: true},
    user: {type: Schema.Types.ObjectId, ref: 'users'},
    allocatedDate: { type: Date, default: Date.now },
    started: { type: Boolean, default: false },

    //List of submitted tests from different users
    submittedTests: [{type: Schema.Types.ObjectId, ref: 'submittedtest'}],//The size of this array is the amount of attempts
    finalMark: { type: Number, default: null },
    marksAvailable: { type: Number, default: null },
    /**
     * No feedback or marker if test self assigned, may change in future
     */
    //feedback: { type: String, default: null },
    //marker: {type: Schema.Types.ObjectId, ref: 'users' }, //Marker is the author who marked the test or provided feedback
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
    /* in-field custom validate
         validate: {
         validator: function(v, cb) {
         User.find({name: v}, function(err,docs){
         cb(docs.length == 0);
         });
         },
         message: 'User already exists!'
         }
     */
});

selfAllocatedTest.plugin(mongoosePaginate);

selfAllocatedTest.pre('remove', function(next) {
    submittedTestModel.findOneAndRemove({test: this.test}).exec(function (err,subTest) { if(subTest) { subTest.remove(); } });
    mongoose.models['tests'].update({'_id' : this.test},{ $pull: { 'selfAllocatedTestList': this._id } }).exec(function (){});
    next();
});



module.exports = mongoose.model('selfallocatedtests', selfAllocatedTest);
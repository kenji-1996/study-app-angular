/**
 * Created by Kenji on 12/31/2017.
 *
 * Question schema, This is the end of the 'many' database where,
 * Questions -> Tests -> User
 * Aka a user can hold many tests made up of many questions
 *
 * Types: keyword,multichoice,arrange,shortanswer
 *
 * No 'parent/test' id provided, so question can be shared
 */
let mongoose     = require('mongoose');
let Schema = mongoose.Schema;
let mongoosePaginate = require('mongoose-paginate');

let questionSchema  = new Schema({
    //Question general information
    _id: Schema.Types.ObjectId,
    hint: String,
    date: { type: Date, default: Date.now },

    resources: [String],//References for attempting this question - Unused
    images: [String],//Images relating to this question - Unused

    //keywords,choices,arrangement,shortAnswer
    type: { type:String, required: true, default: 'keywords'},
    possibleMarks: { type: Number, default: 0 },
    //possibleAllocatedMarks: { type: Number, default: null },
    //Removing possible marks, will instead check for handmarked here or something

    question: { type:String, required:true },
    keywordsAnswer: {type:[String], default: null},
    choicesAnswer: {type:[String], default: null},
    choicesAll: {type:[String], default: null},
    arrangement: {type:[String], default: null},
    shortAnswer: {type:String, default: null},

    //Settings
    bonus: { type: Boolean, default: false },//If bonus, not counted on total answers mark, but will increase answer (implying user can get over 100% if bonus questions exist)
    handMarked: {type: Boolean, default: false },
});
questionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('questions', questionSchema);
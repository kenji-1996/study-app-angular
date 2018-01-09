/**
 * Created by Kenji on 12/31/2017.
 *
 * The test model, has standard items and holds a standard string array of question IDs, also contains the author ID
 * This isnt used to lock in the ownership of the test but more to point to the creator.
 */
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var testSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    title: {type:String, required: true},
    questions: [String],
    authorID: String,
    author: String,
    authorIMG: String,
    date: { type: Date, default: Date.now },
    private: { type: Boolean, default:true },
});

module.exports = mongoose.model('Test', testSchema);
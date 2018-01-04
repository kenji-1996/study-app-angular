/**
 * Created by Kenji on 12/31/2017.
 */
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var testSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    title: String,
    questions: [String],
    authorID: String,
    author: String,
});

module.exports = mongoose.model('Test', testSchema);
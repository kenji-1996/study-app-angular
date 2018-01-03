/**
 * Created by Kenji on 12/31/2017.
 */
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    question: String,
    answer: String,
    category: String,
});

module.exports = mongoose.model('Question', questionSchema);
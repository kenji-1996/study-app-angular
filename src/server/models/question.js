/**
 * Created by Kenji on 12/31/2017.
 *
 * Question schema, This is the end of the 'many' database where,
 * Questions -> Tests -> User
 * Aka a user can hold many tests made up of many questions
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
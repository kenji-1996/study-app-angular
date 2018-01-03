/**
 * Created by Kenji on 12/31/2017.
 */
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;
var QuestionSchema = require('./question').schema;


var UserSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    unique_id: String,
    email: String,
    name: String,
    source: String,
    picture: String,
    permissions: Number,
    questions: [QuestionSchema],
});

module.exports = mongoose.model('User', UserSchema);
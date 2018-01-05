/**
 * Created by Kenji on 12/31/2017.
 * User schema, holds various details including most importantly 'permissions' which is a number from 0-5
 * that allows how much the user can do (Teacher, Mod, Admin, User, etc)
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
    tests: [String],
});

module.exports = mongoose.model('User', UserSchema);
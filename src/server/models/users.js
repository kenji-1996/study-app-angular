/**
 * Created by Kenji on 12/31/2017.
 * User schema, holds various details including most importantly 'permissions' which is a number from 0-5
 * that allows how much the user can do (Teacher, Mod, Admin, User, etc)
 */
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    unique_id: String,
    email: String,
    name: String,
    source: String,
    picture: String,
    permissions: { type: Number, default: 0 },
    tests: [String],
    results: [String],
    lastLogin: { type: Date, default: Date.now },
    dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('users', UserSchema);
/**
 * Created by Kenji on 12/31/2017.
 * User schema, holds various details including most importantly 'permissions' which is a number from 0-5
 * that allows how much the user can do (Teacher, Mod, Admin, User, etc)
 */
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema  = new Schema({
    //General information (collected from socials/submitted on registration)
    _id: Schema.Types.ObjectId,
    unique_id: String,
    email: String,
    name: String,
    source: String,
    picture: String,
    permissions: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now },
    dateCreated: { type: Date, default: Date.now },

    //Test related
    userGroups: [String],
    organizations: [String],
    tests: [{type: Schema.Types.ObjectId, ref: 'tests'}],//Tests that are allocated, no editing freedom but can soft delete them from ones self
    authoredTests: [{type: Schema.Types.ObjectId, ref: 'tests'}],//Tests created by this user, can edit and hard delete this
    results: [{type: Schema.Types.ObjectId, ref: 'usertest'}], //Array of submitted tests that will hold marks/feedback/etc


});

module.exports = mongoose.model('users', UserSchema);
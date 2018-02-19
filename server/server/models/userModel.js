/**
 * Created by Kenji on 12/31/2017.
 * User schema, holds various details including most importantly 'permissions' which is a number from 0-5
 * that allows how much the user can do (Teacher, Mod, Admin, User, etc)
 */
let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
let Schema = mongoose.Schema;

let mongoosePaginate = require('mongoose-paginate');

let UserSchema  = new Schema({
    //General information (collected from socials/submitted on registration)
    _id: Schema.Types.ObjectId,
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    unique_id: String,
    token: {type:String},
    email: [{type:String, required: true, unique: true}],
    name: {type:String, default: 'user'},
    source: String,
    picture: {type:String, default: 'https://i.imgur.com/t2ioA6P.png'},
    permissions: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now },
    dateCreated: { type: Date, default: Date.now },
    //Test related
    userGroups: [String],
    organizations: [String],

});

UserSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.pre('save', function(callback) {
    let user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});

UserSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('users', UserSchema);
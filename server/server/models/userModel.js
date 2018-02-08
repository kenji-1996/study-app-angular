/**
 * Created by Kenji on 12/31/2017.
 * User schema, holds various details including most importantly 'permissions' which is a number from 0-5
 * that allows how much the user can do (Teacher, Mod, Admin, User, etc)
 */
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;
let mongoosePaginate = require('mongoose-paginate');

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

});
UserSchema.plugin(mongoosePaginate);

/*UserSchema.pre('remove', function(next) {
    console.log('attempting to remove test');
    testsModel.find({test: this.test}).exec(function (err,test)
    {
        for(let i = 0; i < test.length; i++) {test[i].remove();}
    });
    next();
});*/

module.exports = mongoose.model('users', UserSchema);
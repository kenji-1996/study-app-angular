/**
 * Created by Kenji on 12/31/2017.
 * User schema, holds various details including most importantly 'permissions' which is a number from 0-5
 * that allows how much the user can do (Teacher, Mod, Admin, User, etc)
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongoosePaginate = require('mongoose-paginate');

let organizationSchema  = new Schema({
    //General information (collected from socials/submitted on registration)
    _id: Schema.Types.ObjectId,
    name: {type: String, unique: true, required: true},
    tags: [{type: String, required: true}],
    icon: {type: String},
    private: {type:Boolean, default: true },
    approved: {type:Boolean, default: false},
    creator: {type: Schema.Types.ObjectId, ref: 'users'},
    staff: [{type: Schema.Types.ObjectId, ref: 'users'}],//Can edit the whole org
    groups: [{type: Schema.Types.ObjectId, ref: 'groups'}],
});

organizationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('orgs', organizationSchema);
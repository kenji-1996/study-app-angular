/**
 * Created by Kenji on 12/31/2017.
 * User schema, holds various details including most importantly 'permissions' which is a number from 0-5
 * that allows how much the user can do (Teacher, Mod, Admin, User, etc)
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongoosePaginate = require('mongoose-paginate');

let groupsSchema  = new Schema({//Aka a class, staff are usually the classes teacher, who can review results, allocate tests, send group messages, etc
    _id: Schema.Types.ObjectId,
    name: {type: String, unique: true, required: true},
    date: { type: Date, default: Date.now },
    private: {type:Boolean, default: false },
    verified: {type:Boolean, default: false},
    canLeave: {type:Boolean, default: true },
    capacity: {type: Number, default: 30},
    creator: {type: Schema.Types.ObjectId, ref: 'users'},
    staff: [{type: Schema.Types.ObjectId, ref: 'users'}],
    users: [{type: Schema.Types.ObjectId, ref: 'users'}],
    tests: [{type: Schema.Types.ObjectId, ref: 'tests'}],

});

groupsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('groups', groupsSchema);
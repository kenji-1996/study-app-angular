/**
 * Created by Kenji on 12/31/2017.
 */
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema  = new Schema({
    unique_id: String,
    email: String,
    name: String,
    source: String,
    picture: String,
    permissions: Number,
    questions : [{ type: Schema.Types.ObjectId, ref: 'Question' }],
});

module.exports = mongoose.model('User', UserSchema);
/**
 * Created by Kenji on 12/31/2017.
 */
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var USER  = new Schema({
    unique_id: String,
    email: String,
    name: String,
    source: String,
    picture: String,
    permissions: Number
});

module.exports = mongoose.model('Users', USER);
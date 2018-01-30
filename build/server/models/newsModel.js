/**
 * Created by Kenji on 12/31/2017.
 *
 * news schema
 * currently not attached to anyone
 */
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var newsSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    headline: {type:String, required: true},
    content: String,
    authorId: {type: Schema.Types.ObjectId, ref: 'users'},
    tags: [String],
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('news', newsSchema);


/**
 * Created by Kenji on 12/31/2017.
 *
 * news schema
 * currently not attached to anyone
 */
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;
let mongoosePaginate = require('mongoose-paginate');

var newsSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    headline: {type:String, required: true},
    content: String,
    authorId: {type: Schema.Types.ObjectId, ref: 'users'},
    tags: [String],
    date: { type: Date, default: Date.now },
});
newsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('news', newsSchema);


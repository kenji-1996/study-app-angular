/**
 * Created by Kenji on 12/31/2017.
 *
 * news schema
 * currently not attached to anyone
 */
// Load required packages
var mongoose = require('mongoose');

// Define our client schema
var ClientSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    id: { type: String, required: true },//Auto generate to ensure uniquness
    secret: { type: String, required: true },//^
    userId: { type: String, required: true }
});

// Export the Mongoose model
module.exports = mongoose.model('client', ClientSchema);

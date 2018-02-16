var mongoose = require('mongoose');

// Define our token schema
var TokenSchema   = new mongoose.Schema({
    value: { type: String, required: true },//Strong hashing scheme required
    //expiration: { type: String, required: true },
    userID: { type: String },
    clientID: { type: String },
});

// Export the Mongoose model
module.exports = mongoose.model('token', TokenSchema);
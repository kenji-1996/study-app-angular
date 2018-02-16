// Load required packages
var oauth2orize = require('oauth2orize')
var userModel = require('../models/userModel');
var tokenModel = require('../models/tokenModel');
//var Code = require('../models/code');

var server = oauth2orize.createServer();

// Register serialialization function
server.serializeUser(function(user, callback) {
    return callback(null, user._id);
});

// Register deserialization function
server.deserializeUser(function(id, callback) {
    userModel.findOne({ _id: id }, function (err, user) {
        if (err) { return callback(err); }
        return callback(null, user);
    });
});

// Exchange authorization codes for access tokens
server.exchange(oauth2orize.exchange.code(function(user, callback) {
    var token = new Token({
        value: uid(256),
        userId: user._id
    });

    // Save the access token and check for errors
    token.save(function (err) {
        if (err) { return callback(err); }

        callback(null, token);
    });
}));

function uid (len) {
    var buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
server.serializeClient(function(client, callback) {
    return callback(null, client._id);
});

// Register deserialization function
server.deserializeClient(function(id, callback) {
    Client.findOne({ _id: id }, function (err, client) {
        if (err) { return callback(err); }
        return callback(null, client);
    });
});

 server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
 // Create a new authorization code
 var code = new Code({
 value: uid(16),
 clientId: client._id,
 redirectUri: redirectUri,
 userId: user._id
 });

 // Save the auth code and check for errors
 code.save(function(err) {
 if (err) { return callback(err); }

 callback(null, code.value);
 });
    */
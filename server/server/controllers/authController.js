/**
 * Created by Kenji on 1/8/2018.
 */
let settings = require('../misc/settings');
let mongoose = require('mongoose');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy

let userModel = require('../models/userModel');
let tokenModel = require('../models/tokenModel');

/**
 * /api/auth [GET] -- temp get for testing
 * List ALL users
 * @param req
 * @param res
 * @return {message,data}
 */
exports.getUsers = function(req, res) {
    userModel.find({})
        .sort({date: -1})
        .exec(function(err,results) {
            if (err) return res.status(500).json({message: "Find users query failed", data: err});

            return res.status(200).json({message: "Results retrieved", data: results});
        });
};

/**
 * /api/auth/register [POST]
 * A new user registers
 *
 * Ensure validation
 * @param req
 * @param res
 * @return {message,data}
 */
exports.postRegister = function(req, res) {
    if(req.body.username && req.body.password && req.body.email) {
        let user = new userModel(req.body);
        user._id = new mongoose.Types.ObjectId();
        user.save(function (err, result) {
            if (err) return res.status(500).json({message: "Saving user failed", data: err});
            return res.status(200).json({message: "User successfully registered", data: result});
        });
    }else{
        return res.status(400).json({message: "Username, password and email are all required", data: req.body});
    }
};

exports.postLogin = function(req, res) {

};

passport.use(new BasicStrategy(
    function(username, password, callback) {
        userModel.findOne({ username: username }, function (err, user) {
            if (err) { return callback(err); }

            // No user found with that username
            if (!user) { return callback(null, false); }

            // Make sure the password is correct
            user.verifyPassword(password, function(err, isMatch) {
                if (err) { return callback(err); }

                // Password did not match
                if (!isMatch) { return callback(null, false); }

                // Success
                return callback(null, user);
            });
        });
    }
));

passport.use(new BearerStrategy(
    function(accessToken, callback) {
        tokenModel.findOne({value: accessToken }, function (err, token) {
            if (err) { return callback(err); }

            // No token found
            if (!token) { return callback(null, false); }

            userModel.findOne({ _id: token.userId }, function (err, user) {
                if (err) { return callback(err); }

                // No user found
                if (!user) { return callback(null, false); }

                // Simple example with no scope
                callback(null, user, { scope: '*' });
            });
        });
    }
));

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session : false });


/**
 * Created by Kenji on 1/8/2018.
 */
let settings = require('../misc/settings');
let mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jsonwebtoken');
let config = require('../misc/config');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

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
        let user = new userModel();
        user._id = new mongoose.Types.ObjectId();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.save(function (err, result) {
            if (err) return res.status(500).json({message: "Saving user failed", data: err});
            return res.status(200).json({message: "User successfully registered", data: result});
        });
    }else{
        return res.status(400).json({message: "Username, password and email are all required", data: req.body});
    }
};

exports.postLogin = function(req, res) {
    userModel.findOne({username: req.body.username})
        .exec(function (err, userResult) {
            if(err) return res.status(500).json({message: "Server failed search users", data: err});
            //if(!user) return res.status(500).json({message: "No valid user", data: err});
            userResult.verifyPassword(req.body.password, function(err, isMatch) {
                if (err) {  return res.status(500).json({message: "Server failed to process user login", data: err});}

                // Password did not match
                if (!isMatch) {  return res.status(403).json({message: "Password incorrect", data: err}); }

                // Success
                console.log(config.jwtSecret);
                let token = jwt.sign(JSON.stringify(userResult),config.jwtSecret);
                return res.status(200).json({message: "Successful login", data: token});
            });
        });

};
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.jwtSecret;


passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    userModel.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) return done(err, false);
        if (user) done(null, user);
        else done(null, false);
    });
}));

exports.isAuthenticated = passport.authenticate('jwt', { session : false });
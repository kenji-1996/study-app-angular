/**
 * Created by Kenji on 1/8/2018.
 */
let settings = require('../misc/settings');
let mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
let config = require('../misc/config');


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
        if(req.body.name) user.name = req.body.name;
        user.save(function (err, result) {
            if (err) return res.status(500).json({message: "Saving user failed", data: err});
            return res.status(200).json({message: "User successfully registered", data: result});
        });
    }else{
        return res.status(400).json({message: "Username, password and email are all required", data: req.body});
    }
};

exports.postLogin = function(req, res) {
    if(req.body.password && req.body.username) {
        userModel.findOne({username: req.body.username})
            .exec(function (err, userResult) {
                if(err) return res.status(500).json({message: "Server failed search users", data: err});
                if(!userResult) return res.status(500).json({message: "Username invalid", data: err});
                userResult.verifyPassword(req.body.password, function(err, isMatch) {
                    if (err) {  return res.status(500).json({message: "Server failed to process user login", data: err});}

                    // Password did not match
                    if (!isMatch) {  return res.status(403).json({message: "Password incorrect", data: err}); }

                    // Success
                    let token = jwt.sign(JSON.stringify(userResult),config.jwtSecret);
                    return res.status(200).json({message: "Successful login", data: token});
                });
            });
    }else{
        return res.status(400).json({message: "Username and password are required", data: req.body});
    }
};

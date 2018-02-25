let jwt = require('jsonwebtoken');
let config = require('../../misc/config');
global.atob = require("atob");
let mongoose = require('mongoose');
let usersModel = require('../../models/userModel');
let settings = require('../../misc/settings');

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
        let user = new usersModel();
        user._id = new mongoose.Types.ObjectId();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        if(req.body.name) user.name = req.body.name;
        if(req.body.picture) { user.picture = req.body.picture; }else{ user.picture = settings.chance.avatar(); }
        user.save(function (err, result) {
            if (err && err.code && err.code === 11000) return res.status(400).json({message: "A user with that username or email already exists", data: err});
            if (err) return res.status(500).json({message: "Saving user failed", data: err});
            return res.status(200).json({message: "User successfully registered", data: result});
        });
    }else{
        return res.status(400).json({message: "Username, password and email are all required", data: req.body});
    }
};

/**
 * /api/users [GET]
 * Posts a basic auth header encrypted with btoa, and decrypted with atob and verified
 *
 * @param req
 * @param res
 * @return {token}
 */
exports.getLogin = function(req, res) {
    const btoaAuth = (req.headers.authorization || '').split(' ')[1] || '';
    const [username, password, rememberMe] = atob(btoaAuth).toString().split(':');
    if(username && password) {
        usersModel.findOneAndUpdate({username: username},{lastLogin: new Date(),})
            .exec(function (err, userResult) {
                if(err) return res.status(500).json({message: "Server failed search users", data: err});
                if(!userResult) return res.status(500).json({message: "Username invalid", data: err});
                userResult.verifyPassword(password, function(err, isMatch) {
                    if (err) {  return res.status(500).json({message: "Server failed to process user login", data: err});}

                    // Password did not match
                    if (!isMatch) {  return res.status(403).json({message: "Password incorrect", data: err}); }
                    // Success
                    let token = jwt.sign({_id: userResult._id, exp: rememberMe === 'true'? Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365 * 100) : Math.floor(Date.now() / 1000) + (60 * 60) }, config.jwtSecret);
                    let obj = {};
                    obj['profile'] = userResult;
                    obj['profile']['password'] = undefined;
                    obj['token'] = token;
                    return res.status(200).json({message: "Successful login", data: obj});
                });
            });
    }else{
        return res.status(400).json({message: "Username and password are required", data: req.body});
    }
};
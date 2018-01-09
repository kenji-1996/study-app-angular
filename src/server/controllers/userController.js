/**
 * Created by Kenji on 1/8/2018.
 */
let settings = require('../misc/settings');

let mongoose = require('mongoose');
let TEST = require('../models/test');
let USER = require('../models/user');
let QUESTION = require('../models/question');

/**
 * /api/users [GET]
 * List ALL tests in DB.
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listUsers = function(req, res) {
    USER.find({}, '_id name date picture source tests', function(err, users) {
        if (err) return res.status(500).json({message: "Find user query failed", data: err});

        return res.status(200).json({message: "Users retrieved", data: users});
    });
};
/**
 * /api/users [POST]
 * A user can add a test to their user if authorised
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.authenticateUser = function(req, res) {
    settings.ensureAuthorized(req,res).then(function (user) {
        if(!user) { return null; }
        var authUser = new USER({
            unique_id: user['sub'],
            email: user['email'],
            name: user['name'],
            source: user['iss'],
            picture: user['picture'],
            permissions: 0,
        });
        USER.update({'unique_id' : user['sub'] },authUser,{upsert: true}, function (err, raw) {
            if (err) return res.status(500).json({message: "Failed to update/insert user", data: err});
        });
        USER.findOne({'unique_id' : user['sub']}, function(err,userResult) {
            if (err) return res.status(500).json({message: "Couldnt find user", data: err});
            return res.status(200).json({message: "Users retrieved", data: userResult});
        });
    });
};

/**
 * /api/users/:userId [GET]
 * Gets information about a specific test
 * @param req
 * @param res
 */
exports.listUser = function(req, res) {
    TEST.find({_id: req.params.testId}, function(err, test) {
        if (err) return res.status(500).json({message: "Find test query failed", data: err});

        return res.status(200).json({message: "Test found", data: test});
    });
};
/**
 * /api/users/:userId [PUT]
 * Update a USER by ID, if they have elevated perms modify any otherwise modify self.
 * @param req
 * @param res
 */
exports.updateUser = function(req, res) {
    settings.ensureAuthorized(req,res).then(function (user) {
        if(!user) { return null; }
        USER.find({unique_id: user['sub']})
            .exec(function (err,userRes){
                if(userRes.permissions >= 3) {
                    USER.findOneAndUpdate({_id: req.params.testId}, req.body, {new: true}, function (err, userQ1) {
                        if (err) return res.status(500).json({message: "Save user query failed", data: err});
                        return res.status(200).json({message: ('Admin updated user ' + userQ1.id), data: userQ1});
                    });
                }else{
                    USER.findOneAndUpdate({unique_id: user['sub']}, req.body, {new: true}, function (err, userQ2) {
                        if (err) return res.status(500).json({message: "Save user query failed", data: err});
                        return res.status(200).json({message: ('Admin updated user ' + userQ2.id), data: userQ2});
                    });
                }

            });

    });
};

/**
 * /api/users/:userId [DELETE]
 * Deletes an inputted
 * @param req
 * @param res
 */
exports.deleteUser = function(req, res) {
    settings.ensureAuthorized(req,res).then(function (user) {
        if(!user) { return null; }
        USER.find({unique_id: user['sub']})
            .exec(function (err, userRes) {
                if (userRes[0].permissions >= 3) {
                    console.log(userRes[0].tests);
                    USER.findOneAndUpdate({_id: req.params.userId},{$pullAll: {tests: userRes[0].tests}}, function (err, userQ1) {
                        if (err) return res.status(500).json({message: "Find user query failed", data: err});
                        userQ1.remove();
                        return res.status(200).json({message: ('Admin updated user ' + userQ1.id), data: userQ1});

                    });
                } else {
                    return res.status(401).json({message: 'No permission to delete user', data: null});
                }
            });
    });
};
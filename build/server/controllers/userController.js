/**
 * Created by Kenji on 1/8/2018.
 */
let settings = require('../misc/settings');

let testsModel = require('../models/tests');
let usersModel = require('../models/users');
let resultsModel = require('../models/results');

/**
 * /api/users [GET]
 * List ALL users in DB.
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listUsers = function(req, res) {
    usersModel.find({}, '_id name date picture source tests', function(err, users) {
        if (err) return res.status(500).json({message: "Find home query failed", data: err});

        return res.status(200).json({message: "Users retrieved", data: users});
    });
};
/**
 * /api/users [POST]
 * A home can add a test to their home if authorised
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.authenticateUser = function(req, res) {
    settings.ensureAuthorized(req,res).then(function (user) {
        if(!user) { return null; }
        var query = {'unique_id' : user['sub'] }, update = {lastLogin: new Date(),}, options = { upsert: true, new: true, setDefaultsOnInsert: true };

        usersModel.findOneAndUpdate(query, update, options, function(err, result) {
            if (err) return res.status(500).json({message: "Couldnt create or update home", data: err});
            if(!result.email) {
                result.email = user['email'];
                result.name = user['name'];
                result.source = user['iss'];
                result.picture = user['picture'];
                result.save(function (err,newUser) {
                    if (err) return res.status(500).json({message: "Couldnt update home", data: err});
                    return res.status(200).json({message: "User created and retrieved", data: newUser});
                });
            }else{
                return res.status(200).json({message: "User retrieved", data: result});
            }
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
    usersModel.find({_id: req.params.userId}, function(err, test) {
        if (err) return res.status(500).json({message: "Find test query failed", data: err});
        return res.status(200).json({message: "User found", data: test});
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
        usersModel.find({unique_id: user['sub']})
            .exec(function (err,userRes){
                if(userRes.permissions >= 3) {
                    usersModel.findOneAndUpdate({_id: req.params.testId}, req.body, {new: true}, function (err, userQ1) {
                        if (err) return res.status(500).json({message: "Save home query failed", data: err});
                        return res.status(200).json({message: ('Admin updated home ' + userQ1.id), data: userQ1});
                    });
                }else{
                    usersModel.findOneAndUpdate({unique_id: user['sub']}, req.body, {new: true}, function (err, userQ2) {
                        if (err) return res.status(500).json({message: "Save home query failed", data: err});
                        return res.status(200).json({message: ('Updated self ' + userQ2.id), data: userQ2});
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
        usersModel.find({unique_id: user['sub']})
            .exec(function (err, userRes) {
                if (userRes[0].permissions >= 3) {
                    console.log(userRes[0].tests);
                    usersModel.findOneAndUpdate({_id: req.params.userId},{$pullAll: {tests: userRes[0].tests}}, function (err, userQ1) {
                        if (err) return res.status(500).json({message: "Find home query failed", data: err});
                        userQ1.remove();
                        return res.status(200).json({message: ('Admin updated home ' + userQ1.id), data: userQ1});
                    });
                } else {
                    return res.status(401).json({message: 'No permission to delete home', data: null});
                }
            });
    });
};

/**
 * /api/users/:userId/tests [GET]
 * List the questions for selected ID
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listTests = function(req, res) {
    usersModel.findById(req.params.userId)
        .exec(function (err, result) {
            testsModel.find({'_id': { $in: result.tests}})
                .exec(function (err,testFindQuery) {
                    if (err) { return res.status(404).json({message: "No tests found", data: err}) }
                    return res.status(200).json({message: 'Questions found', data: testFindQuery});
                });
            if (err) return res.status(500).json({message: "Find tests query failed", data: err});
        });
};

/**
 * /api/users/:userId/results [GET]
 * List the results for the selected home
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listAllResults = function(req, res) {
    usersModel.findById(req.params.userId)
        .exec(function (err, result) {
            resultsModel.find({'_id': { $in: result.results}})
                .sort({date: -1})
                .exec(function (err,resultFindQuery) {
                    if (err) { return res.status(404).json({message: "No tests found", data: err}) }
                    return res.status(200).json({message: 'Results found', data: resultFindQuery});
                });
            if (err) return res.status(500).json({message: "Find results query failed", data: err});
        });
};

/**
 * /api/users/:userId/results/:testId [GET]
 * List the results for the selected home
 * We get all items in users result, then filter them by testId provided
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listTestResults = function(req, res) {
    let testResult = [];
    usersModel.findById(req.params.userId)
        .exec(function (err, result) {
            resultsModel.find({'_id': { $in: result.results},'testId' : req.params.testId})
                .sort({date: -1})
                .exec(function (err,resultFindQuery) {

                    if (err) { return res.status(404).json({message: "No tests found", data: err}) }
                    return res.status(200).json({message: 'Results found', data: resultFindQuery});
                });
            if (err) return res.status(500).json({message: "Find results query failed", data: err});
        });
};
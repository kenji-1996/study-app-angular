/**
 * Created by Kenji on 1/8/2018.
 */
let settings = require('../misc/settings');
let mongoose = require('mongoose');

let testsModel = require('../models/testModel');
let usersModel = require('../models/userModel');
let userTestModel = require('../models/userTestModel');
let submittedTestModel = require('../models/submittedTestModel');
let submittedQuestionModel = require('../models/submittedQuestionModel');

/**
 * /api/users [GET]
 * List ALL users in DB.
 *
 * Currently public, needs to be modified/filters by count (100 per query)!
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
 * Add/Authenticate users (Currently uses only google oauth)
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
                result.userGroups.push('user');
                result.save(function (err,newUser) {
                    if (err) return res.status(500).json({message: "Couldnt save user", data: err});
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
 * Gets limited information about a specific user
 *
 * @param req
 * @param res
 */
exports.listUser = function(req, res) {
    usersModel.find({_id: req.params.userId},'_id name date picture source tests', function(err, test) {
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
                if(userRes.permissions >= 3) { //Admin can update any user
                    usersModel.findOneAndUpdate({_id: req.params.testId}, req.body, {new: true}, function (err, userQ1) {
                        if (err) return res.status(500).json({message: "Save user query failed", data: err});
                        return res.status(200).json({message: ('Admin updated user ' + userQ1.id), data: userQ1});
                    });
                }else{//standard users can only update themselves
                    usersModel.findOneAndUpdate({unique_id: user['sub']}, req.body, {new: true}, function (err, userQ2) {
                        if (err) return res.status(500).json({message: "Save user query failed", data: err});
                        return res.status(200).json({message: ('Updated self ' + userQ2.id), data: userQ2});
                    });
                }
            });
    });
};
/**
 * /api/users/:userId [DELETE]
 * Deletes an inputted if elevated permissions
 * May allow users to delete themselves (what would happen to their questions?)
 * @param req
 * @param res
 */
exports.deleteUser = function(req, res) {
    settings.ensureAuthorized(req,res).then(function (user) {
        if(!user) { return null; }
        usersModel.findOne({unique_id: user['sub']})
            .exec(function (err, userRes) {
                if (userRes.permissions >= 3) {
                    usersModel.findOneAndUpdate({_id: req.params.userId},{$pullAll: [{tests: userRes.authoredTests},{results: userRes.authoredTests}]}, function (err, userQ1) {
                        if (err) return res.status(500).json({message: "Update user query failed", data: err});
                        userQ1.remove();
                        return res.status(200).json({message: ('Admin updated user ' + userQ1.id), data: userQ1});
                    });
                } else {
                    return res.status(401).json({message: 'No permission to delete user', data: null});
                }
            });
    });
};
/**
 * /api/users/:userId/tests [GET]
 * Lists allocated tests for userId
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listAllocatedTests = function(req, res) {
    userTestModel.find({user : req.params.userId})//Get all tests with given user ID
        .populate({path:'test', model:'tests'})
        .exec(function (err,userTests) {
            if (err) { return res.status(500).json({message: "Failed to query allocated tests", data: err}) }
            return res.status(200).json({message: 'Allocated tests successfully retrieved', data: userTests});
        });
};
/**
 * /api/users/:userId/tests [POST]
 * Allocates user to new ID
 *
 * body { testid: '123' }
 *
 * STATUS: Tested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.selfAllocateTest = function(req, res) {
    settings.ensureAuthorized(req,res).then(function (authUser) {
        if (!authUser) {return null;}
        usersModel.findOne({unique_id: authUser['sub']})
            .exec(function (err, user) {
                if (err) return res.status(500).json({message: "Failed to query user", data: err});
                testsModel.findOne({'_id': req.body.testid})
                    .populate({
                        path: 'userTestList',
                        model: 'usertest',
                        match: { user: { $not: req.params.userId} }
                    })
                    .exec(function (err,targetTest) {
                        if(!targetTest) { return res.status(200).json({message: "User is already assigned!", data: null}); }
                        if (err) return res.status(500).json({message: "Failed to find test", data: err});
                        let userTest = new userTestModel({
                            _id: new mongoose.Types.ObjectId(),
                            test: req.body.testid,
                            user: user.id,
                        });
                        userTest.save(function (err) {
                            if (err) return res.status(500).json({message: "Failed to save test", data: err});
                            targetTest.userTestList.push(userTest.id);
                            user.tests.push(targetTest.id);
                            targetTest.save(function(err) {
                                if (err) return res.status(500).json({message: "Failed to save test", data: err});
                                user.save(function(err) {
                                    if (err) return res.status(500).json({message: "Failed to save user", data: err});
                                    return res.status(200).json({message: 'Target user was added to test', data: targetUser});
                                });
                            });
                        });
                    });
            });
    });
};

/**
 * /api/users/:userId/results [POST]
 * A user submits their test answers, an object of submittedTest holding an array of [submittedQuestion]
 *
 * takes argument of userTestModel._id and submittedTestModel object
 *
 * STATUS: Tested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.submitTest = function(req, res) {
    settings.ensureAuthorized(req,res).then(function (authUser) {
        if (!authUser) {return null;}
        usersModel.findOne({unique_id: authUser['sub']})
            .exec(function (err, user) {
                if (req.body.submittedTest && req.body.userTestId) {
                    let subTest = new submittedTestModel({
                        _id: new mongoose.Types.ObjectId(),
                        user: user.id,
                        test: req.body.submittedTest.test,
                    });
                    for(let i = 0; i < req.body.submittedTest.submittedQuestions.length; i++) {
                        let subQuestion = new submittedQuestionModel({
                            _id: new mongoose.Types.ObjectId(),
                            question:  req.body.submittedTest.submittedQuestions[i].question,
                            type:  req.body.submittedTest.submittedQuestions[i].type,
                        });
                        if(req.body.submittedTest.submittedQuestions[i].keywordsAnswer) {
                            subQuestion.keywordsAnswer = req.body.submittedTest.submittedQuestions[i].keywordsAnswer;
                        }
                        if(req.body.submittedTest.submittedQuestions[i].choicesAnswer) {
                            subQuestion.choicesAnswer = req.body.submittedTest.submittedQuestions[i].choicesAnswer;
                        }
                        if(req.body.submittedTest.submittedQuestions[i].arrangement) {
                            subQuestion.arrangement = req.body.submittedTest.submittedQuestions[i].arrangement;
                        }
                        if(req.body.submittedTest.submittedQuestions[i].shortAnswer) {
                            subQuestion.shortAnswer = req.body.submittedTest.submittedQuestions[i].shortAnswer;
                        }
                        subQuestion.save(function (err) {
                            if (err) return res.status(500).json({message: "Submitted question saving failed", data: err});
                            subTest.submittedQuestions.push(subQuestion.id);
                        });
                    }
                    subTest.save(function (err) {
                        if (err) return res.status(500).json({message: "Submitted test saving failed", data: err});
                        userTestModel.findOne({_id: req.body.userTestId})
                            .exec(function (err,userTest) {
                                userTest.submittedTests.push(subTest.id);
                                userTest.save(function (err, result) {
                                    if (err) return res.status(500).json({message: "User test failed", data: err});
                                    user.results.push(userTest.id);
                                    user.save(function (err) {
                                        if (err) return res.status(500).json({message: "User save failed", data: err});
                                        return res.status(200).json({message: "Submitted test added successfully", data: result});
                                    });

                            });
                        });
                    });
                } else {
                    return res.status(400).json({message: "Providing submittedTest and user test id is required", data: null});
                }
            });
    });
};

/**
 * /api/users/:userId/results [GET]
 * List all results for selected user
 * Show submitted tests? (Currently dont)
 *
 * Authentication?
 *
 * STATUS: Untested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listAllTestResults = function(req, res) {
    userTestModel.find({'user': req.params.userId})
        .populate({path:'test', model: 'tests'})
        .sort({date: -1})
        .exec(function (err,resultsArray) {
            if (err) { return res.status(404).json({message: "No tests found", data: err}) }
            return res.status(200).json({message: 'Results found', data: resultsArray});
        });
};
/**
 * /api/users/:userId/results/:testId [GET]
 * List the results for the selected user and selected test
 *
 * STATUS: Tested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listTestResults = function(req, res) {
    userTestModel.findOne({user: req.params.userId, test: req.params.testId})
        .populate({path:'submittedTests', model:'submittedtest', populate: {path: 'submittedQuestions', model: 'submittedquestion'}})
        .sort({date: -1})
        .exec(function (err,resultsArray) {
            if (err) { return res.status(404).json({message: "No tests found", data: err}) }
            return res.status(200).json({message: 'Results found', data: resultsArray});
        });
};

//---------------------------------------------------------Authored restful API here --------------------------------------
/**
 * /api/users/:userId/authored [GET]
 * List all authored tests assigned/created by user
 *
 * STATUS: Tested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listAllAuthoredTests = function(req, res) {
    testsModel.find({'authors': req.params.userId})
        .populate({
            path:'userTestList', model: 'usertest',
                populate: [{ path: 'test', model: 'submittedtest', }, { path: 'user', model: 'users', select: 'name' }]
            })
        .sort({date: -1})
        .exec(function (err,resultsArray) {
            if (err) { return res.status(404).json({message: "No tests found", data: err}) }
            return res.status(200).json({message: 'Results found', data: resultsArray});
        });
};

/**
 * /api/users/:userId/authored [POST]
 * Allocates user to new ID, can only be done by someone with certain usergroups or overall > 3 permissions.
 *
 * body { testid: '123' }
 *
 * STATUS: Tested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.authorAssigned = function(req, res) {
    settings.ensureAuthorized(req,res).then(function (authUser) {
        if (!authUser) {return null;}
        usersModel.findOne({unique_id: authUser['sub']})
            .exec(function (err, user) {
                if (err) return res.status(500).json({message: "Failed to query user", data: err});
                testsModel.findOne({'_id': req.body.testid,'authors': user._id})
                    .populate({
                        path: 'userTestList',
                        model: 'usertest',
                        match: { user: { $not: req.params.userId} }
                    })
                    .exec(function (err,targetTest) {
                        if (!targetTest) { return res.status(200).json({message: "User is already assigned!", data: null}); }
                        if (err) return res.status(400).json({message: "Not a valid author or test", data: err});
                        usersModel.findOne({_id: req.params.userId})
                            .exec(function(err,targetUser) {
                                if (err) return res.status(400).json({message: "Not a valid user", data: err});
                                //TODO: Work out usergroups and their roles/permissions
                                if((user.organization === targetUser.organization && (user.userGroup === 'staff')) || user.permissions > 3) {
                                    let userTest = new userTestModel({
                                        _id: new mongoose.Types.ObjectId(),
                                        test: req.body.testid,
                                        user: targetUser.id,
                                    });
                                    userTest.save(function (err) {
                                        if (err) return res.status(500).json({message: "Failed to save test", data: err});
                                        targetTest.userTestList.push(userTest.id);
                                        targetUser.tests.push(targetTest.id);
                                        targetTest.save(function(err) {
                                            if (err) return res.status(500).json({message: "Failed to save test", data: err});
                                            targetUser.save(function(err) {
                                                if (err) return res.status(500).json({message: "Failed to save user", data: err});
                                                return res.status(200).json({message: 'Target user was added to test', data: targetUser});
                                            });
                                        });
                                    });

                                }else{
                                    return res.status(401).json({message: "Not allowed to assign this test to this user", data: null});
                                }
                            });
                    });
            });
    });
};
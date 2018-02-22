/**
 * Created by Kenji on 1/8/2018.
 */
let settings = require('../misc/settings');
let mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
let config = require('../misc/config');
global.atob = require("atob");

let testsModel = require('../models/testModel');
let usersModel = require('../models/userModel');
let userTestModel = require('../models/userTestModel');
let submittedTestModel = require('../models/submittedTestModel');
let submittedQuestionModel = require('../models/submittedQuestionModel');
let selfAllocatedTestModel = require('../models/selfAllocatedTest');

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
        if(req.body.picture) user.picture = req.body.picture;
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

/**
 * /api/users/:userId [GET]
 * Gets limited information about a specific user, only gets self
 *
 * @param req
 * @param res
 */
exports.listUser = function(req, res) {
    usersModel.findOne({_id: req.user._id})
        .exec(function (err,user) {
            if (err) return res.status(500).json({message: "Find user query failed", data: err});
            return res.status(200).json({message: "Authenticated user found", data: user});
        });
};
/**
 * /api/users/:userId [PUT]
 * Update the user with whatever is supplied in req.body
 *
 * TODO: update so only specific fields can be updated (I.E. not auth)
 * @param req
 * @param res
 */
exports.updateUser = function(req, res) {
    usersModel.find({_id: req.user._id})
        .exec(function (err,userRes){
            usersModel.findOneAndUpdate({unique_id: req.user._id}, req.body, {new: true}, function (err, userQ2) {
                if (err) return res.status(500).json({message: "Save user query failed", data: err});
                return res.status(200).json({message: ('Updated self ' + userQ2.id), data: userQ2});
            });
        });
};
/**
 * /api/users/:userId [DELETE]
 * Deletes an inputted if elevated permissions
 *
 * TODO: Figure out best way to manage their assets if they wish to delete (soft delete?)
 * @param req
 * @param res
 */
exports.deleteUser = function(req, res) {
    usersModel.findOne({_id: req.user._id})
        .exec(function (err, userRes) {
            usersModel.findOneAndUpdate({_id: req.user._id}, function (err, userQ1) {
                if (err) return res.status(500).json({message: "Update user query failed", data: err});
                userQ1.remove();
                return res.status(200).json({message: ('Admin updated user ' + userQ1.id), data: userQ1});
            });
        });
};


/**
 * /api/users/:userId/self [GET]
 * Lists allocated tests for userId
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listSelfAllocatedTests = function(req, res) {
    let pageInput = req.query.page? Number.parseInt(req.query.page) : 1;
    let limitInput = req.query.limit? Number.parseInt(req.query.limit) : 2;
    let sortInput = req.query.sort? req.query.sort : "-date";
    selfAllocatedTestModel.paginate({user: req.params.userId},
        {
            page: pageInput,
            limit: limitInput,
            sort: sortInput,
            populate: [
                {path:'test', match: req.query.search? { "title" : { $regex: req.query.search,$options: 'i' } } : {}},
            ],
        },
        function(err, result) {
            if (err) return res.status(500).json({message: "Find allocated tests query failed", data: err});
            return res.status(200).json({message: "Tests retrieved", data: result});
        });
};
/**
 * /api/users/:userId/self [POST]
 * Allocates user to new ID
 *
 * body { testid: '123' }
 *
 * STATUS: Untested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.selfAllocateTest = function(req, res) {
    usersModel.findOne({_id: req.user._id})
        .exec(function (err, user) {
            if (err) return res.status(401).json({message: "Not a registered user", data: err});
            testsModel.findOne({_id: req.body.testid})
                .exec(function (err, testRes) {
                    let userTest = new selfAllocatedTestModel({
                        _id: new mongoose.Types.ObjectId(),
                        test: testRes._id,
                        user: user._id,
                    });
                    selfAllocatedTestModel.create(userTest, function (err, userTestRes) {
                        if (err) return res.status(400).json({message: "Cannot allocate a test you already have!", data: err});
                        //TODO: decide if the test should hold this data
                        testRes.selfAllocatedTestList.push(userTestRes.id);
                        testRes.save(function (err, testSave) {
                            if (err) return res.status(500).json({
                                message: "Failed to update user test list of provided test",
                                data: err
                            });
                            return res.status(200).json({message: 'Self allocated successful', data: user});
                        });
                    });

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
    let pageInput = req.query.page? Number.parseInt(req.query.page) : 1;
    let limitInput = req.query.limit? Number.parseInt(req.query.limit) : 2;
    let sortInput = req.query.sort? req.query.sort : "-date";
    userTestModel.paginate({user: req.params.userId},
        {
            page: pageInput,
            limit: limitInput,
            sort: sortInput,
            populate: [
                {
                    path:'test',
                    match: req.query.search? { "title" : { $regex: req.query.search,$options: 'i' } } : {}
                }]
        },
        function(err, result) {
            if (err) return res.status(500).json({message: "Find allocated tests query failed", data: err});
            return res.status(200).json({message: "Tests retrieved", data: result});
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
    testsModel.findOne({_id:req.body.submittedTest.test })
        .populate('questions')
        .exec(function (err,tempTest) {
            if(tempTest.locked) {
                return res.status(400).json({message: "Test is locked, user cannot submit a new attempt", data: null});
            }else if((tempTest.expire && Date.now() > new Date(tempTest.expireDate).getTime())) {
                return res.status(400).json({message: "Test has expired", data: null});
            }else{
                let handMarked = false;
                usersModel.findOne({_id: req.user._id})
                    .exec(function (err, user) {
                        if (req.body.submittedTest && req.body.userTestId) {
                            let subTest = new submittedTestModel({
                                _id: new mongoose.Types.ObjectId(),
                                user: user.id,
                                test: req.body.submittedTest.test,
                            });
                            for(let i = 0; i < req.body.submittedTest.submittedQuestions.length; i++) {
                                if(tempTest.questions[i].handMarked) {
                                    handMarked = true;
                                }
                                let subQuestion = new submittedQuestionModel({
                                    _id: new mongoose.Types.ObjectId(),
                                    question:  req.body.submittedTest.submittedQuestions[i]._id,
                                    type:  req.body.submittedTest.submittedQuestions[i].type,
                                });
                                let calculatedMark = 0;
                                switch (req.body.submittedTest.submittedQuestions[i].type) {
                                    case "keywords":
                                        calculatedMark = settings.keywordContains(tempTest.questions[i].keywordsAnswer, req.body.submittedTest.submittedQuestions[i].keywordsAnswer);
                                        subQuestion.mark = tempTest.questions[i].handMarked? 0 : calculatedMark;
                                        subTest.obtainedMark += calculatedMark;
                                        subQuestion.keywordsAnswer = req.body.submittedTest.submittedQuestions[i].keywordsAnswer;
                                        break;
                                    case "choices":
                                        calculatedMark = settings.correctChoices(tempTest.questions[i].choicesAnswer, req.body.submittedTest.submittedQuestions[i].choicesAnswer, tempTest.questions[i].choicesAnswer.length);
                                        subQuestion.mark = tempTest.questions[i].handMarked? 0 : calculatedMark;
                                        subTest.obtainedMark += calculatedMark;
                                        subQuestion.choicesAnswer = req.body.submittedTest.submittedQuestions[i].choicesAnswer;
                                        break;
                                    case "arrangement":
                                        calculatedMark = settings.arrangeOrderCount(tempTest.questions[i].arrangement,req.body.submittedTest.submittedQuestions[i].arrangement);
                                        subQuestion.mark = tempTest.questions[i].handMarked? 0 : calculatedMark;
                                        subTest.obtainedMark += calculatedMark;
                                        subQuestion.arrangement = req.body.submittedTest.submittedQuestions[i].arrangement;
                                        break;
                                    case "shortAnswer":
                                        subQuestion.mark = tempTest.questions[i].handMarked? 0 : calculatedMark;
                                        subQuestion.shortAnswer = req.body.submittedTest.submittedQuestions[i].shortAnswer;
                                        break;
                                    default:
                                }
                                subQuestion.save(function (err) {
                                    if (err) return res.status(500).json({message: "Submitted question saving failed", data: err});
                                });
                                subTest.submittedQuestions.push(subQuestion._id);
                            }
                            if(handMarked) {
                                //TODO: Notify to author that this overrides individual settings
                                subTest.obtainedMark = 0;
                            }
                            subTest.save(function (err) {
                                if (err) return res.status(500).json({message: "Submitted test saving failed", data: err});
                                userTestModel.findOne({_id: req.body.userTestId})
                                    .exec(function (err, userTest) {
                                        if(userTest.finalMark && subTest.obtainedMark >= userTest.finalMark) {
                                            userTest.finalMark = subTest.obtainedMark;
                                        }else if(!userTest.finalMark) {
                                            userTest.finalMark = subTest.obtainedMark;
                                        }
                                        userTest.submittedTests.push(subTest.id);
                                        userTest.save(function (err, result) {
                                            if (err) return res.status(500).json({message: "User test failed", data: err});
                                            return res.status(200).json({message: "Submitted test added successfully", data: result});

                                        });
                                    });
                            });
                        } else {
                            return res.status(400).json({message: "Providing submittedTest and user test id is required", data: null});
                        }
                    });
            }
        });
};

/**
 * /api/users/:userId/results [GET]
 * List all results for selected user
 * Show submitted tests? (Currently dont)
 *
 * TODO: Change to paginate?
 *
 * STATUS: Untested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listAllUserTests = function(req, res) {
    userTestModel.find({'user' : req.params.userId})
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
    let pageInput = req.query.page? Number.parseInt(req.query.page) : 1;
    let limitInput = req.query.limit? Number.parseInt(req.query.limit) : 2;
    let sortInput = req.query.sort? req.query.sort : "-date";
    testsModel.paginate(req.query.search? { authors: req.params.userId ,"title": { $regex: req.query.search,$options: 'i' } } : {authors: req.params.userId },
        {
            page: pageInput,
            limit: limitInput,
            sort: sortInput,
            populate: [
                {
                    path:'userTestList', model: 'usertests',
                    populate: { path: 'user', model: 'users', select: 'name' },
                }]
        },
        function(err, result) {
            if (err) return res.status(500).json({message: "Find allocated tests query failed", data: err});
            return res.status(200).json({message: "Tests retrieved", data: result});
        });
    /*testsModel.find({authors: req.params.userId})
     .populate({
     path:'userTestList', model: 'usertests',
     populate: { path: 'user', model: 'users', select: 'name' }//[{ path: 'test', model: 'submittedtest', },
     })
     .sort({date: -1})
     .exec(function (err,resultsArray) {
     if (err) { return res.status(404).json({message: "No tests found", data: err}) }
     return res.status(200).json({message: 'Results found', data: resultsArray});
     });*/
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
    usersModel.findOne({_id: req.user._id})
        .exec(function (err, user) {
            if (err) return res.status(401).json({message: "Not a registered user", data: err});
            usersModel.findOne({_id: req.params.userId})
                .exec(function (err,targetUser) {
                    if (err) return res.status(401).json({message: "Not a valid user", data: err});
                    testsModel.findOne({_id: req.body.testid, authors: user._id})
                        .populate({
                            path:'userTestList',
                            model: 'usertests',
                            match: { user: targetUser._id },
                        })
                        .exec(function (err,testCheck) {
                            if (err) return res.status(400).json({message: "Failed to check test for user", data: err});
                            let staff = user.permissions > 3;
                            let orgStaff = (user.organization === targetUser.organization && user.userGroup === 'staff');
                            if((orgStaff || staff) && testCheck.userTestList.length === 0) {
                                testsModel.findOne({_id: req.body.testid, authors: user._id})
                                    .exec(function (err,testRes) {
                                        let userTest = new userTestModel({
                                            _id: new mongoose.Types.ObjectId(),
                                            test: testRes._id,
                                            user: targetUser._id,
                                        });
                                        userTestModel.create(userTest, function (err, userTestRes) {
                                            if (err) return res.status(400).json({message: "Failed to create new user test", data: err});
                                            testRes.userTestList.push(userTestRes.id);
                                            testRes.save(function (err,testSave) {
                                                if (err) return res.status(500).json({message: "Failed to update user test list of provided test", data: err});
                                                return res.status(200).json({message: 'New user was allocated this test', data: user});
                                            });
                                        });

                                    });
                            }else{
                                return res.status(400).json({message: "You dont have permission to assign this user or they are already assigned", data: null});
                            }
                        });
                });
        });
};

/**
 * /api/users/:userId/authored/:testId/:targetUserId [DELETE]
 * Deletes an allocated user, author can remove whoever whenever
 *
 *
 * STATUS: Tested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.removeAssignedTest = function(req,res) {
    usersModel.findOne({_id: req.user._id})
        .exec(function (err, user) {
            if (err) return res.status(401).json({message: "Not a registered user", data: err});
            testsModel.findOne({_id: req.params.testId,authors: user._id})
                .exec(function (err, testFound) {
                    if (err) return res.status(500).json({message: "Failed to remove user test from test", data: err});
                    userTestModel.findOneAndRemove({test: testFound._id, _id: req.params.targetUserId})
                        .exec(function (err,userTest) {
                            if(userTest) { userTest.remove(); }
                            if (err) return res.status(500).json({message: "Failed to remove user test from test", data: err});
                            return res.status(200).json({message: 'usertest was removed', data: userTest});
                        });
                })
        });
};

//--------------------------------- Self Assigned ------------------------ /api/users/userId/tests/self

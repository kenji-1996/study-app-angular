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
let selfAllocatedTestModel = require('../models/selfAllocatedTest');

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
    let pageInput = req.query.page? Number.parseInt(req.query.page) : 1;
    let limitInput = req.query.limit? Number.parseInt(req.query.limit) : 2;
    let sortInput = req.query.sort? req.query.sort : "-date";
    usersModel.paginate(
        req.query.search? { "name": { $regex: req.query.search,$options: 'i' } } : {}, { page: pageInput, limit: limitInput, sort: sortInput},
        function(err, result) {
            if (err) return res.status(500).json({message: "Find tests query failed", data: err});
            return res.status(200).json({message: "Tests retrieved", data: result});
            // result.docs
            // result.total
            // result.limit - 10
            // result.page - 3
            // result.pages
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
    settings.checkAuth(req).then(function (authUser) {
        if (!authUser) {
            usersModel.findOne({_id: req.params.userId},'_id name date picture source organizations')
                .exec( function(err, user) {
                    if (err) return res.status(500).json({message: "Find user query failed", data: err});
                    if(user) {
                        return res.status(200).json({message: "User found", data: user});
                    }else{
                        return res.status(200).json({message: "Invalid ID or no user found", data: user});
                    }
                });
        }else{
            usersModel.findOne({unique_id: authUser['sub']})
                .exec(function (err,user) {
                    if (err) return res.status(500).json({message: "Find user query failed", data: err});
                    return res.status(200).json({message: "Authenticated user found", data: user});
                });
        }
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
 * /api/users/:userId/selftests [POST]
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
    settings.ensureAuthorized(req,res).then(function (authUser) {
        if (!authUser) {return null;}
        usersModel.findOne({unique_id: authUser['sub']})
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
    settings.ensureAuthorized(req,res).then(function (authUser) {
        if (!authUser) {return null;}
        testsModel.findOne({_id:req.body.submittedTest.test })
            .populate('questions')
            .exec(function (err,tempTest) {
                if(tempTest.locked) {
                    return res.status(400).json({message: "Test is locked, user cannot submit a new attempt", data: null});
                }else if((tempTest.expire && Date.now() > new Date(tempTest.expireDate).getTime())) {
                    return res.status(400).json({message: "Test has expired", data: null});
                }else{
                    usersModel.findOne({unique_id: authUser['sub']})
                        .exec(function (err, user) {
                            if (req.body.submittedTest && req.body.userTestId) {
                                let subTest = new submittedTestModel({
                                    _id: new mongoose.Types.ObjectId(),
                                    user: user.id,
                                    test: req.body.submittedTest.test,
                                });
                                obtainedMark = 0;
                                marksAvailable = 0;
                                for(let i = 0; i < req.body.submittedTest.submittedQuestions.length; i++) {
                                    let subQuestion = new submittedQuestionModel({
                                        _id: new mongoose.Types.ObjectId(),
                                        question:  req.body.submittedTest.submittedQuestions[i]._id,
                                        type:  req.body.submittedTest.submittedQuestions[i].type,
                                    });
                                    if(!tempTest.handMarked) {
                                        let calculatedMark = 0;
                                        switch (req.body.submittedTest.submittedQuestions[i].type) {
                                            case "keywords":
                                                calculatedMark = settings.keywordContains(tempTest.questions[i].keywordsAnswer, req.body.submittedTest.submittedQuestions[i].keywordsAnswer);
                                                subQuestion.mark = calculatedMark;
                                                obtainedMark += calculatedMark;
                                                marksAvailable += tempTest.questions[i].keywordsAnswer.length;
                                                break;
                                            case "choices":
                                                calculatedMark =settings.correctChoices(tempTest.questions[i].choicesAnswer, req.body.submittedTest.submittedQuestions[i].choicesAnswer, tempTest.questions[i].choicesAnswer.length);
                                                subQuestion.mark = calculatedMark;
                                                obtainedMark += calculatedMark;
                                                marksAvailable += tempTest.questions[i].choicesAnswer.length;
                                                break;
                                            case "arrangement":
                                                calculatedMark = settings.arrangeOrderCount(tempTest.questions[i].arrangement,req.body.submittedTest.submittedQuestions[i].arrangement);
                                                subQuestion.mark = calculatedMark;
                                                obtainedMark += calculatedMark;
                                                marksAvailable += req.body.submittedTest.submittedQuestions[i].arrangement.length;
                                                break;
                                            case "shortAnswer":
                                                break;
                                            default://If no type is set, break
                                                console.log('incorrect answer format ' + subTest.submittedQuestions[i].type);
                                            //return res.status(400).json({message: "Must provide type, 'keywords','choices','arrangement' and 'shortAnswer' are currently only accepted", data: req.body.questions});
                                        }
                                    }
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
                                    });
                                    subTest.submittedQuestions.push(subQuestion._id);
                                }
                                if(!tempTest.handMarked) {
                                    subTest.obtainedMark = obtainedMark;
                                    subTest.marksAvailable = marksAvailable;
                                }
                                subTest.save(function (err) {
                                    if (err) return res.status(500).json({message: "Submitted test saving failed", data: err});
                                    userTestModel.findOne({_id: req.body.userTestId})
                                        .exec(function (err, userTest) {
                                            userTest.marksAvailable = subTest.marksAvailable;
                                            if(!tempTest.handMarked) {
                                                if(userTest.finalMark && subTest.obtainedMark >= userTest.finalMark) {
                                                    userTest.finalMark = subTest.obtainedMark;
                                                }else if(!userTest.finalMark) {
                                                    userTest.finalMark = subTest.obtainedMark;
                                                }
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
    settings.ensureAuthorized(req,res).then(function (authUser) {
        if (!authUser) {return null;}
        usersModel.findOne({unique_id: authUser['sub']})
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
    settings.ensureAuthorized(req,res).then(function (authUser) {
        if (!authUser) {return null;}
        usersModel.findOne({unique_id: authUser['sub']})
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
    });
};

//--------------------------------- Self Assigned ------------------------ /api/users/userId/tests/self
/**
 * /api/users/:userId/tests [GET]
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
            var index;
            //Hacky way to remove query results from pop search

            return res.status(200).json({message: "Tests retrieved", data: result});
            // result.docs
            // result.total
            // result.limit - 10
            // result.page - 3
            // result.pages
        });
};

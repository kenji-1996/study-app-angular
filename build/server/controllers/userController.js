/**
 * Created by Kenji on 1/8/2018.
 */
let settings = require('../misc/settings');

let testsModel = require('../models/testModel');
let usersModel = require('../models/userModel');
let userTestModel = require('../models/userTestModel');
let submittedTestModel = require('../models/submittedTestModel');

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
                    usersModel.findOneAndUpdate({_id: req.params.userId},{$pullAll: {tests: userRes.tests}}, function (err, userQ1) {
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
    userTestModel.find({userId : req.params.userId})//Get all tests with given user ID
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
 * Only can add to self at the moment, will add usergroup/permissions/organization to allow outside allocation
 * When a test is allocated, create resultSchema?
 *
 * body { testid: '123' }
 *
 * STATUS: Untested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.addAllocatedTest = function(req, res) {
    settings.ensureAuthorized(req,res).then(function (authUser) {
        if (!authUser) {return null;}
        usersModel.findOne({unique_id: authUser['sub']})
            .exec(function (err, user) {
                if (err) return res.status(500).json({message: "Failed to query user", data: err});
                user.tests.push(req.body.testid);
                testsModel.findOne({'_id': req.body.testid})
                    .exec(function (err, testFindQuery) {
                        if (err) return res.status(500).json({message: "Failed to find test", data: err});
                        return res.status(200).json({message: 'Test allocated to user', data: testFindQuery});
                    });

            });
    });
};
/**
 * /api/users/:userId/results [POST]
 * A user submits their test answers, an object of submittedTest holding an array of [submittedQuestion]
 *
 * STATUS: Untested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.submitTest = function(req, res) {
    return res.status(200).json({message: 'Work in progress, please check userController.js and impliment', data: null});
    settings.ensureAuthorized(req,res).then(function (user) {
        if(!user) { return null; }
        usersModel.findOne({unique_id: user['sub']}, function (err, user) {//User can only submit to themselves
            if (err) return res.status(404).json({message: "User not found/Valid", data: err});
            if (req.body.test) {
                //Info inside new model is required!
                let test = new submittedTestModel({
                    _id: new mongoose.Types.ObjectId(),
                    //target test ID (must be valid) - Get test settings from here
                    testId: {type:String, required: true}, //Points to parent because there can only be one test it references, One(Test) -> Many[submittedTest]
                    //Who submitted it
                    userId: {type:String, required: true},
                    //submittedQuestions ID array
                    submittedQuestions: [String],
                    //Date submitted
                    dateSubmitted: { type: Date, default: Date.now },
                    //Result-related, mark saved if not manually marked by human
                    mark: Number,
                    //Feedback only shown if it contains something, can only be submitted by a marker/author
                    feedback: String,
                });
                //Settings, only set if posted.
                if(req.body.test.expire) {test.expire = req.body.test.expire; }
                if(req.body.test.expireDate) {test.expireDate = req.body.test.expireDate; }//Date.now type date
                if(req.body.test.handMarked) {test.handMarked = req.body.test.handMarked; }
                if(req.body.test.private) {test.private = req.body.test.private; }
                if(req.body.test.showMarks) {test.showMarks = req.body.test.showMarks; }
                if(req.body.test.attemptsAllowed) {test.attemptsAllowed = req.body.test.attemptsAllowed; }
                if(req.body.test.currentAttempts) {test.currentAttempts = req.body.test.currentAttempts; }
                if(req.body.test.userEditable) {test.userEditable = req.body.test.userEditable; }
                if(req.body.test.shareable) {test.shareable = req.body.test.shareable; }
                if(req.body.test.hintAllowed) {test.hintAllowed = req.body.test.hintAllowed; }

                test.save(function (err, result) {
                    if (err) return res.status(500).json({message: "Save test query failed", data: null});
                    user.tests.push(test.id);
                    user.authoredTests.push(test.id);
                    user.save(function (err) {
                        if (err) return res.status(500).json({message: "Save user query failed", data: null});
                    });
                    return res.status(200).json({message: "Test generated successfully", data: result});
                });
            }else{
                return res.status(400).json({message: "Bad request, req.body.test required", data: null});
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
    usersModel.findById(req.params.userId)
        .exec(function (err, user) {
            userTestModel.find({'_id': { $in: user.results}})
                .sort({date: -1})
                .exec(function (err,resultsArray) {
                    if (err) { return res.status(404).json({message: "No tests found", data: err}) }
                    let newResult = resultsArray;
                    //Get and modify result depending on settings
                    for(let i = 0; i < newResult.length;i++) {
                        //Get parent test for each item to check for settings
                        testsModel.findOne({'_id': newResult[i].testId})
                            .exec(function (err,parentTest) {
                                if (err) { return res.status(500).json({message: "Failed to get parent test", data: err}) }
                                if(!parentTest.showMarks) { newResult[i].finalMark = 'hidden'; }
                                if (!newResult[i].showMarker) { newResult[i].markerId = null; }
                            });
                    }
                    return res.status(200).json({message: 'Results found', data: newResult});
                });
            if (err) return res.status(500).json({message: "Find results query failed", data: err});
        });
};

/**
 * /api/users/:userId/results/:testId [GET]
 * List the results for the selected home
 * We get all items in users result, then filter them by testId provided
 *
 * STATUS: Untested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listTestResults = function(req, res) {
    usersModel.findById(req.params.userId)
        .exec(function (err, user) {
            userTestModel.findOne({'testId': req.params.testId})
                .sort({date: -1})
                .exec(function (err,result) {
                    if (err) { return res.status(404).json({message: "No tests found", data: err}) }
                    if(result) {
                        let newResult = result;
                        testsModel.findOne({'_id': newResult.testId})
                            .exec(function (err, parentTest) {
                                if (err) { return res.status(500).json({message: "Failed to get parent test", data: err}) }
                                if (!parentTest.showMarks) { newResult.finalMark = 'hidden'; }
                                if (!newResult.showMarker) { newResult.markerId = null; }
                            });
                        return res.status(200).json({message: 'Results found', data: newResult});
                    }else{
                        return res.status(500).json({message: "Result was null", data: err});
                    }
                });
            if (err) return res.status(500).json({message: "Find results query failed", data: err});
        });
};

/**
 * /api/users/:userId/tests/submitted [GET]
 * List all submitted tests by standard user
 * Only the user and the test author can see this.
 *
 * Group by target test? Show these on result query?
 *
 * STATUS: Untested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listAllSubmittedTests = function(req, res) {
    /*settings.ensureAuthorized(req,res).then(function (authUser) {
     if (!authUser) { return null; }
     usersModel.findOne({unique_id: authUser['sub']})
     .exec(function (err, user) {
     submittedTestModel.find({'_id': {$in: user.submittedTests}})//In searches through the array
     .sort({date: -1})
     .exec(function (err, submittedTestArray) {
     if (err) { return res.status(404).json({message: "No tests found", data: err}) }
     for(let i = 0; i < submittedTestArray.length; i++) {
     testsModel.findOne({'_id': submittedTestArray[i].testId})//Settings here for creating a test
     .exec(function (err, originalTest) {
     let marked = originalTest.marked;
     let showResult = originalTest.showMarks;

     });
     }
     //Show questions? doesnt currently
     return res.status(200).json({message: 'Results found', data: submittedTestArray});
     });
     if (err) return res.status(500).json({message: "Find results query failed", data: err});
     });
     });*/
    return res.status(404).json({message: "Work in progress", data: null});
};
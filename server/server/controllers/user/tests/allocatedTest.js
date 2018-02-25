let mongoose = require('mongoose');
let settings = require('../../../misc/settings');

let usersModel = require('../../../models/userModel');
let testsModel = require('../../../models/test/testModel');
let userTestModel = require('../../../models/test/userTestModel');
let submittedQuestionModel = require('../../../models/test/submittedQuestionModel');
let submittedTestModel = require('../../../models/test/submittedTestModel');

/**
* /api/users/:userId/tests/allocated [GET]
* Lists allocated tests for userId
 *
* @param req
* @param res
* @return JSON {message,data}
*/
exports.listTests = function(req, res) {
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
 * /api/users/:userId/tests/allocated [POST]
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
    testsModel.findOne({_id: req.body.submittedTest.test })
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
 * /api/users/:userId/tests/allocated/:testId [DELETE]
 * If the test settings allow, a user can remove the allocated test
 *
 * @param req
 * @param res
 */
exports.removeTest = function(req,res) {
    usersModel.findOne({_id: req.user._id})
        .exec(function (err, user) {
            if (err) return res.status(401).json({message: "Not a registered user", data: err});
            testsModel.findOne({_id: req.params.testId})
                .exec(function (err, testFound) {
                    if (err) return res.status(500).json({message: "Failed to remove user test from test", data: err});
                    if (!testFound) return res.status(404).json({message: "No test found", data: null});
                    if(testFound.canSelfRemove) {
                        userTestModel.findOneAndRemove({test: testFound._id, user: user._id, })
                            .exec(function (err,allocatedTest) {
                                if(allocatedTest) {
                                    allocatedTest.remove();
                                }
                                if (err) return res.status(500).json({message: "Failed to remove allocated test", data: err});
                                return res.status(200).json({message: 'allocated test was removed', data: allocatedTest});
                            });
                    }else{
                        return res.status(403/*forbidden*/).json({message: 'Test settings dont allow self removing', data: null});
                    }
                })
        });
};

/**
 * /api/users/:userId/tests/allocated/results [GET]
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
exports.listAllResults = function(req, res) {
    userTestModel.find({'user' : req.params.userId})
        .populate({path:'test', model: 'tests'})
        .sort({date: -1})
        .exec(function (err,resultsArray) {
            if (err) { return res.status(404).json({message: "No tests found", data: err}) }
            return res.status(200).json({message: 'Results found', data: resultsArray});
        });
};

/**
 * /api/users/:userId/tests/allocated/results/:testId [GET]
 * List the results for the selected user and selected test
 *
 * STATUS: Tested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listResults = function(req, res) {
    userTestModel.findOne({user: req.params.userId, test: req.params.testId})
        .populate({path:'submittedTests', model:'submittedtest', populate: {path: 'submittedQuestions', model: 'submittedquestion'}})
        .sort({date: -1})
        .exec(function (err,resultsArray) {
            if (err) { return res.status(404).json({message: "No tests found", data: err}) }
            return res.status(200).json({message: 'Results found', data: resultsArray});
        });
};
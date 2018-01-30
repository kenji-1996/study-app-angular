/**
 * Created by Kenji on 1/8/2018.
 */
let settings = require('../misc/settings');
let mongoose = require('mongoose');
let testsModel = require('../models/testModel');
let usersModel = require('../models/userModel');
let userTestModel = require('../models/userTestModel');
let questionsModel = require('../models/questionModel');

/**
 * /api/tests [GET]
 * List ALL testsModel in DB.
 * {'test.private': false} --> Argument for only showing public testsModel
 *
 * Note ->Need to control results outputted into pages, probably by 100 seperating.
 * Note ->Might need to hide this behind checks/fully
 *
 * STATUS: Untested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listTests = function(req, res) {
    try {
        testsModel.find({}, function(err, tests) {
            if (err) return res.status(500).json({message: "Find test query failed", data: err});

            return res.status(200).json({message: "Tests retrieved", data: tests});
        });
    } catch (err) {
        return res.status(500).json({message: "Something went wrong fetching all tests", data: err});
    }
};
/**
 * /api/tests [POST]
 * A home can add a test to their home if authorised (req.body.test object required example: "test": { "id": 0, "name": "Diana Faulkner"} )
 *
 * STATUS: Untested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.createTest = function(req, res) {
    try {
        settings.ensureAuthorized(req,res).then(function (user) {
            if(!user) { return null; }
            usersModel.findOne({unique_id: user['sub']}, function (err, user) {
                if (err) return res.status(404).json({message: "User not found/Valid", data: err});
                if (req.body.test) {
                    //Info inside new model is required!
                    let test = new testsModel({
                        _id: new mongoose.Types.ObjectId(),
                        title: req.body.test.title,
                        category: req.body.test.category,
                        authors: req.body.test.authors,
                        //In future accept array of userIds, displayed as friends on UI
                    });
                    if(req.body.test.hintAllowed) { test.hintAllowed = true; }
                    if(req.body.test.expire) {test.expire = req.body.test.expire; }
                    if(req.body.test.expireDate) {test.expireDate = req.body.test.expireDate; }//Date.now type date
                    if(req.body.test.handMarked) {test.handMarked = req.body.test.handMarked; }
                    if(req.body.test.showMarks) {test.showMarks = req.body.test.showMarks; }
                    if(req.body.test.attemptsAllowed) {test.attemptsAllowed = req.body.test.attemptsAllowed; }
                    if(req.body.test.userEditable) {test.userEditable = req.body.test.userEditable; }
                    if(req.body.test.shareable) {test.shareable = req.body.test.shareable; }
                    if(req.body.test.private) {test.private = req.body.test.private; }
                    if(req.body.test.hintAllowed) {test.hintAllowed = req.body.test.hintAllowed; }
                    if(req.body.test.showMarker) {test.showMarker = req.body.test.showMarker; }
                    if(req.body.test.canSelfRemove) {test.canSelfRemove = req.body.test.canSelfRemove; }
                    if(req.body.test.markDate) { test.markDate = req.body.test.markDate; }
                    if(req.body.test.questions) {
                        test.questions = [];
                        let providedQuestions = req.body.test.questions;
                        for (let i = 0; i < providedQuestions.length; i++) {
                            //Building question from body
                            let question = new questionsModel({
                                _id: new mongoose.Types.ObjectId(),
                                type: providedQuestions[i].type,
                                question: providedQuestions[i].question,
                            });
                            if(providedQuestions[i].enableTimer &&  providedQuestions[i].timer) { question.enableTimer = true; question.timer =  providedQuestions[i].timer }
                            if(test.hintAllowed && providedQuestions[i].hint) { question.hint = providedQuestions[i].hint; }
                            if(providedQuestions[i].resources) { question.resources = providedQuestions[i].resources; }
                            if(providedQuestions[i].images) { question.images = providedQuestions[i].images; }
                            if(providedQuestions[i].bonus) { question.bonus = providedQuestions[i].bonus; }
                            switch(question.type) {
                                case "keywords":
                                    question.keywordsAnswer = providedQuestions[i].keywordsAnswer;//Array
                                    break;
                                case "choices":
                                    question.choicesAnswer = providedQuestions[i].choicesAnswer;//Array
                                    question.choicesAll = providedQuestions[i].choicesAll;//Array (Randomized server side(on get))
                                    break;
                                case "arrangement":
                                    question.arrangement = providedQuestions[i].arrangement;//Array
                                    break;
                                case "shortAnswer"://Rare, should be used only in hand-marked, warn user when creating a Q as short answer with this setting enabled
                                    question.shortAnswer = providedQuestions[i].shortAnswer;//String
                                    break;
                                default://If no type is set, break
                                    return res.status(400).json({message: "Must provide type, 'keywords','choices','arrangement' and 'shortAnswer' are currently only accepted", data: req.body.questions});
                            }
                            test.questions.push(question.id);
                            question.save(function (err) {
                                if (err) return res.status(500).json({ message: "Question save query failed",  data: err });
                            });
                        }
                    }
                    let userTest = new userTestModel({
                        _id: new mongoose.Types.ObjectId(),
                        test: test._id,
                        user: user._id,
                    });
                    //TODO: Decide if an authored auto gets assigned their test
                    userTest.attempts = test.attemptsAllowed;
                    userTest.showMarker = test.showMarker;
                    userTest.save(function (err) {
                        if (err) return res.status(500).json({message: "Save user test allocation query failed", data: err});
                        user.tests.push(test.id);
                        user.authoredTests.push(test.id);
                        test.userTestList.push(userTest.id);
                        test.save(function (err, result) {
                            if (err) return res.status(500).json({message: "Save test query failed", data: null});
                            user.save(function (err) {
                                if (err) return res.status(500).json({message: "Save user query failed", data: err});
                                return res.status(200).json({message: "Test generated successfully", data: result});
                            });
                        });
                    });
                }else{
                    return res.status(400).json({message: "Bad request, req.body.test required", data: null});
                }
            });
        });
    } catch (err) {
        return res.status(500).json({message: "Something went wrong creating new test", data: err});
    }
};

/**
 * /api/tests/:testId [GET]
 * Gets information about a specific test
 * LIST CREATED/EDITABLE TESTS AND GIVEN TESTS SEPARATELY?
 *
 * STATUS: Untested
 * @param req
 * @param res
 */
exports.listTest = function(req, res) {
    userTestModel.findOne({_id : req.params.testId})//Get all tests with given user ID
        .populate({
            path:'test', model:'tests',
            populate: { path: 'questions', model: 'questions', select: '_id date resources question type choicesAll arrangement' },//Allows us to populate again within the previous populate!
        })
        .exec(function (err,userTests) {
            if (err) { return res.status(500).json({message: "Failed to query allocated tests", data: err}) }
            if(userTests) {
                let modifiedResult = userTests;
                for (let i = 0; i < modifiedResult.test.questions.length; i++) {//Check and shuffle arrangment before returing result
                    if (modifiedResult.test.questions[i].type === 'arrangement') {
                        modifiedResult.test.questions[i].arrangement = settings.shuffleArray(modifiedResult.test.questions[i].arrangement);
                    }
                }
                return res.status(200).json({message: 'Allocated tests successfully retrieved', data: modifiedResult});
            }else{
                return res.status(404).json({message: "No data found", data: null})
            }
        });
};
/**
 * /api/tests/:testId [PUT]
 * Update a TEST by ID, only if authorised
 * Will take in submitted test array 'test': { 'id' : 0, 'etc': 'etc' } in body, same as 'createTest' (consistency)
 *
 * Will need to update this to prevent undesired changes to a tests settings/data
 *
 * STATUS: Untested
 * @param req
 * @param res
 */
exports.updateTest = function(req, res) {
    try {
        settings.ensureAuthorized(req,res).then(function (user) {
            if(!user) { return null; }
            //Find the user making the request, if they are the author they can edit it (May need more authors/editors in test model soon)
            usersModel.findOne({unique_id: user['sub']}, function (err, user) {
                if (err) return res.status(404).json({message: "User not found/Valid", data: err});
                testsModel.findOneAndUpdate({_id: req.params.testId, authors: user.id }, req.body.test, {new: true}, function (err, test) {//Find the test where the id is the param and the user is an author
                    if (err) return res.status(500).json({message: "Test updated query failed", data: err});
                    return res.status(200).json({message: ('Test ' + test._id + ' updated'), data: test});
                });
            });
        });
    } catch (err) {
        return res.status(500).json({message: "Something went wrong updating test", data: err});
    }
};

/**
 * /api/tests/:testId [DELETE]
 * Deletes a test and all related questions + IDs of test from tests,authoredTests in user.
 * Required to be author to do this!
 * Potential problem: Questions should be shared, but here we remove all related questions!
 *
 * THIS REMOVES THE TEST ENTIRELY, IF A TEST WANTS TO BE REMOVED FROM A USER DO IT IN userController!!
 *
 * item.remove().then
 *
 * Should this remove related results?
 * STATUS: Untested
 * @param req
 * @param res
 */
exports.hardDeleteTest = function(req, res) {
    settings.ensureAuthorized(req,res).then(function (authUser) {
        if(!authUser) { return null; }
        usersModel.findOne({unique_id: authUser['sub']})
            .exec(function (err,user) {
                if(err) return res.status(500).json({message: ('Couldnt find user provided'), data: err});
                //Checking if its the same ID, and the authorID is the person attempting to edit.
                testsModel.findOne({_id: req.params.testId, authors: user.id})
                    .exec( function(err, test) {
                        if (err) return res.status(500).json({message:"Failed to find test with matched ID and author", data: err});
                        if(test.questions) {
                            questionsModel.remove({_id: {$in: test.questions}}, function (err) {
                                if (err) return res.status(500).json({message: "Failed to remove questions from test provided", data: err});
                            });
                        }
                        test.remove();
                        try {
                            userQ1.update({ $pull: { "tests": req.params.testId,"authoredTests": req.params.testId }, }, { safe: true, upsert: true }, function(err) {
                                if (err) { return res.status(500).json({message: "Removing of test ID's failed", data: err}); }
                            });
                        } catch (err) {
                            return res.status(500).json({message: "Failed in attempting to remove tests,", data: err});
                        }
                        return res.status(200).json({message: ('Test deleted'), data: test});
                    });
            });
    });
};
//----------------------------- Now listing questionsModel of 'id' test ------------------------------
/**
 * /api/tests/:testId/questions [GET]
 * List the questionsModel for selected ID
 *
 * List all question details (after formatting removing empty cells) for authors <---
 * Author has own route/controller for all things author permissions related. (like full answer questions).
 *
 * STATUS: Untested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listTestQuestions = function(req, res) {
    userTestModel.findOne({_id : req.params.testId})//Get all tests with given user ID
        .populate({
            path:'test', model:'tests',
        })
        .exec(function (err,userTests) {
            if (err) { return res.status(500).json({message: "Failed to query allocated tests", data: err}) }
            questionsModel.find({'_id': { $in: userTests.test.questions}},'_id date resources question type choicesAll arrangement')//Only provide resources and type to allow user to preview questions (need each question type presented)
                .exec(function (err,questionFindQuery) {
                    if (err) { return res.status(500).json({message: "Failed to retrieve questions", data: err}) }
                    if(questionFindQuery !== []) {
                        let modifiedQuestions = questionFindQuery;
                        for (let i = 0; i < modifiedQuestions.length; i++) {//Check and shuffle arrangment before returing result
                            if (modifiedQuestions[i].type === 'arrangement') {
                                modifiedQuestions[i].arrangement = settings.shuffleArray(modifiedQuestions[i].arrangement);
                            }
                        }
                        return res.status(200).json({message: 'Questions found', data: modifiedQuestions});
                    }else{
                        return res.status(404).json({message: "No questions found", data: err})
                    }
                });
        });
};

/**
 * /api/tests/:testId/questions [POST]
 * Removes all current questionsModel then inputs the given JSON array
 *
 * Should it update as the user edits the test or?
 *
 * STATUS: Untested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.updateQuestions = function(req, res) {
    settings.ensureAuthorized(req,res).then(function (authUser) {
        if(!authUser) { return null; }
        usersModel.findOne({unique_id: authUser['sub']})
            .exec(function (err,user) {
                if(err) return res.status(500).json({message: ('Couldnt find user provided'), data: err});
                testsModel.find({_id: req.params.testId, authors: user.id})
                    .exec(function (err, test) {
                        if (err) return res.status(404).json({message: "Test find id query failed", data: null});
                        //After validating all inputs, we delete all current questions
                        questionsModel.deleteMany({_id: {$in: test.questions}}, function (err) {
                            if (err) return res.status(500).json({message: "Question delete query failed.", data: null});
                        });
                        //Set our test questions to an empty array
                        test.questions = [];
                        if (req.body.questions) {
                            let providedQuestions = req.body.questions;
                            for (let i = 0; i < providedQuestions.length; i++) {
                                //Building question from body
                                let question = new questionsModel({
                                    _id: new mongoose.Types.ObjectId(),
                                    type: providedQuestions[i].type,
                                });
                                if(test.hintAllowed && providedQuestions[i].hint) { question.hint = providedQuestions[i].hint; }
                                if(providedQuestions[i].resources) { question.resources = providedQuestions[i].resources; }
                                if(providedQuestions[i].images) { question.images = providedQuestions[i].images; }
                                if(providedQuestions[i].bonus) { question.bonus = providedQuestions[i].bonus; }
                                switch(question.type) {
                                    case "keywords":
                                        question.keywords = providedQuestions[i].keywords;//Array
                                        question.keywordsQuestion = providedQuestions[i].keywordsQuestion;//String
                                        break;
                                    case "choices":
                                        question.choices = providedQuestions[i].choices;//Array
                                        question.choicesQuestion = providedQuestions[i].choicesQuestion;//Array (Randomized server side(on get))
                                        break;
                                    case "arrangement":
                                        question.arrangement = providedQuestions[i].arrangement;//Array
                                        question.arrangementQuestion = providedQuestions[i].arrangementQuestion;//Array (Randomized server side(on get))
                                        break;
                                    case "shortAnswer"://Rare, should be used only in hand-marked, warn user when creating a Q as short answer with this setting enabled
                                        question.shortAnswer = providedQuestions[i].shortAnswer;//String
                                        question.shortAnswerQuestion = providedQuestions[i].shortAnswerQuestion;//String
                                        break;
                                    default://If no type is set, break
                                        return res.status(400).json({message: "Must provide type, 'keywords','choices','arrangement' and 'shortAnswer' are currently only accepted", data: req.body.questions});
                                }
                                test.questions.push(question.id);
                                question.save(function (err) {
                                    if (err) return res.status(500).json({ message: "Question save query failed",  data: err });
                                });
                            }//End of loop
                            test.save(function (err, testQuery) {
                                if (err) return res.status(500).json({message: "Test save query failed", data: err} );
                                return res.status(200).json({message: "Test saved successfully", data: testQuery});
                            });
                        } else {
                            return res.status(404).json({message: "No questions found", data: null});
                        }
                    });
            });
    });
};
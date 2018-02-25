/**
 * Created by Kenji on 1/8/2018.
 */
let settings = require('../misc/settings');
let mongoose = require('mongoose');
let testsModel = require('../models/test/testModel');
let usersModel = require('../models/userModel');
let userTestModel = require('../models/test/userTestModel');
let questionsModel = require('../models/test/questionModel');
let submittedTestModel = require('../models/test/submittedTestModel');
let submittedQuestionModel = require('../models/test/submittedQuestionModel');
let selfAllocatedTestModel = require('../models/test/selfAllocatedTest');

/**
 * /api/tests [GET]
 * List ALL testsModel in DB.
 * {'test.privateTest': false} --> Argument for only showing public testsModel
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
    let pageInput = req.query.page? Number.parseInt(req.query.page) : 1;
    let limitInput = req.query.limit? Number.parseInt(req.query.limit) : 2;
    let sortInput = req.query.sort? req.query.sort : "-date";
    testsModel.paginate(
        req.query.search? { "private": false ,"title": { $regex: req.query.search,$options: 'i' } } : {"private": false }, { page: pageInput, limit: limitInput, sort: sortInput, populate: [{path:'authors', select:"organizations name picture"}, {path:'selfAllocatedTestList', select:"user"}]},
        function(err, result) {
            if (err) return res.status(500).json({message: "Find tests query failed", data: err});
            return res.status(200).json({message: "Tests retrieved", data: result});
        });
};

/**
 * /api/tests/:testId/submitlist [GET]
 * usertest submitted tests for feedback
 *
 * @param req
 * @param res
 */
exports.listSubmits = function(req,res) {
    //query for which sub test?
    let matchInput = req.query.subTest? {_id : req.query.subTest} : {};
    userTestModel.findOne({_id: req.params.testId})
        .populate([
            { path:'submittedTests',match: matchInput, populate: { path: 'submittedQuestions'} }, {path: 'test', select: 'marksAvailable handMarked questions', populate: {path: 'questions'}}
        ])
        .exec(function(err, result) {
            if (err) return res.status(500).json({message: "Find tests query failed", data: err});
            if(result === null) return res.status(404).json({message: "Test not found", data: null});
            return res.status(200).json({message: "Tests retrieved", data: result});
        });
};

/**
 * /api/tests/:testId/submitlist [POST]
 * usertest submitted tests for feedback
 *
 * @param req
 * @param res
 */
exports.reviewSubmits = function(req,res) {
    usersModel.findOne({_id: req.user._id})
        .exec(function (err,user) {//submittedTest
            testsModel.findOne({_id: req.params.testId, authors: req.user._id})
                .exec(function (err,test) {
                    if (err) return res.status(500).json({message: "No test found ", data: err});
                    userTestModel.findByIdAndUpdate(req.body.test, {'$set': {feedback: req.body.testFeedback}})
                        .exec(function (err) {if (err) return res.status(500).json({message: "Failed to update overall feedback", data: err});});
                    if(req.body.questionResults !== null) {
                        let updateMark = true;
                        let newMark = 0;
                        let loop = 0;
                        for (let i = 0; i < req.body.questionResults.length; i++) {
                            loop++;
                            if(req.body.questionResults[i].mark !== null) {
                                newMark+=req.body.questionResults[i].mark;
                            }
                            submittedQuestionModel.findByIdAndUpdate(req.body.questionResults[i].id, {"$set": {feedback: req.body.questionResults[i].feedback, mark: req.body.questionResults[i].mark}})
                                .exec(function (err) {if (err) return res.status(500).json({message: "Failed to update submitted question", data: err});});
                        }
                        if(loop >= req.body.questionResults.length && updateMark) {
                            console.log('arrived');
                            submittedTestModel.findByIdAndUpdate(req.body.subTest, {'$set': {obtainedMark: newMark}}).exec(function (err) {if (err) return res.status(500).json({message: "Failed to update overall feedback", data: err});});
                            userTestModel.findByIdAndUpdate(req.body.test, {'$set': {finalMark: newMark}}).exec(function (err) {if (err) return res.status(500).json({message: "Failed to update overall feedback", data: err});});
                        }
                    }
                    return res.status(200).json({message: "Test reviewed successfully", data: null});

                });
        });
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
    usersModel.findOne({_id: req.user._id}, function (err, user) {
        if (err) return res.status(404).json({message: "User not found/Valid", data: err});
        if (req.body.test) {
            //Info inside new model is required!
            let test = new testsModel({
                _id: new mongoose.Types.ObjectId(),
                title: req.body.test.title,
                tags: req.body.test.tags,
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
            if(req.body.test.privateTest) {test.private = req.body.test.privateTest; }
            if(req.body.test.showMarker) {test.showMarker = req.body.test.showMarker; }
            if(req.body.test.canSelfRemove) {test.canSelfRemove = req.body.test.canSelfRemove; }
            if(req.body.test.markDate) { test.markDate = req.body.test.markDate; }
            if(req.body.test.timerEnabled) { test.timer = req.body.test.timer; }else{ test.timer = 0; }
            let testMarksAvailable = 0;
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

                    if(providedQuestions[i].hint) { question.hint = providedQuestions[i].hint; }
                    if(providedQuestions[i].resources) { question.resources = providedQuestions[i].resources; }
                    if(providedQuestions[i].images) { question.images = providedQuestions[i].images; }
                    if(providedQuestions[i].bonus) { question.bonus = providedQuestions[i].bonus; }
                    if(providedQuestions[i].handMarked) { question.handMarked = providedQuestions[i].handMarked; }
                    switch(question.type) {
                        case "keywords":
                            question.keywordsAnswer = providedQuestions[i].keywordsAnswer;//Array
                            question.possibleMarks = question.handMarked? providedQuestions[i].possibleMarks : providedQuestions[i].keywordsAnswer.length;
                            break;
                        case "choices":
                            question.choicesAnswer = providedQuestions[i].choicesAnswer;//Array
                            question.choicesAll = providedQuestions[i].choicesAll;//Array (Randomized server side(on get))
                            question.possibleMarks = question.handMarked? providedQuestions[i].possibleMarks : providedQuestions[i].choicesAnswer.length;
                            break;
                        case "arrangement":
                            question.arrangement = providedQuestions[i].arrangement;//Array
                            question.possibleMarks = question.handMarked? providedQuestions[i].possibleMarks : providedQuestions[i].arrangement.length;
                            break;
                        case "shortAnswer"://Rare, should be used only in hand-marked, warn user when creating a Q as short answer with this setting enabled
                            question.shortAnswer = providedQuestions[i].shortAnswer;//String
                            question.possibleMarks = question.handMarked? providedQuestions[i].possibleMarks : 1;
                            break;
                        default://If no type is set, break
                            return res.status(400).json({message: "Must provide type, 'keywords','choices','arrangement' and 'shortAnswer' are currently only accepted", data: req.body.questions});
                    }
                    testMarksAvailable += question.possibleMarks;
                    test.questions.push(question.id);
                    question.save(function (err) {
                        if (err) return res.status(500).json({ message: "Question save query failed",  data: err });
                    });
                }
                test.marksAvailable = testMarksAvailable;
            }
            test.save(function (err, result) {
                if (err) return res.status(500).json({message: "Save test query failed", data: null});
                return res.status(200).json({message: "Test generated successfully", data: result});
            });
        }else{
            return res.status(400).json({message: "Bad request, req.body.test required", data: null});
        }
    });
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
exports.listUserTest = function(req, res) {
    userTestModel.findOne({_id : req.params.testId})//Get all tests with given user ID
        .populate({
            path:'test', model:'tests',
            populate: { path: 'questions', model: 'questions'},//, select: '_id date resources question type choicesAll arrangement hint enableTimer' },//Allows us to populate again within the previous populate!
        })
        .exec(function (err,userTest) {

            if (err) { return res.status(500).json({message: "Failed to query allocated tests", data: err}) }
            if(userTest) {
                let modifiedResult = userTest;
                if(userTest.test.locked) {
                    modifiedResult.test.questions = [];
                    return res.status(200).json({message: 'No questions provided as test is locked', data: modifiedResult});
                }else{
                    for (let i = 0; i < modifiedResult.test.questions.length; i++) {//Check and shuffle arrangment before returing result
                        if (modifiedResult.test.questions[i].type === 'arrangement') {
                            modifiedResult.test.questions[i].arrangement = settings.shuffleArray(modifiedResult.test.questions[i].arrangement);
                        }
                        if(modifiedResult.test.questions[i].type === 'keywords') {
                            modifiedResult.test.questions[i].keywordsAnswer = null;
                        }
                        if(modifiedResult.test.questions[i].type === 'choices') {
                            modifiedResult.test.questions[i].choicesAnswer = null;
                        }
                        if(!modifiedResult.test.hintAllowed) {
                            modifiedResult.test.questions[i].hint = null;
                        }
                    }
                    return res.status(200).json({message: 'Allocated tests successfully retrieved', data: modifiedResult});
                }
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
    usersModel.findOne({_id: req.user._id})
        .exec(function (err,user) {
            let modifiedTest = req.body.test;
            let providedQuestions = req.body.test.questions;
            delete modifiedTest.questions;
            let testMarksAvailable = 0;
            testsModel.findOneAndUpdate({_id: req.params.testId, authors: user.id }, modifiedTest, {upsert: true, new: true})
                .exec(function (err, test) {
                    if (err) { console.log(err); return res.status(500).json({message: "Test updated query failed", data: err}); }
                    questionsModel.remove({_id: { $in: test.questions}}).exec();
                    test.questions = [];
                    for (let i = 0; i < providedQuestions.length; i++) {
                        //Building question from body
                        let question = new questionsModel({
                            _id: new mongoose.Types.ObjectId(),
                            type: providedQuestions[i].type,
                            question: providedQuestions[i].question,
                        });

                        if(providedQuestions[i].hint) { question.hint = providedQuestions[i].hint; }
                        if(providedQuestions[i].resources) { question.resources = providedQuestions[i].resources; }
                        if(providedQuestions[i].images) { question.images = providedQuestions[i].images; }
                        if(providedQuestions[i].bonus) { question.bonus = providedQuestions[i].bonus; }
                        if(providedQuestions[i].handMarked) { question.handMarked = providedQuestions[i].handMarked; }
                        switch(question.type) {
                            case "keywords":
                                question.keywordsAnswer = providedQuestions[i].keywordsAnswer;//Array
                                question.possibleMarks = question.handMarked? providedQuestions[i].possibleMarks : providedQuestions[i].keywordsAnswer.length;
                                break;
                            case "choices":
                                question.choicesAnswer = providedQuestions[i].choicesAnswer;//Array
                                question.choicesAll = providedQuestions[i].choicesAll;//Array (Randomized server side(on get))
                                question.possibleMarks = question.handMarked? providedQuestions[i].possibleMarks : providedQuestions[i].choicesAnswer.length;
                                break;
                            case "arrangement":
                                question.arrangement = providedQuestions[i].arrangement;//Array
                                question.possibleMarks = question.handMarked? providedQuestions[i].possibleMarks : providedQuestions[i].arrangement.length;
                                break;
                            case "shortAnswer"://Rare, should be used only in hand-marked, warn user when creating a Q as short answer with this setting enabled
                                question.shortAnswer = providedQuestions[i].shortAnswer;//String
                                question.possibleMarks = question.handMarked? providedQuestions[i].possibleMarks : 1;
                                break;
                            default://If no type is set, break
                                return res.status(400).json({message: "Must provide type, 'keywords','choices','arrangement' and 'shortAnswer' are currently only accepted", data: req.body.questions});
                        }
                        testMarksAvailable += question.possibleMarks;
                        test.questions.push(question.id);
                        question.save(function (err) {
                            if (err) return res.status(500).json({ message: "Question save query failed",  data: err });
                        });
                    }
                    test.marksAvailable = testMarksAvailable;
                    test.save(function (err,testSaved) {
                        if (err) { console.log(err); return res.status(500).json({message: "Question update query failed", data: err}); }
                        return res.status(200).json({message: "Test updated successfully", data: testSaved});
                    });
                });
        });
};

/**
 * /api/tests/:testId [DELETE]
 * Deletes a test and all related questions + IDs of test from tests,authoredTests in user.
 * Required to be author to do this!
 * Potential problem: Questions should be shared, but here we remove all related questions!
 *
 * Should this remove related results?
 * STATUS: Tested
 * @param req
 * @param res
 */
exports.hardDeleteTest = function(req, res) {
    usersModel.findOne({_id: req.user._id})
        .exec(function (err,user) {
            if(err) return res.status(500).json({message: ('Couldnt find user provided'), data: err});
            //Checking if its the same ID, and the authorID is the person attempting to edit.
            testsModel.findOneAndRemove({_id: req.params.testId, authors: user.id})
                .exec( function(err, test) {
                    if (err) return res.status(500).json({message:"Failed to find test with matched ID and author", data: err});
                    if(test) { test.remove(); }
                    return res.status(200).json({message: ('Test deleted'), data: test});
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
    usersModel.findOne({_id: req.user._id})
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
};

/**
 * /api/tests/author/:testId
 * Gets a full test item and related questions/answers if the user is an author
 *
 * @param req
 * @param res
 */
exports.listTest = function(req, res) {
    usersModel.findOne({_id: req.user._id})
        .exec(function (err, user) {
            testsModel.findOne({_id : req.params.testId, authors: user._id})//Get all tests with given user ID
                .populate({path:'questions', model:'questions'})
                .exec(function (err,test) {
                    if (err) { return res.status(500).json({message: "Failed to query allocated tests", data: err}) }
                    return res.status(200).json({message: 'Full test data retrieved for author', data: test});

                });
        });
};

//------------------------- Allocated test API ----------------------- /api/tests/:testId/self
/**
 * /api/tests/:testId/self/:allocatedId [DELETE]
 * Long URL because delete doesnt take body by standard
 *
 * should be moved to test controller/router
 *
 * STATUS: Untested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.removeSelfAllocatedTest = function(req, res) {
    usersModel.findOne({_id: req.user._id})
        .exec(function (err, user) {
            if (err) return res.status(401).json({message: "Not a registered user", data: err});
            testsModel.update({_id: req.params.testId},{ $pull: { "selfAllocatedTestList": req.params.allocatedId } })
                .exec(function (err, testRes) {
                    if (err) return res.status(401).json({message: "Not a valid test", data: err});
                    selfAllocatedTestModel.findOneAndRemove({ _id: req.params.allocatedId})
                        .exec(function (err,selfTest) {
                            if(selfTest) { selfTest.remove(); }
                            if (err) return res.status(500).json({message: "Failed to remove self allocated test", data: err});
                            return res.status(200).json({message: 'usertest was removed', data: selfTest});
                        });

                });
        });
};
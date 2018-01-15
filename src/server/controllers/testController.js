/**
 * Created by Kenji on 1/8/2018.
 */
let settings = require('../misc/settings');

let mongoose = require('mongoose');
let testsModel = require('../models/tests');
let usersModel = require('../models/users');
let questionsModel = require('../models/questions');

/**
 * /api/testsModel [GET]
 * List ALL testsModel in DB.
 * @param req
 * @param res
 * @return JSON {message,data}
 *  {'test.private': false} --> Argument for only showing public testsModel
 */
exports.listTests = function(req, res) {
    testsModel.find({}, function(err, tests) {
        if (err) return res.status(500).json({message: "Find test query failed", data: err});

        return res.status(200).json({message: "Tests retrieved", data: tests});
    });
};
/**
 * /api/testsModel [POST]
 * A user can add a test to their user if authorised
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.createTest = function(req, res) {
    settings.ensureAuthorized(req,res).then(function (user) {
        usersModel.findOne({unique_id: user['sub']}, function (err, user) {
            if (err) return res.status(500).json({message: "Find user query failed", data: err});
            let test = new testsModel({
                _id: new mongoose.Types.ObjectId(),
                title: req.body.title,
                authorID: user.id,
                author: user.name,
                authorIMG: user.picture,
            });
            test.save(function (err, result) {
                if (err) return res.status(500).json({message: "Save test query failed", data: null});
                user.tests.push(test.id);
                user.save(function (err) {
                    if (err) return res.status(500).json({message: "Save user query failed", data: null});
                });
                return res.status(200).json({message: "Test generated successfully", data: result});
            });
        });
    });
};

/**
 * /api/testsModel/:testId [GET]
 * Gets information about a specific test
 * @param req
 * @param res
 */
exports.listTest = function(req, res) {
    testsModel.find({_id: req.params.testId}, function(err, test) {
        if (err) return res.status(500).json({message: "Find test query failed", data: err});

        return res.status(200).json({message: "Test found", data: test});
    });
};
/**
 * /api/testsModel/:testId [PUT]
 * Update a TEST by ID, only if authorised
 * @param req
 * @param res
 */
exports.updateTest = function(req, res) {
    settings.ensureAuthorized(req,res).then(function (user) {
        testsModel.findOneAndUpdate({_id: req.params.testId}, req.body, {new: true}, function (err, test) {
            if (err) return res.status(500).json({message: "Save test query failed", data: err});
            return res.status(200).json({message: ('Test ' + test._id + ' updated'), data: test});
        });
    });
};

/**
 * /api/testsModel/:testId [DELETE]
 * Deletes an inputted
 * @param req
 * @param res
 */
exports.deleteTest = function(req, res) {
     settings.ensureAuthorized(req,res).then(function (authUser) {
         usersModel.findOne({unique_id: authUser['sub']})
             .exec(function (err,userQ1) {
                 testsModel.findById(req.params.testId)
                     .exec( function(err, test) {
                         if (err) return res.status(500).json({message:"Delete test query failed", data: err});
                         if(test.questions) {
                             questionsModel.remove({_id: {$in: test.questions}}, function (err) {
                                 if (err) return res.status(500).json({message: "Question query failed", data: null});
                             });
                         }
                         test.remove();
                         userQ1.update({ $pull: { "tests": req.params.testId } }, { safe: true, upsert: true }, function(err) {
                             try {
                                 if (err) {
                                     return res.status(500).json({message: "Couldnt find a test to remove", data: err});
                                 }
                             } catch (err) {console.log(err);}
                         });
                         return res.status(200).json({message: ('Test deleted'), data: test});
                 });
             });
    });
};
//----------------------------- Now listing questionsModel of 'id' test ------------------------------
/**
 * /api/testsModel/:testId/questions [GET]
 * List the questionsModel for selected ID
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listQuestions = function(req, res) {
    testsModel.findById(req.params.testId)
        .exec(function (err, result) {
            questionsModel.find({'_id': { $in: result.questions}})
                .exec(function (err,questionFindQuery) {
                    if (err) { return res.status(404).json({message: "No questionsModel found", data: err}) }
                    return res.status(200).json({message: 'Questions found', data: questionFindQuery});
                });
            if (err) return res.status(500).json({message: "Find questionsModel query failed", data: err});
        });
};

/**
 * /api/testsModel/:testId/questions [POST]
 * Removes all current questionsModel then inputs the given JSON array
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.updateQuestions = function(req, res) {
    settings.ensureAuthorized(req,res).then(function (authUser) {
        testsModel.findById(req.params.testId)
            .exec(function (err, test) {
                if (err) return res.status(404).json({message: "Test find id query failed", data: null});
                questionsModel.deleteMany({_id: {$in: test.questions}}, function (err) {
                    if (err) return res.status(500).json({
                        message: "Question delete query failed questionsModel.",
                        data: null
                    });
                });
                test.questions = [];
                if (req.body.questions) {
                    var questions = req.body.questions;
                    for (var i = 0; i < questions.length; i++) {
                        var question = new questionsModel({
                            _id: new mongoose.Types.ObjectId(),
                            question: questions[i].question,
                            answer: questions[i].answer,
                            category: questions[i].category,
                            hint: questions[i].hint,
                            keywords: questions[i].keywords,
                        });
                        test.questions.push(question.id);
                        question.save(function (err) {
                            if (err) return res.status(500).json({message: "Question save query failed", data: null});
                        });
                    }
                    test.save(function (err, testQuery) {
                        if (err) return res.status(500).json({message: "Test save query failed"});
                        return res.status(200).json({message: "Test saved successfully", data: testQuery});
                    });
                } else {
                    return res.status(404).json({message: "No questionsModel found", data: null});
                }
            });
    });
};
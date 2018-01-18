/**
 * Created by Kenji on 12/29/2017.
 */
//Question API
const router = require('express').Router();

//When routing to /api/question
/**
 * 'Questions' RESTful API has been moved into 'Tests' and/or 'User'
 */
module.exports = router;
/*router.route('/question')
    .post((req,res) => {
        if (req.body.action == 'get') {
            if(req.body.idtoken) {
                var idtoken = req.body.idtoken;
                settings.userPayload(idtoken).then((result) => {
                    if (result) {
                        TEST.findById(req.body.testid)
                            .exec(function (err, tests) {
                                if (err) return res.status(404).json({message:"No test found", data: null});
                                QUESTION
                                    .find({_id: {$in: tests.questions}})
                                    .sort({_id: -1})
                                    .limit(parseInt(req.body.limit))
                                    .exec(function (err, questions) {
                                        if (err) return res.status(500).json({message:"Couldn't execute find", data: null});
                                        return res.status(200).json({message:"Questions found", data: questions});
                                    });
                            });
                    } else {
                        return res.status(403).json({message:"Failed to validate idtoken", data: null});
                    }
                });
            }else{
                return res.status(403).json({message:"Failed to validate idtoken", data: null});
            }
        } else
        if (req.body.action == 'update') {
            if(req.body.idtoken) {
                var idtoken = req.body.idtoken;
                settings.userPayload(idtoken).then((result) => {
                    if (result) {
                        TEST.findById(req.body.testid)
                            .exec(function (err, test) {
                                if (err) return res.status(404).json({message:"Test find id query failed", data: null});


                                QUESTION.deleteMany({_id: {$in: test.questions}}, function (err) {
                                    if (err) return res.status(500).json({message:"Question delete query failed questions.", data: null});
                                });
                                test.questions = [];

                                if (req.body.questions) {
                                    var questions = req.body.questions;
                                    for (var i = 0; i < questions.length; i++) {
                                        var question = new QUESTION({
                                            _id: new mongoose.Types.ObjectId(),
                                            question: questions[i].question,
                                            answer: questions[i].answer,
                                            category: questions[i].category,
                                        });
                                        test.questions.push(question.id);
                                        question.save(function (err, result) {
                                            if (err) return res.status(500).json({message:"Question save query failed", data: null});
                                        });
                                    }
                                    test.save(function (err, testQuery) {
                                        if (err) return res.status(500).json({message:"Test save query failed"});
                                        return res.status(200).json({message:"Test saved successfully", data: testQuery});
                                    });
                                } else {
                                    return res.status(404).json({message:"No questions found", data: null});
                                }
                            });
                    } else {
                        return res.status(403).json({message:"Failed to validate idtoken", data: null});
                    }
                });
            }else{
                return res.status(403).json({message:"Failed to validate idtoken", data: null});
            }
        } else
        if (req.body.action == 'add') {
            if(req.body.idtoken) {
                var idtoken = req.body.idtoken;
                settings.userPayload(idtoken).then((result) => {
                    if (result) {
                        TEST.findById(req.body.testid, function (err, test) {
                            if (err) return res.status(500).json({message:"Test find query failed",data: null} );
                            var question = new QUESTION({
                                _id: new mongoose.Types.ObjectId(),
                                question: req.body.question,
                                answer: req.body.answer,
                                category: req.body.category,
                            });
                            question.save(function (err, result) {
                                if (err) return res.status(500).json({message:"Question save query failed", data: null});

                                test.questions.push(question.id);
                                test.save(function (err, testQuery) {
                                    if (err) return res.status(500).json({message:"Test save query failed", data: null});
                                });
                                return res.status(200).json({message: "Question save success", data: result});
                            });
                        });
                    } else {
                        return res.status(403).json({message:"Failed to validate idtoken", data: null});
                    }
                });
            }else{
                return res.status(403).json({message:"Failed to validate idtoken", data: null});
            }
        }else{
            return res.status(404).json({message:"Please post an action to body.", data: null});
        }
    })
    .get((req, res) => {
        res.json({message: 'api works', data: null});
    });


module.exports = router;*/
/**
 * Created by Kenji on 12/29/2017.
 */
//Question API
const router = require('express').Router();
var mongoose = require('mongoose');
var settings = require('../misc/settings');
var USER = require('../models/user');
var QUESTION = require('../models/question');
var TEST = require('../models/test');

router.route('/question')
    .post((req,res) => {
        if (req.body.action == 'get') {
            var idtoken = req.body.idtoken;
            settings.userPayload(idtoken).then((result) => {
                if (result) {
                    TEST.findById(req.body.testid)
                        .exec(function(err, tests) {
                            if(err) return res.send(err);
                            QUESTION
                                .find({_id: {$in: tests.questions}})
                                .sort({_id:-1})
                                .limit(parseInt(req.body.limit))
                                .exec(function(err, questions) {
                                    if(err) return res.send(err);

                                    res.json(questions);
                                });
                        });
                } else {
                    res.json({result: 'failed to validate session'});
                }
            });
        } else
        if (req.body.action == 'add') {
            var idtoken = req.body.idtoken;
            settings.userPayload(idtoken).then((result) => {
                if(result) {
                    TEST.findById(req.body.testid, function(err, test) {
                        var question = new QUESTION({
                            _id: new mongoose.Types.ObjectId(),
                            question: req.body.question,
                            answer: req.body.answer,
                            category: req.body.category,
                        });

                        question.save(function (err, result) {
                            if (err) return console.error(err);


                            test.questions.push(question.id);
                            test.save(function (err, testQuery) {
                                if (err) return console.error(err);
                            });

                            res.json({result: result})
                        });
                    });
                }else{
                    res.json({result: 'failed to validate session'});
                }
            });
        }
    })
    .get((req, res) => {
        res.json({result: 'api works'});
    });


module.exports = router;
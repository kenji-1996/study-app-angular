/**
 * Created by Kenji on 12/29/2017.
 */
//Question API
const router = require('express').Router();
var mongoose = require('mongoose');
var settings = require('../../misc/settings');
var USER = require('../../models/user');
var QUESTION = require('../../models/question');

router.route('/question')
    .post((req,res) => {
        if (req.body.action == 'get') {
            var idtoken = req.body.idtoken;
            settings.userPayload(idtoken).then((result) => {
                if (result) {
                    USER.findOne({'unique_id' : result['sub'] }, function(err, user) {
                        QUESTION.find({ _id: { $in: user.questions}}, function (err, markets) {
                            res.json(markets);
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
                    USER.findOne({'unique_id' : result['sub'] }, function(err, user) {
                        var question = new QUESTION({
                            _id: new mongoose.Types.ObjectId(),
                            question: req.body.question,
                            answer: req.body.answer,
                            category: req.body.category,
                        });

                        question.save(function (err, result) {
                            if (err) return console.error(err);


                            user.questions.push(question.id);
                            user.save(function (err, userQuery) {
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
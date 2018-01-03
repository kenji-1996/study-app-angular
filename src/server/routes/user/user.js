/**
 * Created by Kenji on 12/29/2017.
 */
//User API
const router = require('express').Router();
var mongoose = require('mongoose');
var settings = require('../../misc/settings');
var USER = require('../../models/user');
var QUESTION = require('../../models/question');

router.route('/user')
    .post((req,res) => {
        if (req.body.action == 'get') {
            var idtoken = req.body.idtoken;
            settings.verify(idtoken).then((result) => {
                if(result) {
                    res.send(result);
                }else{
                    res.json({result: 'failed to validate session'});
                }
            });
        } else
        if (req.body.action == 'set') {
            var idtoken = req.body.idtoken;
            settings.verify(idtoken).then((result) => {
                if(result) {
                    res.json(result);
                }else{
                    res.json({result: 'failed to validate session'});
                }
            });
        } else
        if (req.body.action == 'q_get') {
            var idtoken = req.body.idtoken;
            settings.userPayload(idtoken).then((result) => {
                if (result) {
                    USER.findOne({'unique_id' : result['sub'] }).
                    populate('questions'). // only works if we pushed refs to children
                    exec(function (err, person) {
                        if (err) return console.log(err);
                        console.log(person);
                    });


                    /*, function (err, userQuery) {
                        console.log(userQuery.questions);
                        questionResults = QUESTION.find({_id: { $in : userQuery.questions } }, function(err, questionQuery) {
                            console.log(questionQuery);
                            res.json(questionQuery);
                        }) ;
                    });*/
                } else {
                    res.json({result: 'failed to validate session'});
                }
            });
        } else
        if (req.body.action == 'q_post') {
            var idtoken = req.body.idtoken;
            settings.userPayload(idtoken).then((result) => {
                if(result) {
                    USER.findOne({'unique_id' : result['sub'] }, function(err, user) {
                        var question = new QUESTION({
                            _id: new mongoose.Types.ObjectId(),
                            question: req.body.q_question,
                            answer: req.body.q_answer,
                            category: req.body.q_category,
                        });

                        question.save(function (err, result) {
                            if (err) return console.error(err);


                            user.questions.push(question);
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
        } else {
            settings.userPayload(req.body.idtoken).then((result) => {
                if (result) {
                    var gmailUser = new USER({
                        _id: new mongoose.Types.ObjectId(),
                        unique_id: result['sub'],
                        email: result['email'],
                        name: result['name'],
                        source: result['iss'],
                        picture: result['picture'],
                        permissions: 0,
                    });
                    USER.update({'unique_id' : result['sub'] },gmailUser,{upsert: true}, function (err, raw) {
                        console.log('The raw response from Mongo was ', raw);
                        res.json(gmailUser);
                    });

                } else {
                    res.json({result: "invalid id token"});
                }
            });
        }
    })
    .get((req, res) => {
        res.json({result: 'api works'});
    });

module.exports = router;
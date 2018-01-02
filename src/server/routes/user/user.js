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
        if (req.body.action == 'add_question') {
            var idtoken = req.body.idtoken;
            settings.userPayload(idtoken).then((result) => {
                if(result) {
                    USER.findOne({'unique_id' : result['sub'] }, (err, userQuery) => {
                        var user = userQuery;
                        var question = new QUESTION();
                        question.question = req.body.question_question;
                        question.answer = req.body.question_answer;
                        question.category = req.body.question_category;
                        question.save(function (err, result) {
                            if (err) return console.error(err);
                            user.questions.push(question);
                            res.json({result: result})
                        });

                    });
                }else{
                    res.json({result: 'failed to validate session'});
                }
            });
        } else {
            var user = new USER();
            var idtoken = req.body.idtoken;
            settings.userPayload(idtoken).then((result) => {
                if (result) {
                    user._id = new mongoose.Types.ObjectId();
                    user.unique_id = result['sub'];
                    user.email = result['email'];
                    user.name = result['name'];
                    user.source = result['iss'];
                    user.picture = result['picture'];
                    user.permissions = 0;

                    USER.update({'unique_id' : result['sub'] },user,{upsert: true}, function (err, raw) {

                        console.log('The raw response from Mongo was ', raw);
                        res.json(user);
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
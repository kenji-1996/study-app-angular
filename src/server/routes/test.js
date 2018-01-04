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

router.route('/test')
    .post((req,res) => {
        if (req.body.action == 'get') {
            var idtoken = req.body.idtoken;
            settings.userPayload(idtoken).then((result) => {
                if (result) {
                    USER.findOne({'unique_id': result['sub']}, function (err, user) {
                        TEST
                            .find({_id: {$in: user.tests}})
                            .sort({_id:-1})
                            .limit(parseInt(req.body.limit))
                            .exec(function(err, tests) {
                                if(err) return res.send(err);
                                res.json(tests);
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
                        var test = new TEST({
                            _id: new mongoose.Types.ObjectId(),
                            title: req.body.title,
                            authorID: user.id,
                            author: user.name,
                        });

                        test.save(function (err, result) {
                            if (err) return console.error(err);


                            user.tests.push(test.id);
                            user.save(function (err, userQuery) {
                                if (err) return console.error(err);
                            });

                            res.json({result: ('Test ' + test.title + ' under ID ' + test.id + ' was added')})
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
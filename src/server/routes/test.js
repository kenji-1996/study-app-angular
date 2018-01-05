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
            if(req.body.idtoken) {
                var idtoken = req.body.idtoken;
                settings.userPayload(idtoken).then((result) => {
                    if (result) {
                        USER.findOne({'unique_id': result['sub']}, function (err, user) {
                            TEST
                                .find({_id: {$in: user.tests}})
                                .sort({_id: -1})
                                .limit(parseInt(req.body.limit))
                                .exec(function (err, tests) {
                                    if (err) return res.status(500).json({message:"Couldnt save question", data: null});
                                    return res.status(200).json({message: "Tests retrieved", data: tests});
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
        if (req.body.action == 'add') {
            if(req.body.idtoken) {
                var idtoken = req.body.idtoken;
                settings.userPayload(idtoken).then((result) => {
                    if(result) {
                        USER.findOne({'unique_id' : result['sub'] }, function(err, user) {
                            if (err) return res.status(500).json({message:"Find user query failed", data: null});
                            var test = new TEST({
                                _id: new mongoose.Types.ObjectId(),
                                title: req.body.title,
                                authorID: user.id,
                                author: user.name,
                            });
                            test.save(function (err, result) {
                                if (err) return res.status(500).json({message:"Save test query failed", data: null});
                                user.tests.push(test.id);
                                user.save(function (err, userQuery) {
                                    if (err) return res.status(500).json({message:"Save user query failed", data: null});
                                });
                                return res.status(200).json({message: "Test added successfully", data: result});
                            });
                        });
                    }else{
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
        res.json({result: 'api works'});
    });


module.exports = router;

/*if (req.body.action == 'update') {
 var idtoken = req.body.idtoken;
 settings.userPayload(idtoken).then((result) => {
 if (result) {
 TEST
 .findOne(req.body._id)
 .exec(function(err, test) {
 if(err) return res.json({message:err);
 var updateTest = req.body.test;
 if(updateTest.title) {
 test.title = updateTest.title;

 }
 test.save(function (err, result) {

 });

 res.json(test);
 });
 USER.findOne({'unique_id': result['sub']}, function (err, user) {
 TEST
 .find({_id: {$in: user.tests}})
 .sort({_id:-1})
 .limit(parseInt(req.body.limit))
 .exec(function(err, tests) {
 if(err) return res.json({message:err);
 res.json(tests);
 });
 });
 } else {
 res.json({result: 'failed to validate session'});
 }
 });
 } else*/
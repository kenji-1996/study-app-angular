let mongoose = require('mongoose');
let testsModel = require('../../../models/test/testModel');
let usersModel = require('../../../models/userModel');
let userTestModel = require('../../../models/test/userTestModel');
let groupsModel = require('../../../models/groupsModel');

/**
 * /api/users/:userId/tests/authored [GET]
 * List all authored tests assigned/created by user
 *
 * STATUS: Tested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listTests = function(req, res) {
    let pageInput = req.query.page? Number.parseInt(req.query.page) : 1;
    let limitInput = req.query.limit? Number.parseInt(req.query.limit) : 2;
    let sortInput = req.query.sort? req.query.sort : "-date";
    testsModel.paginate(req.query.search? { authors: req.params.userId ,"title": { $regex: req.query.search,$options: 'i' } } : {authors: req.params.userId },
        {
            page: pageInput,
            limit: limitInput,
            sort: sortInput,
            populate: [{ path:'userTestList', model: 'usertests', populate: { path: 'user', model: 'users', select: 'name username' },}]
        }, function(err, result) {
            if (err) return res.status(500).json({message: "Find allocated tests query failed", data: err});
            return res.status(200).json({message: "Tests retrieved", data: result});
        });
    /*testsModel.find({authors: req.params.userId})
     .populate({
     path:'userTestList', model: 'usertests',
     populate: { path: 'user', model: 'users', select: 'name' }//[{ path: 'test', model: 'submittedtest', },
     })
     .sort({date: -1})
     .exec(function (err,resultsArray) {
     if (err) { return res.status(404).json({message: "No tests found", data: err}) }
     return res.status(200).json({message: 'Results found', data: resultsArray});
     });*/
};

/**
 * /api/users/:userId/tests/authored/users [POST]
 * Allocates user to new ID, can only be done by someone with certain usergroups or overall > 3 permissions.
 *
 * body { testid: '123' }
 *
 * STATUS: Tested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.assignTest = function(req, res) {


    usersModel.findOne({_id: req.user._id})
        .exec(function (err, user) {
            if (err) return res.status(401).json({message: "Not a registered user", data: err});

            if(req.body.type === 'username') {
                usersModel.findOne({username: req.body.username})
                    .exec(function (err,targetUser) {
                        if (err) return res.status(401).json({message: "Not a valid user", data: err});
                        testsModel.findOne({_id: req.body.testid, authors: user._id})
                            .populate({
                                path:'userTestList',
                                model: 'usertests',
                                match: { user: targetUser._id },
                            })
                            .exec(function (err,testCheck) {
                                if (err) return res.status(400).json({message: "Failed to check test for user", data: err});
                                let staff = user.permissions > 3;
                                //let orgStaff = (user.organization === targetUser.organization && user.userGroup === 'staff');
                                if((staff || user._id === targetUser._id) && testCheck.userTestList.length === 0) {
                                    testsModel.findOne({_id: req.body.testid, authors: user._id})
                                        .exec(function (err,testRes) {
                                            let userTest = new userTestModel({
                                                _id: new mongoose.Types.ObjectId(),
                                                test: testRes._id,
                                                user: targetUser._id,
                                            });
                                            userTestModel.create(userTest, function (err, userTestRes) {
                                                if (err) return res.status(400).json({message: "Failed to create new user test", data: err});
                                                testRes.userTestList.push(userTestRes.id);
                                                testRes.save(function (err) {
                                                    if (err) return res.status(500).json({message: "Failed to update user test list of provided test", data: err});
                                                    return res.status(200).json({message: 'New user was allocated this test', data: user});
                                                });
                                            });

                                        });
                                }else{
                                    return res.status(400).json({message: "You dont have permission to assign this user or they are already assigned", data: null});
                                }
                            });
                    });
            }else if(req.body.type === 'group') {
                groupsModel.findOne({_id: req.body.group})
                    .exec(function (err,targetGroup) {
                        if (err) return res.status(401).json({message: "Not a valid group", data: err});
                        if(targetGroup.users.length < 1) {
                            return res.status(400).json({message: "No users to assign this test.", data: targetGroup});
                        }
                        console.log(targetGroup.tests);
                        if(!(targetGroup.tests.indexOf(req.body.testid) > -1)) {
                            targetGroup.tests.push(req.body.testid);
                            for(let i = 0; i < targetGroup.users.length; i++) {

                                testsModel.findOne({_id: req.body.testid, authors: user._id})
                                    .populate({
                                        path:'userTestList',
                                        model: 'usertests',
                                        match: { user: targetGroup.users[i] },
                                    })
                                    .exec(function (err,testCheck) {
                                        if (err) return res.status(400).json({message: "Failed to check test for user", data: err});
                                        if(testCheck.userTestList.length === 0) {
                                            testsModel.findOne({_id: req.body.testid, authors: user._id})
                                                .exec(function (err,testRes) {
                                                    let userTest = new userTestModel({
                                                        _id: new mongoose.Types.ObjectId(),
                                                        test: testRes._id,
                                                        user: targetGroup.users[i],
                                                    });
                                                    userTestModel.create(userTest, function (err, userTestRes) {
                                                        if (err) return res.status(400).json({message: "Failed to create new user test", data: err});
                                                        testRes.userTestList.push(userTestRes.id);
                                                        testRes.save(function (err) {
                                                            if (err) return res.status(500).json({message: "Failed to update user test list of provided test", data: err});
                                                        });
                                                    });

                                                });
                                        }
                                    });

                            }
                            targetGroup.save(function (err) {
                                if (err) return res.status(500).json({message: "Failed to save group", data: err});
                            });
                            return res.status(200).json({message: 'Group users were assigned to the test', data: targetGroup});
                        }else{
                            return res.status(400).json({message: 'Group already assigned', data: targetGroup});
                        }
                    });
            }
        });
};

/**
 * /api/users/:userId/tests/authored/users/:targetUserId/:targetTestId [DELETE]
 * Deletes an allocated user, author can remove whoever whenever
 *
 *
 * STATUS: Tested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.unassignTest = function(req,res) {
    usersModel.findOne({_id: req.user._id})
        .exec(function (err, user) {
            if (err) return res.status(401).json({message: "Not a registered user", data: err});
            testsModel.findOne({_id: req.params.testId,authors: user._id})
                .exec(function (err, testFound) {
                    if(!testFound)  return res.status(404).json({message: "No test found", data: err});
                    if (err) return res.status(500).json({message: "Failed to remove user test from test", data: err});
                    userTestModel.findOneAndRemove({test: testFound._id, _id: req.params.userTestId})
                        .exec(function (err,userTest) {
                            if(userTest) { userTest.remove(); }
                            if (err) return res.status(500).json({message: "Failed to remove user test from test", data: err});
                            return res.status(200).json({message: 'usertest was removed', data: userTest});
                        });
                })
        });
};
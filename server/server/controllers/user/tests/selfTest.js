let usersModel = require('../../../models/userModel');
let testsModel = require('../../../models/test/testModel');
let selfAllocatedTestModel = require('../../../models/test/selfAllocatedTest');

/**
 * /api/users/:userId/self [GET]
 * Lists allocated tests for userId
 *
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listTests = function(req, res) {
    let pageInput = req.query.page? Number.parseInt(req.query.page) : 1;
    let limitInput = req.query.limit? Number.parseInt(req.query.limit) : 2;
    let sortInput = req.query.sort? req.query.sort : "-date";
    selfAllocatedTestModel.paginate({user: req.params.userId},
        {
            page: pageInput,
            limit: limitInput,
            sort: sortInput,
            populate: [
                {path:'test', match: req.query.search? { "title" : { $regex: req.query.search,$options: 'i' } } : {}},
            ],
        },
        function(err, result) {
            if (err) return res.status(500).json({message: "Find allocated tests query failed", data: err});
            return res.status(200).json({message: "Tests retrieved", data: result});
        });
};

/**
 * /api/users/:userId/self [POST]
 * Allocates user to new ID
 *
 * body { testid: '123' }
 *
 * STATUS: Untested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.addTest = function(req, res) {
    usersModel.findOne({_id: req.user._id})
        .exec(function (err, user) {
            if (err) return res.status(401).json({message: "Not a registered user", data: err});
            testsModel.findOne({_id: req.body.testid})
                .exec(function (err, testRes) {
                    let userTest = new selfAllocatedTestModel({
                        _id: new mongoose.Types.ObjectId(),
                        test: testRes._id,
                        user: user._id,
                    });
                    selfAllocatedTestModel.create(userTest, function (err, userTestRes) {
                        if (err) return res.status(400).json({message: "Cannot allocate a test you already have!", data: err});
                        //TODO: decide if the test should hold this data
                        testRes.selfAllocatedTestList.push(userTestRes.id);
                        testRes.save(function (err, testSave) {
                            if (err) return res.status(500).json({
                                message: "Failed to update user test list of provided test",
                                data: err
                            });
                            return res.status(200).json({message: 'Self allocated successful', data: user});
                        });
                    });

                });
        });
};

/**
 * /api/users/:userId/tests/self/:testId [DELETE]
 * Deletes an allocated user, author can remove whoever whenever
 *
 *
 * STATUS: Tested
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.removeTest = function(req,res) {
    usersModel.findOne({_id: req.user._id})
        .exec(function (err, user) {
            if (err) return res.status(401).json({message: "Not a registered user", data: err});
            testsModel.findOne({_id: req.params.testId})
                .exec(function (err, testFound) {
                    if (err) return res.status(500).json({message: "Failed to remove user test from test", data: err});
                    selfAllocatedTestModel.findOneAndRemove({test: testFound._id, user: user._id})
                        .exec(function (err,selfAllocatedTest) {
                            if(selfAllocatedTest) { selfAllocatedTest.remove(); }
                            if (err) return res.status(500).json({message: "Failed to remove user test from test", data: err});
                            return res.status(200).json({message: 'self allocated test was removed', data: selfAllocatedTest});
                        });
                })
        });
};
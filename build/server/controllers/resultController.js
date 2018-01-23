/**
 * Created by Kenji on 1/8/2018.
 */
let settings = require('../misc/settings');

let mongoose = require('mongoose');
let usersModel = require('../models/user');

/**
 * let resultsModel = require('../models/result');
 * Individual results currently stored in user.[submittedTests] (contains feedback, mark, original test._id)
 * Test results (all results for a certain test) are contained in test.testResults (An array of submittedTests), only accessible for the author(s) to mark and reference
 */

/**
 * /api/results [GET]
 * List ALL results in DB.
 *
 * DEPRECIATED!!
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listResultsDepreciated = function(req, res) {
    /*settings.ensureAuthorized(req,res).then(function (user) {
        if (!user) { return null; }

        resultsModel.find({}, function(err, results) {
            if (err) return res.status(500).json({message: "Find results query failed", data: err});

            return res.status(200).json({message: "Results retrieved", data: results});
        });
    });*/
    return res.status(404).json({message: "No longer providing all results", data: null});
};
/**
 * /api/results [POST]
 * A user submits their individual results (Needs authentication)
 * Creates submittedTest[submittedQuestion] adds submittedTests._id to user.submittedTests[]
 * req.body.result object required example: "result": { "type": 'keywords, "name": "Diana Faulkner"}
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.submitUserResult = function(req, res) {
    settings.ensureAuthorized(req,res).then(function (user) {
        if(!user) { return null; }
        usersModel.findOne({unique_id: user['sub']}, function (err, user) {
            if (err) return res.status(500).json({message: "Find home query failed", data: err});
            let result = new resultsModel(req.body);
            result._id = new mongoose.Types.ObjectId();
            result.save(function (err, result) {
                if (err) return res.status(500).json({message: "Save result query failed", data: err});
                user.results.push(result.id);
                user.save(function (err) {
                    if (err) return res.status(500).json({message: "Save home query failed", data: err});
                });
                return res.status(200).json({message: "Result saved to database successfully", data: result});
            });
        });
    });
};

/**
 * /api/results/:resultId [GET]
 * Gets information about a specific test
 * @param req
 * @param res
 */
exports.listResult = function(req, res) {
    resultsModel.find({_id: req.params.resultId}, function(err, result) {
        if (err) return res.status(500).json({message: "Find result query failed", data: err});

        return res.status(200).json({message: "Result found", data: result});
    });
};
/**
 * /api/results/:resultId [PUT]
 * Update a result by ID, only if authorised
 * Will only update whatever is supplied in request body
 * @param req
 * @param res
 */
exports.updateResult = function(req, res) {
    settings.ensureAuthorized(req,res).then(function (user) {
        if(!user) { return null; }
        resultsModel.findOneAndUpdate({_id: req.params.resultId}, req.body, {new: true}, function (err, result) {
            if (err) return res.status(500).json({message: "Save result query failed", data: err});
            return res.status(200).json({message: ('Result ' + result._id + ' updated'), data: result});
        });
    });
};

/**
 * /api/results/:resultId [DELETE]
 * Deletes a users result from given resultId in params
 * @param req
 * @param res
 */
exports.deleteResult = function(req, res) {
     settings.ensureAuthorized(req,res).then(function (authUser) {
         if(!authUser) { return null; }
         usersModel.findOne({unique_id: authUser['sub']})
             .exec(function (err,userQ1) {
                 resultsModel.findById(req.params.resultId)
                     .exec( function(err, result) {
                         if (err) return res.status(500).json({message:"Delete result query failed", data: err});
                         result.remove();
                         userQ1.update({ $pull: { "results": req.params.resultId } }, { safe: true, upsert: true }, function(err) {
                             try { if (err) { return res.status(500).json({message: "Couldnt find a result to remove", data: err}); }
                             } catch (err) { console.log(err); }
                         });
                         return res.status(200).json({message: ('Result deleted'), data: result});
                 });
             });
    });
};

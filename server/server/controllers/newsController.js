/**
 * Created by Kenji on 1/8/2018.
 */
let settings = require('../misc/settings');

let mongoose = require('mongoose');
let newsModel = require('../models/newsModel');
let usersModel = require('../models/userModel');

/**
 * /api/news [GET]
 * List ALL news
 * @param req
 * @param res
 * @return JSON {message,data}
 *  {'result.private': false} --> Argument for only showing public testsModel
 */
exports.listAllNews = function(req, res) {
    newsModel.find({})
        .sort({date: -1})
        .exec(function(err,results) {
        if (err) return res.status(500).json({message: "Find results query failed", data: err});

        return res.status(200).json({message: "Results retrieved", data: results});
    });
};
/**
 * /api/news [POST]
 * An admin submits a new news post, must have permissions to create news (3)
 * Results body needs: {headline: STRING, content: STRING, authorId: String, authorName: String, tags: [String]},
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.createNews = function(req, res) {
    usersModel.findOne({_id: req.user._id}, function (err, user) {
        if(!(user.permissions >= 3)) { return res.status(403).json({message: "Not permitted to create news", data: err}); }
        if (err) return res.status(500).json({message: "Find home query failed", data: err});
        let result = new newsModel(req.body);
        result._id = new mongoose.Types.ObjectId();
        result.save(function (err, result) {
            if (err) return res.status(500).json({message: "News post query failed", data: err});
            /*user.results.push(result.id);
             user.save(function (err) {
             if (err) return res.status(500).json({message: "Save home query failed", data: err});
             });*/
            return res.status(200).json({message: "News post successfully created.", data: result});
        });
    });
};

/**
 * /api/news/:newsId [GET]
 * Gets information about a specific test
 * @param req
 * @param res
 */
exports.listNews = function(req, res) {
    newsModel.find({_id: req.params.newsId}, function(err, result) {
        if (err) return res.status(500).json({message: "Find news query failed", data: err});

        return res.status(200).json({message: "News post found", data: result});
    });
};
/**
 * /api/news/:newsId [PUT]
 * Update a result by ID, only if authorised and permissions are equal or above 3
 * Will only update whatever is supplied in request body
 * @param req
 * @param res
 */
exports.updateNews = function(req, res) {
        usersModel.findOne({_id: req.user._id}, function (err, user) {
            if (!(user.permissions >= 3)) { return res.status(403).json({message: "Not permitted to update news", data: err}); }
            newsModel.findOneAndUpdate({_id: req.params.newsId}, req.body, {new: true}, function (err, news) {
                if (err) return res.status(500).json({message: "Save test query failed", data: err});
                return res.status(200).json({message: ('News ' + news._id + ' updated'), data: news});
            });
        });
};

/**
 * /api/news/:newsId [DELETE]
 * Deletes a users result from given resultId in params
 * @param req
 * @param res
 */
exports.deleteNews = function(req, res) {
    usersModel.findOne({_id: req.user._id})
        .exec(function (err,userQ1) {
            if (!(userQ1.permissions >= 3)) { return res.status(403).json({message: "Not permitted to delete news", data: err}); }
            newsModel.findById(req.params.newsId)
                .exec( function(err, result) {
                    if (err) return res.status(500).json({message:"Delete news query failed", data: err});
                    result.remove();
                    /*userQ1.update({ $pull: { "results": req.params.resultId } }, { safe: true, upsert: true }, function(err) {
                     try { if (err) { return res.status(500).json({message: "Couldnt find a result to remove", data: err}); }
                     } catch (err) { console.log(err); }
                     });*/
                    return res.status(200).json({message: ('News deleted'), data: result});
                });
        });
};

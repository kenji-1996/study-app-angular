/**
 * Created by Kenji on 1/8/2018.
 */
let groupsModel = require('../models/groupsModel');
let mongoose = require('mongoose');

/**
 * /api/groups [GET]
 * List ALL groups
 * @param req
 * @param res
 * @return JSON {message,data}
 */
exports.listAllGroups = function(req, res) {

    let pageInput = req.query.page? Number.parseInt(req.query.page) : 1;
    let limitInput = req.query.limit? Number.parseInt(req.query.limit) : 2;
    let sortInput = req.query.sort? req.query.sort : "-date";
    groupsModel.paginate(
        req.query.search? { "private": false ,"name": { $regex: req.query.search,$options: 'i' } } : {"private": false }, { page: pageInput, limit: limitInput, sort: sortInput, populate: [{path:'creator', select:"username"}]},
        function(err, result) {
            if (err) return res.status(500).json({message: "Find groups query failed", data: err});
            return res.status(200).json({message: "Groups retrieved", data: result});
        });
};

/**
 * /api/groups [POST]
 * Update the user with whatever is supplied in req.body
 *
 * TODO: update so only specific fields can be updated (I.E. not auth)
 * @param req
 * @param res
 */
exports.addGroup = function(req, res) {
    if(req.body.name) {
        let group = new groupsModel();
        group._id = new mongoose.Types.ObjectId();
        group.name = req.body.name;
        group.creator = req.user._id;
        if(req.body.private === 'true') group.private = true;
        group.staff.push(req.user._id);
        group.save(function (err, result) {
            if (err && err.code && err.code === 11000) return res.status(400).json({message: "A group with that name already exists", data: err});
            if (err) return res.status(500).json({message: "Saving group failed", data: err});
            return res.status(200).json({message: "Group successfully registered", data: result});
        });
    }else{
        return res.status(400).json({message: "Name is required to register new group", data: req.body});
    }
};

/**
 * /api/groups/:groupId [GET]
 * Gets information about a specific test
 * @param req
 * @param res
 */
exports.listGroup = function(req, res) {
    groupsModel.findOne({_id: req.params.groupId}, function(err, result) {
        if (err) return res.status(500).json({message: "Failed to query groups", data: err});

        return res.status(200).json({message: "Group found", data: result});
    });
};
/**
 * /api/groups/:groupId [PUT]
 * Update a group if staff
 * @param req
 * @param res
 */
exports.updateGroup = function(req, res) {
        groupsModel.findOne({_id: req.params.groupId}, function (err, group) {
            if (!group.staff.includes(req.user._id)) { return res.status(403).json({message: "Not permitted to update group", data: err}); }
            groupsModel.findOneAndUpdate({_id: req.params.groupId}, req.body, {new: true}, function (err, group) {
                if (err) return res.status(500).json({message: "Save test query failed", data: err});
                return res.status(200).json({message: ('News ' + group._id + ' updated'), data: group});
            });
        });
};

/**
 * /api/group/:groupId [DELETE]
 * Deletes a users result from given resultId in params
 * @param req
 * @param res
 */
exports.deleteGroup = function(req, res) {
    groupsModel.findOne({_id: req.params.groupId}, function (err, group) {
        if (err) return res.status(500).json({message: "Remove group query failed", data: err});
        if (group.creator !== req.user._id)
        {
            return res.status(403).json({message: "Only the creator of a group can remove it", data: err});
        }else{
            group.remove();
            return res.status(200).json({message: 'Group delete successful', data: group});
        }
    });
};

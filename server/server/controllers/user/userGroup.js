let groupsModel = require('../../models/groupsModel');
let mongoose = require('mongoose');

/**
 * /api/users/:userId/groups [GET]
 * Lists groups
 *
 * @param req
 * @param res
 */
exports.listUserGroups = function(req, res) {
    groupsModel.find({ $or: [{staff: req.user._id}, {users: req.user._id}] })
        .exec(function (err,groups) {
            if (err) return res.status(500).json({message: "Find groups query failed", data: err});
            let newGroup = groups;
            return res.status(200).json({message: "Group(s) found", data: newGroup});
        });
};

/**
 * /api/users/:userId/groups [POST]
 * Joins usergroup
 *
 * @param req
 * @param res
 */
exports.joinGroup = function(req, res) {
    groupsModel.findOneAndUpdate({_id: req.body.groupId},{ $push: {users: req.user._id }})
        .exec(function (err,group) {
            if (err) return res.status(500).json({message: "Join group query failed", data: err});
            return res.status(200).json({message: "Joined group successfully", data: group});
        })
};

/**
 * /api/users/:userId/groups/:groupId [DELETE]
 * Joins usergroup
 *
 * @param req
 * @param res
 */
exports.leaveGroup = function(req, res) {
    groupsModel.findOneAndUpdate({_id: req.params.groupId},{ $pull: {users: req.user._id }})
        .exec(function (err,group) {
            if (err) return res.status(500).json({message: "Leave group query failed", data: err});
            return res.status(200).json({message: "Left group successfully", data: group});
        })
};


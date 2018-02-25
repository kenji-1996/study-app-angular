let usersModel = require('../../models/userModel');

/**
 * /api/users/:userId [GET]
 * Gets limited information about a specific user, only gets self
 *
 * @param req
 * @param res
 */
exports.listUser = function(req, res) {
    usersModel.findOne({_id: req.user._id})
        .exec(function (err,user) {
            if (err) return res.status(500).json({message: "Find user query failed", data: err});
            return res.status(200).json({message: "Authenticated user found", data: user});
        });
};

/**
 * /api/users/:userId [PUT]
 * Update the user with whatever is supplied in req.body
 *
 * TODO: update so only specific fields can be updated (I.E. not auth)
 * @param req
 * @param res
 */
exports.updateUser = function(req, res) {
    usersModel.find({_id: req.user._id})
        .exec(function (err,userRes){
            usersModel.findOneAndUpdate({unique_id: req.user._id}, req.body, {new: true}, function (err, userQ2) {
                if (err) return res.status(500).json({message: "Save user query failed", data: err});
                return res.status(200).json({message: ('Updated self ' + userQ2.id), data: userQ2});
            });
        });
};
/**
 * /api/users/:userId [DELETE]
 * Deletes an inputted if elevated permissions
 *
 * TODO: Figure out best way to manage their assets if they wish to delete (soft delete?)
 * @param req
 * @param res
 */
exports.deleteUser = function(req, res) {
    usersModel.findOne({_id: req.user._id})
        .exec(function (err, userRes) {
            usersModel.findOneAndUpdate({_id: req.user._id}, function (err, userQ1) {
                if (err) return res.status(500).json({message: "Update user query failed", data: err});
                userQ1.remove();
                return res.status(200).json({message: ('Admin updated user ' + userQ1.id), data: userQ1});
            });
        });
};
/**
 * Created by Kenji on 1/8/2018.
 */
let mongoose = require('mongoose');
let newsModel = require('../models/newsModel');
let usersModel = require('../models/userModel');

/**
 * todo
 */
exports.listUsers = function(req, res) {
    let pageInput = req.query.page? Number.parseInt(req.query.page) : 1;
    let limitInput = req.query.limit? Number.parseInt(req.query.limit) : 10;
    let sortInput = req.query.sort? req.query.sort : "-dateCreated";
    usersModel.paginate(req.query.search? {"username": { $regex: req.query.search, $options: 'i' } } : {}, { page: pageInput, limit: limitInput, sort: sortInput},
        function(err, result) {
            if (err) return res.status(500).json({message: "Find users query failed", data: err});
            return res.status(200).json({message: "Users retrieved", data: result});
        });
};
/**
 * todo
 */
exports.addUser = function(req, res) {
    let Chance = require('chance');
    let chance = new Chance();
    let generate = req.body.generate;
    let amount = req.body.amount? Number.parseInt(req.body.amount) : 1;
    let emailGen = req.body.emailGen? {domain: req.body.emailGen} : {};
    let usernameGen = req.body.usernameGen? {length: Number.parseInt(req.body.usernameGen) } : {length: 5};
    if(amount <= 1) {
        let newUser = new usersModel();//username, email, password, name, picture
        newUser._id = new mongoose.Types.ObjectId();
        if(generate) {
            newUser.email = chance.email(emailGen);
            newUser.username = chance.string(usernameGen);
            newUser.password = chance.string({length: 5});
            newUser.name = chance.name();
            newUser.picture = chance.avatar();
        }else{
            newUser = req.body.user;
        }
        newUser.generatedAccount = true;
        newUser.save(function (err, result) {
            if (err) return res.status(500).json({message: "News post query failed", data: err});
            return res.status(200).json({message: "News user generated successfully.", data: newUser});
        });
        //Add them to a group
    }else{
        generatedUsers:any = [];
        for(let i = 0; i < req.body.amount; i++){
            let newUser = new usersModel();//username, email, password, name, picture
            newUser._id = new mongoose.Types.ObjectId();
            newUser.email = chance.email(emailGen);
            newUser.username = chance.string(usernameGen);
            newUser.password = chance.string({length: 5});
            newUser.name = chance.name();
            newUser.picture = chance.avatar();
            newUser.generatedAccount = true;
            generatedUsers.push(newUser);
            newUser.save(function (err, result) {
                if (err) return res.status(500).json({message: "News post query failed", data: err});

                return res.status(200).json({message: "News user generated successfully.", data: result});
            });
            //add them to a group
        }
    }
};

/**
 * todo
 */
exports.deleteUser = function(req, res) {
    usersModel.findById(req.params.userId)
        .exec( function(err, result) {
            if (err) return res.status(500).json({message:"Delete news query failed", data: err});
            result.remove();
            return res.status(200).json({message: ('User deleted'), data: result});
        });
};

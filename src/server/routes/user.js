/**
 * Created by Kenji on 12/29/2017.
 */
//User API
const router = require('express').Router();
let testController = require('../controllers/userController');

router.route('/users')
    .get(function(req,res) {
        testController.listUsers(req,res);
    })
    .post(function(req,res) {
        testController.authenticateUser(req,res);
    });

router.route('/users/:userId')
    .get(function(req,res) {
        testController.listUser(req,res);
    })
    .put(function(req,res) {
        testController.updateUser(req,res);
    })
    .delete(function(req,res) {
        testController.deleteUser(req,res);
    });

router.route('/users/:userId/tests')
    .get(function(req,res) {
        testController.listTests(req,res);
    })

module.exports = router;
/*const router = require('express').Router();
var mongoose = require('mongoose');
var settings = require('../misc/settings');
var USER = require('../models/user');

router.route('/user')
    .post((req,res) => {
        if (req.body.action == 'get') {
            var idtoken = req.body.idtoken;
            settings.verify(idtoken).then((result) => {
                if(result) {
                    res.send(result);
                }else{
                    res.json({result: 'failed to validate session'});
                }
            });
        } else
        if (req.body.action == 'set') {
            var idtoken = req.body.idtoken;
            settings.verify(idtoken).then((result) => {
                if(result) {
                    res.json(result);
                }else{
                    res.json({result: 'failed to validate session'});
                }
            });
        } else {
            settings.userPayload(req.body.idtoken).then((result) => {
                if (result) {
                    var gmailUser = new USER({
                        _id: new mongoose.Types.ObjectId(),
                        unique_id: result['sub'],
                        email: result['email'],
                        name: result['name'],
                        source: result['iss'],
                        picture: result['picture'],
                        permissions: 0,
                    });
                    USER.update({'unique_id' : result['sub'] },gmailUser,{upsert: true}, function (err, raw) {
                        //console.log('The raw response from Mongo was ', raw);
                    });
                    USER.findOne({'unique_id' : result['sub']}, function(err,userResult) {
                        //console.log(userResult);
                        res.json(userResult);
                    });

                } else {
                    res.json({result: "invalid id token"});
                }
            });
        }
    })
    .get((req, res) => {
        res.json({result: 'api works'});
    });

String.prototype.toObjectId = function() {
    var ObjectId = (require('mongoose').Types.ObjectId);
    return new ObjectId(this.toString());
};

module.exports = router;*/
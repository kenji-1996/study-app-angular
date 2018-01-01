/**
 * Created by Kenji on 12/29/2017.
 */
//Setup variables/connections
var GoogleAuth = require('google-auth-library');
var mongoose     = require('mongoose');
var bodyParser = require('body-parser');
var auth = new GoogleAuth;
var client = new auth.OAuth2('***REMOVED***', '', '');
mongoose.connect('mongodb://kenji:***REMOVED***@***REMOVED***:27017/study');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Connected to mongodb at ***REMOVED***");
});

module.exports.db = db;

module.exports.bodyParser = bodyParser;
module.exports.verify = function verify(token) {
    return new Promise((resolve) => { client.verifyIdToken(
        token,
        client._clientId,
        ((e, login) => {
            if(login) {
                var payload = login.getPayload();
                var userid = payload['sub'];
                resolve(true);
            }else{
                resolve(false);
            }
        }));
    });
}

module.exports.getUserID = function getUserID(token) {
    return new Promise((resolve) => {
        client.verifyIdToken(
            token,
            client._clientId,
            ((e, login) => {
                if(login) {
                    var payload = login.getPayload();
                    var userid = payload['sub'];
                    resolve(userid);
                }else{
                    resolve(false);
                }
            }));
    });
}

module.exports.userPayload = function userPayload(token) {
    return new Promise((resolve, reject) => {client.verifyIdToken(
        token,
        client._clientId,
        ((e, login) => {
            if(login) {
                var payload = login.getPayload();
                var userid = payload['sub'];
                resolve(payload);
            }else{
                resolve(false);
            }
        }));
    });
}

var User = require('../models/user');
module.exports.authenticate = function authenticate(token) {
    return new Promise((resolve) => {
        client.verifyIdToken(
            token,
            client._clientId,
            ((e, login) => {
                if(login) {
                    var payload = login.getPayload();
                    var userid = payload['sub'];
                    var user = new User();
                    User.findOne({'unique_id' : userid }, (err, result) => {
                        if(result.permissions >= 2) {
                            resolve(true);
                        }else{
                            resolve(false);
                        }
                    });
                }else{
                    resolve(false);
                }
            })
        );
    });
}

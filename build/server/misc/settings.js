/**
 * Created by Kenji on 12/29/2017.
 */
/**
 * We use google auth lib for login/token management
 * mongoose for interaction with our mongodb database
 */
let GoogleAuth = require('google-auth-library');
let mongoose     = require('mongoose');
let bodyParser = require('body-parser');
/**
 * We initialize the auth with our API link with Google
 * Then we connect to our mongodb hosted on my server, targeting the 'study' database.
 */
let auth = new GoogleAuth;
let client = new auth.OAuth2('***REMOVED***', '', '');
mongoose.connect('mongodb://kenji:***REMOVED***@***REMOVED***:27017/study');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Connected to mongodb at ***REMOVED***");
});
//Export the database for access in other files
module.exports.db = db;
module.exports.bodyParser = bodyParser;

//Now we have 'global' functions that are used alot, so we can call them multiple times for our methods
/**
 * Here we verify that the given token is valid, thus the home has permissions.
 * We use googles auth lib to pushUpdateArray it, then resolve the promise true or false
 * @param token
 * @returns {Promise}
 */
module.exports.verify = function verify(token) {
    return new Promise((resolve) => { client.verifyIdToken(
        token,
        client._clientId,
        ((e, login) => {
            if(login) {
                resolve(true);
            }else{
                resolve(false);
            }
        }));
    });
};

/**
 * Here is a very similar method except we return a userID of the token, sort of a depreciated method as we can simply use userPayLoad
 * and return the whole home JSON object and extract it in another place.
 * @param token
 * @returns {Promise}
 */
module.exports.getUserID = function getUserID(token) {
    return new Promise((resolve) => {
        client.verifyIdToken(
            token,
            client._clientId,
            ((e, login) => {
                if(login) {
                    let payload = login.getPayload();
                    let userid = payload['sub'];
                    resolve(userid);
                }else{
                    resolve(false);
                }
            }));
    });
};

/**
 * This method simply returns the whole home object with google auth
 * @param token
 * @returns {Promise}
 */
module.exports.userPayload = function userPayload(token) {
    return new Promise((resolve) => {client.verifyIdToken(
        token,
        client._clientId,
        ((e, login) => {
            if(login) {
                let payload = login.getPayload();
                let userid = payload['sub'];
                resolve(payload);
            }else{
                resolve(false);
            }
        }));
    });
};


let User = require('../models/userModel');
/**
 * Here we authenticate a home against a database, use their token to verify its from them,
 * then check their ID against the database permissions.
 * @param token
 * @returns {Promise}
 */
module.exports.authenticate = function authenticate(token) {
    return new Promise((resolve) => {
        client.verifyIdToken(
            token,
            client._clientId,
            ((e, login) => {
                if(login) {
                    let payload = login.getPayload();
                    User.findOne({'unique_id' : payload['sub'] }, (err, result) => {
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
};
/**
 * Here is the only authentication I now use, as it is the proper way to authenticate.
 * I check the headers for auth, then validate it against JWT verification, if its valid we return the user object, otherwise we return an error.
 * @param req
 * @param res
 * @return {Promise}
 */
module.exports.ensureAuthorized = function ensureAuthorized(req, res) {
    return new Promise((resolve) => {
        let bearerToken;
        let bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            let bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            this.userPayload(req.token).then((result) => {
                if (!result) {
                    //resolve(false);
                    return res.status(403).json({message:"Failed to verify token supplied in authorization header", data: null});
                }else{
                    resolve(result);
                }
            });
        } else {
            //resolve(false);
            return res.status(403).json({message:"Failed to supply token in authorization header.", data: null});
        }
    });
};

/**
 * Input the amount of days to add to current date, get new date returned.
 * @param days
 * @return {Date}
 */
module.exports.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}
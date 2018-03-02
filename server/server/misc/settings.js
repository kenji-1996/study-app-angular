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
let User = require('../models/userModel');
let config = require('./config');

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

module.exports.checkAuth = function checkAuth(req) {
    return new Promise((resolve) => {
        let bearerToken;
        let bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            let bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            this.userPayload(req.token).then((result) => {
                resolve(result);
            });
        }else{
            resolve(false);
        }
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
                    return res.status(403).json({message:"Failed to verify token supplied in authorization header", data: null});
                }else{
                    resolve(result);
                }
            });
        } else {
            return res.status(403).json({message:"Failed to supply token in authorization header.", data: null});
        }
    });
};

/**
 * Shuffle an array according to its size
 * @param sourceArray
 * @return {*}
 */
module.exports.shuffleArray = function(sourceArray) {
    for (let i = 0; i < sourceArray.length - 1; i++) {
        let j = i + Math.floor(Math.random() * (sourceArray.length - i));

        let temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
};

/**
 * Gets the unsorted original answer, the unsorted original input and compares them for keywords, returns number of found keyword answers
 * @param answerUnsorted
 * @param inputUnsorted
 * @return {Number}
 */
module.exports.keywordContains = function(answerUnsorted, inputUnsorted) {
    var answerSorted = [];
    if(answerUnsorted) {
        for (var i = 0; i < answerUnsorted.length; i++) {
            answerSorted.push(answerUnsorted[i].toLowerCase());
        }
        answerSorted.sort();
    }
    var inputSorted = [];
    if(inputUnsorted) {
        for (var i = 0; i < inputUnsorted.length; i++) {
            inputSorted.push(inputUnsorted[i].toLowerCase());
        }
        inputSorted.sort();
    }
    let ai=0, bi=0;
    let result = [];
    while( ai < answerSorted.length && bi < inputSorted.length )
    {
        if      (answerSorted[ai] < inputSorted[bi] ){ ai++; }
        else if (answerSorted[ai] > inputSorted[bi] ){ bi++; }
        else /* they're equal */
        {
            result.push(answerSorted[ai]);
            ai++;
            bi++;
        }
    }
    return result.length;
};

/**
 * Gets the answer, the input and total possible marks and amount of possible answers
 * If a user has thrown in all possible choices they will be penalized by the system.
 *
 * @param answer
 * @param input
 * @param possibleAnswers
 * @return {number}
 */
module.exports.correctChoices = function(answer, input, possibleAnswers) {
    try {
        let result = this.keywordContains(answer,input);
        let penalty = 0;
        if(input.length > possibleAnswers) {
            penalty = (input.length - possibleAnswers);
        }
        return (result - penalty);
    }catch (ex) {
        return 0;
    }
};

module.exports.arrangeOrderCount = function(correctArrangement,submittedArrangement) {
    let answerCount = 0;
    for(let i = 0; i < correctArrangement.length; i++ ) {
        if (correctArrangement[i] === submittedArrangement[i]) {
            answerCount++;
        }
    }
    return answerCount;
};


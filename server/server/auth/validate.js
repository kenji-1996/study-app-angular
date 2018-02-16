const config  = require('./config');
const utils   = require('./utils');
const process = require('process');
const bcrypt = require('bcrypt-nodejs');
let userModel = require('../models/userModel');
let tokenModel = require('../models/tokenModel');
/** Validate object to attach all functions to  */
const validate = Object.create(null);

/** Suppress tracing for things like unit testing */
const suppressTrace = process.env.OAUTHRECIPES_SURPRESS_TRACE === 'true';

/**
 * Log the message and throw it as an Error
 * @param   {String} msg - Message to log and throw
 * @throws  {Error}  The given message as an error
 * @returns {undefined}
 */
validate.logAndThrow = (msg) => {
    if (!suppressTrace) {
        console.trace(msg);
    }
    throw new Error(msg);
};

/**
 * Given a user and a password this will return the user if it exists and the password matches,
 * otherwise this will throw an error
 * @param   {Object} user     - The user profile
 * @param   {String} password - The user's password
 * @throws  {Error}  If the user does not exist or the password does not match
 * @returns {Object} The user if valid
 */
validate.user = (user, password) => {
    validate.userExists(user);
    bcrypt.compare(user.password, password, function(err, isMatch) {
        if(err) validate.logAndThrow('Failed to compare passwords');
        if(!isMatch) validate.logAndThrow('User password does not match');
    });
    return user;
};


/**
 * Given a user this will return the user if it exists otherwise this will throw an error
 * @param   {Object} user - The user profile
 * @throws  {Error}  If the user does not exist or the password does not match
 * @returns {Object} The user if valid
 */
validate.userExists = (user) => {
    if (user === null) {
        validate.logAndThrow('User does not exist');
    }
    return user;
};

/**
 * Given a token and accessToken this will return either the user or the client associated with
 * the token if valid.  Otherwise this will throw.
 * @param   {Object}  token       - The token
 * @param   {Object}  accessToken - The access token
 * @throws  {Error}   If the token is not valid
 * @returns {Promise} Resolved with the user or client associated with the token if valid
 */
validate.token = (token, accessToken) => {
    utils.verifyToken(accessToken);
    // token is a user token
    if (token.userID !== null) {
        return userModel.findOne({_id: token.userID})
            .then(user => validate.userExists(user))
            .then(user => user);
    }
};

/**
 * Given an auth code this will generate a access token, save that token and then return it.
 * @param   {userID}   userID   - The user profile
 * @param   {clientID} clientID - The client profile
 * @param   {scope}    scope    - The scope
 * @returns {Promise}  The resolved refresh token after saved
 */
validate.generateToken = ({ userID, clientID, scope }) => {
    const token      = utils.createToken({ sub : userID, exp : config.token.expiresIn });
    const expiration = config.token.calculateExpirationDate();
    let dbToken = new tokenModel({
        token: token,//Strong hashing scheme required
        expiration: expiration,
        userID: userID,
        clientID: clientID,
        scope: scope,
    });
    return dbToken.save().then(() => token);
};

/**
 * Given a token this will resolve a promise with the token if it is not null and the expiration
 * date has not been exceeded.  Otherwise this will throw a HTTP error.
 * @param   {Object}  token - The token to check
 * @returns {Promise} Resolved with the token if it is a valid token otherwise rejected with error
 */
validate.tokenForHttp = token =>
    new Promise((resolve, reject) => {
        try {
            utils.verifyToken(token);
        } catch (err) {
            const error  = new Error('invalid_token');
            error.status = 400;
            reject(error);
        }
        resolve(token);
    });

/**
 * Given a token this will return the token if it is not null. Otherwise this will throw a
 * HTTP error.
 * @param   {Object} token - The token to check
 * @throws  {Error}  If the client is null
 * @returns {Object} The client if it is a valid client
 */
validate.tokenExistsForHttp = (token) => {
    if (token === null) {
        const error = new Error('invalid_token');
        error.status = 400;
        throw error;
    }
    return token;
};

module.exports = validate;
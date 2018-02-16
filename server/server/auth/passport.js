let passport = require('passport');
let Strategy = require('passport-http-bearer').Strategy;
const { Strategy: LocalStrategy }          = require('passport-local');
const { BasicStrategy }                    = require('passport-http');
const { Strategy: ClientPasswordStrategy } = require('passport-oauth2-client-password');
const { Strategy: BearerStrategy }         = require('passport-http-bearer');
let userModel = require('../models/userModel');
let tokenModel = require('../models/tokenModel');

passport.use(new LocalStrategy((username, password, done) => {
    userModel.findOne({username: username})
        .exec(function (err,res) {
            res.verifyPassword(function (password,callback) {
                if(callback) {
                    done(null, user)
                }
            })
        })
        .then(user => validate.user(user, password))
        .then(user => done(null, user))
        .catch(() => done(null, false));
}));

passport.use(new Strategy(
    function(token, cb) {
        userModel.find({token: token})
            .exec(function(err,user) {
                if (err) { return cb(err); }
                if (!user) { return cb(null, false); }
                return cb(null, user);
            });
    }));
exports.isAuthenticated = passport.authenticate('bearer', { session: false });
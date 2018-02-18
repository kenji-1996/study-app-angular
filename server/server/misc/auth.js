var passport = require('passport');
let userModel = require('../models/userModel');
let config = require('./config');

var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var JwtStrategy = require('passport-jwt').Strategy, ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.jwtSecret;


passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    userModel.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) return done(err, false);
        if (user) done(null, user);
        else done(null, false);
    });
}));

exports.isAuthenticated = passport.authenticate('jwt', { session : false });
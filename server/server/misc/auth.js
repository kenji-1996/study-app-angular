var passport = require('passport');
let userModel = require('../models/userModel');
let config = require('./config');

var JwtStrategy = require('passport-jwt').Strategy, ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.jwtSecret;


exports.isAdmin = function(req, res, next) {
    userModel.findOne({_id: req.user._id})
        .exec(function (err,user) {
            if (err) return res.status(500).json({message: "Failed to verify user permissions", data: err});
            if(user.permissions > 3) {
                next();
            }else{
                return res.status(403).json({message: "Forbidden to access this area", data: null});
            }
        });
};

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    userModel.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) return done(err, false);
        if (user) done(null, user);
        else done(null, false);
    });
}));
exports.isAuthenticated = passport.authenticate('jwt', { session : false });

/**
 * Created by Kenji on 12/29/2017.
 *
 * Simply a 'config' page that brings the routes together for the server.
 */
//General includes
const router = require('express').Router();
const settings = require('./settings');

//Route imports
let user = require('../routes/user');
//var question = require('../routes/question');
let test = require('../routes/test');
let result = require('../routes/result');

//Router settings, ensuring json parsing
router.use(settings.bodyParser.urlencoded({ extended: true }));
router.use(settings.bodyParser.json());

//Implement the routes in the router.
//router.use(question);
router.use(user);
router.use(test);
router.use(result);

module.exports = router;

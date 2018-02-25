/**
 * Created by Kenji on 12/29/2017.
 *
 * Simply a 'config' page that brings the routes together for the server.
 */
//General includes
const router = require('express').Router();
const settings = require('./settings');
let methodOverride = require('method-override');

//Route imports
let admin = require('../routes/adminRoute');
let user = require('../routes/userRoute');
let test = require('../routes/testRoute');
let news = require('../routes/newsRoute');

//Router settings, ensuring json parsing
router.use(settings.bodyParser.urlencoded({ extended: true }));
router.use(settings.bodyParser.json());

//Implement the routes in the router.
router.use(admin);
router.use(user);
router.use(test);
router.use(news);

module.exports = router;

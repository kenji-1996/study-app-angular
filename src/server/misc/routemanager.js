/**
 * Created by Kenji on 12/29/2017.
 */
const router = require('express').Router();
const settings = require('./settings');

var user = require('../routes/user');
var question = require('../routes/question');

router.use(settings.bodyParser.urlencoded({ extended: true }));
router.use(settings.bodyParser.json());

router.use(question);
router.use(user);

module.exports = router;

/**
 * Created by Kenji on 12/29/2017.
 */
/**
 * Work in progress
 */
const router = require('express').Router();
let authController = require('../controllers/authController');
let settings = require('../misc/settings');

router.route('/auth')
    .get(authController.getUsers);

router.route('/auth/register')
    .get(authController.isAuthenticated,authController.getUsers)
    .post(authController.postRegister);

router.route('/auth/login')
    .post(authController.postLogin);

module.exports = router;
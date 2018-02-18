/**
 * Created by Kenji on 12/29/2017.
 */
/**
 * Work in progress
 */
const router = require('express').Router();
let authController = require('../controllers/authController');
let auth = require('../misc/auth');

router.route('/auth')
    .get(auth.isAuthenticated,authController.getUsers)
    .post(authController.postLogin);

router.route('/auth/register')
    .get(auth.isAuthenticated,authController.getUsers)
    .post(authController.postRegister);

router.route('/auth/login')
    .post(authController.postLogin);

module.exports = router;
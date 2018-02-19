/**
 * Created by Kenji on 12/29/2017.
 */
/**
 * Work in progress
 */
const router = require('express').Router();
let authController = require('../controllers/authController');
let auth = require('../misc/auth');

//router.route('/auth')
    //May add 0auth2 protocal here so people can access my API
    //.get(auth.isAuthenticated,authController.getUsers)
    //.post(authController.postLogin);

router.route('/auth/register')
    .post(authController.postRegister);

router.route('/auth/login')
    .post(authController.postLogin);

module.exports = router;
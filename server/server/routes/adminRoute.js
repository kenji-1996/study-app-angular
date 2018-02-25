/**
 * Created by Kenji on 12/29/2017. - User API
 */
const router = require('express').Router();
let adminController = require('../controllers/adminController');
let auth = require('../misc/auth');

router.route('/admin')
    //.get(userController.getLogin)


router.route('/admin/users')
    .get(auth.isAuthenticated,auth.isAdmin,adminController.listUsers)
    .post(auth.isAuthenticated,auth.isAdmin,adminController.addUser)

router.route('/admin/users/:userId')
    .delete(auth.isAuthenticated,auth.isAdmin,adminController.deleteUser)

module.exports = router;
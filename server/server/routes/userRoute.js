/**
 * Created by Kenji on 12/29/2017. - User API
 */
const router = require('express').Router();
let userController = require('../controllers/userController');
let auth = require('../misc/auth');

/**
 * /api/users [GET]
 * How we authenticate users, the get function sends a username and password
 * in basic authentication header, it gets checked and a valid token is returned
 * the expiry of this token depends on if the user sends 'rememberMe'
 *
 * /api/users [POST]
 * A new user can create their account, they can also optionally set profile information
 * Data gets sent in body, a user is added and validated.
 */
router.route('/users')
    .get(userController.getLogin)
    .post(userController.postRegister);

/**
 * /api/users/:userId [GET]
 * The user making the request gets their details listed (For profile information)
 *
 * /api/users/:userId [PUT]
 * A user can update certain aspects of their information from their profile
 *
 * /api/users/:userId [DELETE]
 * A user can close their own account, this is likely to be a soft close and generated users cannot
 */
router.route('/users/:userId')
    .get(auth.isAuthenticated,userController.listUser)
    .put(auth.isAuthenticated,userController.updateUser)
    .delete(auth.isAuthenticated,userController.deleteUser);

/**
 * No authored test listing here
 * @param tests[] in userModel (allocated non-editable)
 */
//------------------Self-----------------
router.route('/users/:userId/tests/self')
    .get(auth.isAuthenticated,userController.selfListTests)
    .post(auth.isAuthenticated,userController.selfAddTest);
router.route('/users/:userId/tests/self/:testId')
    .delete(auth.isAuthenticated,userController.selfRemoveTest);
    /*TODO: add submitting and getting of results for self*/

//------------------Allocated-------------
router.route('/users/:userId/tests/allocated')
    .get(auth.isAuthenticated,userController.allocatedListTests)
    .post(auth.isAuthenticated,userController.allocatedSubmitTest);
router.route('/users/:userId/tests/allocated/:testId')
    .delete(auth.isAuthenticated,userController.allocatedRemoveTest);
router.route('/users/:userId/tests/allocated/results')
    .get(auth.isAuthenticated,userController.allocatedListAllResults);
router.route('/users/:userId/tests/allocated/results/:testId')
    .get(auth.isAuthenticated,userController.allocatedListResults);

//------------------Authored-------------
router.route('/users/:userId/tests/authored')
    .get(auth.isAuthenticated,userController.authorListTests);
router.route('/users/:userId/tests/authored/users')
    .post(auth.isAuthenticated,userController.authorAssignTest);
router.route('/users/:userId/tests/authored/users/:userTestId/:testId')
    .delete(auth.isAuthenticated,userController.authorUnassignTest);

//------------------Groups-------------
router.route('/users/:userId/groups')
    .get(auth.isAuthenticated,userController.listUserGroups)
    .post(auth.isAuthenticated, userController.joinUserGroup);
router.route('/users/:userId/groups/:groupId')
    .delete(auth.isAuthenticated, userController.leaveUserGroup);
module.exports = router;
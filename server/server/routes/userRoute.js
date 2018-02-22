/**
 * Created by Kenji on 12/29/2017. - User API
 */
const router = require('express').Router();
let userController = require('../controllers/userController');
let authController = require('../controllers/authController');
let auth = require('../misc/auth');

router.route('/users')
    .get(userController.getLogin)
    .post(userController.postRegister);

router.route('/users/:userId')
    .get(auth.isAuthenticated,userController.listUser)
    .put(auth.isAuthenticated,userController.updateUser)
    .delete(auth.isAuthenticated,userController.deleteUser);

/**
 * No authored test listing here
 * @param tests[] in userModel (allocated non-editable)
 */
router.route('/users/:userId/tests')//Get all allocated tests, not authored!
    //.get() - List all tests combined
    .post(auth.isAuthenticated,userController.selfAllocateTest);

//------------------Self-----------------
router.route('/users/:userId/tests/self')
    .get(auth.isAuthenticated,userController.listSelfAllocatedTests);
    //.post() - submit their test
    //.delete() - user can remove their own self allocated tests
    //.put() - user can update their test settings/questions? TODO: decide if they can
router.route('/users/:userId/tests/self/attempts')
    .get(auth.isAuthenticated,userController.listAllUserTests);
router.route('/users/:userId/tests/self/attempts/:testId')
    .get(auth.isAuthenticated,userController.listAllUserTests);

//------------------Allocated-------------
router.route('/users/:userId/tests/allocated')
    .get(auth.isAuthenticated,userController.listAllocatedTests)
    .post(auth.isAuthenticated,userController.submitTest);
    //.delete() - if settings say so, user can delete their allocated test
router.route('/users/:userId/tests/allocated/attempts')
    .get(auth.isAuthenticated,userController.listAllUserTests);
router.route('/users/:userId/tests/allocated/attempts/:testId')
    .get(auth.isAuthenticated,userController.listTestResults);


router.route('/users/:userId/authored')
    .get(auth.isAuthenticated,userController.listAllAuthoredTests)
    .post(auth.isAuthenticated,userController.authorAssigned);

//Remove allocated test from test
router.route('/users/:userId/authored/:testId/:targetUserId')
    .delete(auth.isAuthenticated,userController.removeAssignedTest)

module.exports = router;
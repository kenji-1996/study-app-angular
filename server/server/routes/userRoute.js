/**
 * Created by Kenji on 12/29/2017. - User API
 */
const router = require('express').Router();
let userController = require('../controllers/userController');
let auth = require('../misc/auth');

router.route('/users/:userId')
    .get(auth.isAuthenticated,userController.listUser)
    .put(auth.isAuthenticated,userController.updateUser)
    .delete(auth.isAuthenticated,userController.deleteUser)

/**
 * No authored test listing here
 * @param tests[] in userModel (allocated non-editable)
 */
router.route('/users/:userId/tests')//Get all allocated tests, not authored!
    .get(auth.isAuthenticated,userController.listAllocatedTests);

//Get self allocated tests
router.route('/users/:userId/self')
    .get(auth.isAuthenticated,userController.listSelfAllocatedTests)
    .post(auth.isAuthenticated,userController.selfAllocateTest);

router.route('/users/:userId/results')
    .get(auth.isAuthenticated,userController.listAllUserTests)
    .put(auth.isAuthenticated,userController.submitTest);

router.route('/users/:userId/results/:testId')
    .get(auth.isAuthenticated,userController.listTestResults);

router.route('/users/:userId/authored')
    .get(auth.isAuthenticated,userController.listAllAuthoredTests)
    .post(auth.isAuthenticated,userController.authorAssigned);

//Remove allocated test from test
router.route('/users/:userId/authored/:testId/:targetUserId')
    .delete(auth.isAuthenticated,userController.removeAssignedTest)

module.exports = router;
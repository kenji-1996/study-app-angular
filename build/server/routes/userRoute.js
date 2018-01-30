/**
 * Created by Kenji on 12/29/2017. - User API
 */
const router = require('express').Router();
let userController = require('../controllers/userController');

router.route('/users')
    .get(function(req,res) {
        userController.listUsers(req,res);
    })
    .post(function(req,res) {
        userController.authenticateUser(req,res);
    });


router.route('/users/:userId')
    .get(function(req,res) {
        userController.listUser(req,res);
    })
    .put(function(req,res) {
        userController.updateUser(req,res);
    })
    .delete(function(req,res) {
        userController.deleteUser(req,res);
    });

/**
 * No authored test listing here
 * @param tests[] in userModel (allocated non-editable)
 */
router.route('/users/:userId/tests')//Get all allocated tests, not authored!
    .get(function(req,res) {
        userController.listAllocatedTests(req, res);
    })
    .post(function(req,res) {
        userController.selfAllocateTest(req,res);
    });

router.route('/users/:userId/results')
    .get(function(req,res) {
        userController.listAllTestResults(req,res);
    })
    .post(function (req,res) {
        userController.submitTest(req, res);
    });

router.route('/users/:userId/results/:testId')
    .get(function(req,res){
        userController.listTestResults(req,res);
    });

router.route('/users/:userId/authored')
    .get(function(req,res) {
        userController.listAllAuthoredTests(req,res);
    })
    .post(function(req,res) {
        userController.authorAssigned(req,res);
    });

module.exports = router;
/**
 * Created by Kenji on 12/29/2017. - User API
 */
const router = require('express').Router();
let testController = require('../controllers/userController');

router.route('/users')
    .get(function(req,res) {
        testController.listUsers(req,res);
    })
    .post(function(req,res) {
        testController.authenticateUser(req,res);
    });


router.route('/users/:userId')
    .get(function(req,res) {
        testController.listUser(req,res);
    })
    .put(function(req,res) {
        testController.updateUser(req,res);
    })
    .delete(function(req,res) {
        testController.deleteUser(req,res);
    });

/**
 * No authored test listing here
 * @param tests[] in userModel (allocated non-editable)
 */
router.route('/users/:userId/tests')//Get all allocated tests, not authored!
    .get(function(req,res) {
        testController.listAllocatedTests(req,res);
    })
    .post(function(req,res) {
       testController.addAllocatedTest(req,res);
    });
    //allocated test removal add
router.route('/users/:userId/results')
    .get(function(req,res) {
        testController.listAllTestResults(req,res);
    });

router.route('/users/:userId/results/:testId')
    .get(function(req,res) {
        testController.listTestResults(req,res);
    });


module.exports = router;
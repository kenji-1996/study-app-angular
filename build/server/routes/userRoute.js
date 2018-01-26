/**
 * Created by Kenji on 12/29/2017. - User API
 */
const router = require('express').Router();
let testController = require('../controllers/userController');

router.route('/users')
    .get(function(req,res) {
        try {
            testController.listUsers(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong getting users", data: err});
        }
    })
    .post(function(req,res) {
        try {
            testController.authenticateUser(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong posting to users", data: err});
        }
    });


router.route('/users/:userId')
    .get(function(req,res) {
        try {
            testController.listUser(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong getting user", data: err});
        }
    })
    .put(function(req,res) {
        try {
            testController.updateUser(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong updating user", data: err});
        }
    })
    .delete(function(req,res) {
        try {
            testController.deleteUser(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong deleting user", data: err});
        }
    });

/**
 * No authored test listing here
 * @param tests[] in userModel (allocated non-editable)
 */
router.route('/users/:userId/tests')//Get all allocated tests, not authored!
    .get(function(req,res) {
        try {
            testController.listAllocatedTests(req, res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong getting user tests", data: err});
        }
    })
    .post(function(req,res) {
        try {
            testController.addAllocatedTest(req,res);
        } catch (err) {
            return res.status(500).json({message: "Find results query failed", data: err});
        }

    });
    //allocated test removal add
router.route('/users/:userId/results')
    .get(function(req,res) {
        try {
            testController.listAllTestResults(req,res);
        } catch (err) {
            return res.status(500).json({message: "Find results query failed", data: err});
        }
    });

router.route('/users/:userId/results/:testId')
    .get(function(req,res) {
        try {
            testController.listTestResults(req,res);
        } catch (err) {
            return res.status(500).json({message: "Find results query failed", data: err});
        }
    });


module.exports = router;
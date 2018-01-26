/**
 * Created by Kenji on 12/29/2017.
 */
//Question API
const router = require('express').Router();
let testController = require('../controllers/testController');

router.route('/tests')
    .get(function(req,res) {
            testController.listTests(req,res);
    })
    .post(function(req,res) {
        testController.createTest(req,res);
    });

router.route('/tests/:testId')
    .get(function(req,res) {
        try {
            testController.listTest(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong fetching test", data: err});
        }
    })
    .put(function(req,res) {
        try {
            testController.updateTest(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong updating test", data: err});
        }

    })
    .delete(function(req,res) {
        try {
            testController.hardDeleteTest(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong deleting test", data: err});
        }
    });

router.route('/tests/:testId/questions')
    .get(function(req,res) {
        try {
            testController.listTestQuestions(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong getting test questions", data: err});
        }
    })
    .post(function(req,res) {
        try {
            testController.updateQuestions(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong posting test questions", data: err});
        }
    });

module.exports = router;
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
        testController.listUserTest(req,res);
    })
    .put(function(req,res) {
        testController.updateTest(req,res);

    })
    .delete(function(req,res) {
        testController.hardDeleteTest(req,res);
    });
router.route('/tests/author/:testId')
    .get(function(req,res) {
        testController.listTest(req,res);
    });

router.route('/tests/:testId/questions')
    .get(function(req,res) {
        testController.listTestQuestions(req,res);
    })
    .post(function(req,res) {
        testController.updateQuestions(req,res);
    });

module.exports = router;
/**
 * Created by Kenji on 12/29/2017.
 */
//Question API
const router = require('express').Router();
let testController = require('../controllers/testController');
let auth = require('../misc/auth');


router.route('/tests')
    .get(auth.isAuthenticated,testController.listTests)
    .post(auth.isAuthenticated,testController.createTest);

router.route('/tests/:testId')
    .get(auth.isAuthenticated,testController.listUserTest)
    .put(auth.isAuthenticated,testController.updateTest)
    .delete(auth.isAuthenticated,testController.hardDeleteTest);

router.route('/tests/:testId/submitlist')
    .get(auth.isAuthenticated,testController.listSubmits)
    .post(auth.isAuthenticated,testController.reviewSubmits);

//Self allocated (not allocated by author!)
router.route('/tests/:testId/self/:allocatedId')
    .get(function(req,res) {
        res.json({message:'work in progress ):',data:null});
        //testController.listUserTest(req,res);
    })
    .put(function(req,res) {
        //testController.updateTest(req,res);
        res.json({message:'work in progress ):',data:null});
    })
    .delete(auth.isAuthenticated,testController.removeSelfAllocatedTest);
router.route('/tests/author/:testId')
    .get(auth.isAuthenticated,testController.listTest);

router.route('/tests/:testId/questions')
    .get(auth.isAuthenticated,testController.listTestQuestions)
    .get(auth.isAuthenticated,testController.updateQuestions);

module.exports = router;
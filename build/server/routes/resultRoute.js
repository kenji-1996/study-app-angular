/**
 * Created by Kenji on 12/29/2017.
 */
//Question API
const router = require('express').Router();
let resultController = require('../controllers/resultController');

router.route('/results')
    .get(function(req,res) {
        resultController.listResultsDepreciated(req,res);
    })
    .post(function(req,res) {
        resultController.submitUserResult(req,res);
    });

router.route('/results/:resultId')
    .get(function(req,res) {
        resultController.listResult(req,res);
    })
    .put(function(req,res) {
        resultController.updateResult(req,res);
    })
    .delete(function(req,res) {
        resultController.deleteResult(req,res);
    });

module.exports = router;
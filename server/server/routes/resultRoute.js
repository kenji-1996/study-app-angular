/**
 * Created by Kenji on 12/29/2017.
 */
//Question API
const router = require('express').Router();
let resultController = require('../controllers/resultController');

router.route('/results')
    .get(function(req,res) {
        try {
            resultController.listResultsDepreciated(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong fetching all results", data: err});
        }
    })
    .post(function(req,res) {
        try {
            resultController.submitUserResult(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong creating result", data: err});
        }
    });

router.route('/results/:resultId')
    .get(function(req,res) {
        try {
            resultController.listResult(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong fetching the result", data: err});
        }
    })
    .put(function(req,res) {
        try {
            resultController.updateResult(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong updating the result", data: err});
        }
    })
    .delete(function(req,res) {
        try {
            resultController.deleteResult(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong deleting the result", data: err});
        }
    });

module.exports = router;
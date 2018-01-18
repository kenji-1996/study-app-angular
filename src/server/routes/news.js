/**
 * Created by Kenji on 12/29/2017.
 */
//Question API
const router = require('express').Router();
let newsController = require('../controllers/newsController');

router.route('/news')
    .get(function(req,res) {
        newsController.listAllNews(req,res);
    })
    .post(function(req,res) {
        newsController.createNews(req,res);
    });

router.route('/news/:newsId')
    .get(function(req,res) {
        newsController.listNews(req,res);
    })
    .put(function(req,res) {
        newsController.updateResult(req,res);
    })
    .delete(function(req,res) {
        newsController.deleteResult(req,res);
    });

module.exports = router;
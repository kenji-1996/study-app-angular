/**
 * Created by Kenji on 12/29/2017.
 */
//Question API
const router = require('express').Router();
let newsController = require('../controllers/newsController');

router.route('/news')
    .get(function(req,res) {
        try {
            newsController.listAllNews(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong fetching all news", data: err});
        }

    })
    .post(function(req,res) {
        try {
            newsController.createNews(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong creating news", data: err});
        }

    });

router.route('/news/:newsId')
    .get(function(req,res) {
        try {
            newsController.listNews(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong fetching news", data: err});
        }
    })
    .put(function(req,res) {
        try {
            newsController.updateNews(req,res);
        } catch (err) {
            return res.status(500).json({message: "Something went wrong updating news", data: err});
        }
    })
    .delete(function(req,res) {
        try {
            newsController.deleteNews(req,res);
        } catch (err) {
            return res.status(500).json({message: "Find results query failed", data: err});
        }
    });

module.exports = router;
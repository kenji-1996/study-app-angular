/**
 * Created by Kenji on 12/29/2017.
 */
//Question API
const router = require('express').Router();
let newsController = require('../controllers/newsController');
let auth = require('../misc/auth');

router.route('/news')
    .get(auth.isAuthenticated,newsController.listAllNews)
    .post(auth.isAuthenticated,newsController.createNews);

router.route('/news/:newsId')
    .get(newsController.listNews)
    .put(auth.isAuthenticated,newsController.updateNews)
    .delete(auth.isAuthenticated,newsController.deleteNews);

module.exports = router;
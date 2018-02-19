/**
 * Created by Kenji on 12/29/2017.
 */
//Question API
const router = require('express').Router();
let resultController = require('../controllers/resultController');
let auth = require('../misc/auth');

router.route('/results')
    .get(auth.isAuthenticated,resultController.listResultsDepreciated)
    .post(auth.isAuthenticated,resultController.submitUserResult);

router.route('/results/:resultId')
    .get(auth.isAuthenticated,resultController.listResult)
    .put(auth.isAuthenticated,resultController.updateResult)
    .delete(auth.isAuthenticated,resultController.deleteResult);

module.exports = router;
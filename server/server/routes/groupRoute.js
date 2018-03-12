/**
 * Created by Kenji on 12/29/2017.
 */
//Question API
const router = require('express').Router();
let groupController = require('../controllers/groupController');
let auth = require('../misc/auth');

router.route('/groups')
    .get(auth.isAuthenticated,groupController.listAllGroups)
    .post(auth.isAuthenticated,groupController.addGroup);

router.route('/groups/:groupId')
    .get(auth.isAuthenticated,groupController.listGroup)
    .put(auth.isAuthenticated,groupController.updateGroup)
    .delete(auth.isAuthenticated,groupController.deleteGroup);

module.exports = router;
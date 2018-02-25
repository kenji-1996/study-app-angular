/**
 * Created by Kenji on 1/8/2018.
 */
let userAuth = require('./userAuth');
let userDetail = require('./userDetail');
let selfTest = require('./tests/selfTest');
let allocatedTest = require('./tests/allocatedTest');
let authorTest = require('./author/authorTest');

/**
 * ./userAuth.js
 * /api/users - POST, GET
 */
exports.postRegister = userAuth.postRegister;
exports.getLogin = userAuth.getLogin;

/**
 * ./userDetail.js
 * /api/users/:userId - GET, PUT, DELETE
 */
exports.listUser = userDetail.listUser;
exports.updateUser = userDetail.updateUser;
exports.deleteUser = userDetail.deleteUser;

/**
 * ./tests/selfTest.js
 * /api/users/:userId/tests/self
 */
exports.selfListTests = selfTest.listTests;//GET /api/users/:userId/tests/self
exports.selfAddTest = selfTest.addTest;//POST /api/users/:userId/tests/self
exports.selfRemoveTest = selfTest.removeTest;//DELETE /api/users/:userId/tests/self/:testId


/**
 * ./tests/allocatedTest.js
 * /api/users/:userId/tests/allocated
 */
exports.allocatedListTests = allocatedTest.listTests;//GET /api/users/:userId/tests/allocated
exports.allocatedSubmitTest = allocatedTest.submitTest;//POST /api/users/:userId/tests/allocated
exports.allocatedRemoveTest = allocatedTest.removeTest;//DELETE /api/users/:userId/allocated/:testId
exports.allocatedListAllResults = allocatedTest.listAllResults;//GET /api/users/:userId/tests/allocated/results
exports.allocatedListResults = allocatedTest.listResults;//GET /api/users/:userId/tests/allocated/results/:testId


//---------------------------------------------------------Authored restful API here --------------------------------------
/**
 * ./author/authorTest.js
 * /api/users/:userId/tests/authored
 */
exports.authorListTests = authorTest.listTests;//GET /api/users/:userId/tests/authored
exports.authorAssignTest = authorTest.assignTest;//POST /api/users/:userId/tests/authored/users
exports.authorUnassignTest = authorTest.unassignTest;//DELETE /api/users/:userId/tests/authored/users/:targetUserId/:targetTestId
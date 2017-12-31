/**
 * Created by Kenji on 12/29/2017.
 */
//User API
const router = require('express').Router();
var settings = require('../../misc/settings');
var USER = require('../../models/user');

router.route('/user')
    .post((req,res) => {
            if (req.body.action == 'get') {
                var idtoken = req.body.idtoken;
                settings.verify(idtoken).then((result) => {
                    if(result) {

                    }else{
                        res.json({result: 'failed to validate session'});
                    }
                });
            }else{
                var user = new USER();
                var idtoken = req.body.idtoken;
                settings.userPayload(idtoken).then((result) => {
                    if (result) {
                        user.unique_id = result['sub'];
                        user.email = result['email'];
                        user.name = result['name'];
                        user.source = result['iss'];
                        user.picture = result['picture'];
                        user.permissions = 0;
                        USER.findOne({'unique_id' : result['sub'] }, (err, result) => {
                            if(result) {
                                res.json(result);
                            }else{
                                user.save((err) => {
                                    if (err)
                                        res.send(err);

                                    res.json(result);
                                });
                            }
                        });
                    } else {
                        res.json({result: "invalid id token"});
                    }
                });
            }
        })
    .get((req, res) => {
        res.json({result: 'api works'});
    });

var profile = require('./profile');
router.use('profile',profile);
module.exports = router;
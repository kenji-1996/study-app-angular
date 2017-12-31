/**
 * Created by Kenji on 12/31/2017.
 */
/**
 * Created by Kenji on 12/29/2017.
 */
//User API
const router = require('express').Router();
var settings = require('../../misc/settings');


router.route('/profile')
    .post((req,res) => {
        if (req.body.action == 'get') {
            var idtoken = req.body.idtoken;
            settings.verify(idtoken).then((result) => {
                if(result) {

                }else{
                    res.json({result: 'failed to validate session'});
                }
            });
        }
    })
    .get((req, res) => {
        res.json({result: 'profile works'});
    });
module.exports = router;
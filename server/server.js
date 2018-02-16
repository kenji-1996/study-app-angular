/**
 * Created by kenji on 21/11/17.
 */
let express = require('express');
let passport = require('passport');
let session = require('express-session');
const config  = require('./server/auth/config');
let oauth2orize = require('oauth2orize');
const app = express();
const cors = require('cors');
const html = __dirname + '/dist';

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.options('*', cors());
app.use('/api', require('./server/misc/routemanager'));

app.use(passport.initialize());
app.use(passport.session());

/**
 * Uncomment when going live
 */
/*app.use(express.static(html));
app.get('*', function(req, res) {
    res.sendFile(html + '/index.html')
});*/

app.listen(4949, () => {
    console.log(`Node Express server listening on http://localhost:4949`);
});
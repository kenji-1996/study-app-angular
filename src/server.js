/**
 * Created by kenji on 21/11/17.
 */
var express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.options('*', cors());
app.use('/api', require('./server/misc/routemanager'));


app.listen(8080, () => {
    console.log(`Node Express server listening on http://localhost:8080`);
});
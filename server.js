import express from 'express'
import bodyParser from 'body-parser'
import protocol from 'http'
import dotenv from 'dotenv'
import path from 'path'

let app = express();
let http = protocol.Server(app);
// configuration ===========================================

// load environment variables,
// either from .env files (development),
// heroku environment in production, etc...
dotenv.load();

app.use(express.static(path.join(__dirname, '/public')));

// parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine ejs
app.set('view engine', 'ejs');

// routes
require('./app/routes/routes')(app);

// port for Heroku
app.set('port', (process.env.PORT || 5000));

// START ===================================================
http.listen(app.get('port'), () => {
  console.log(`listening on port ${app.get('port')}`)
});

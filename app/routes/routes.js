import { handler } from '../controllers/botkit'

module.exports = function (app) {

  app.get('/', function (req, res) {
    res.render('home')
  });

  app.get('/webhook', function (req, res) {

    // This enables subscription to the webhooks
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.FACEBOOK_VERIFY_TOKEN) {
      res.send(req.query['hub.challenge'])
    }
    else {
      res.send('Incorrect verify token')
    }
  });

  app.post('/webhook', function (req, res) {
    handler(req.body);

    res.send('ok')
  })
};
var strftime = require('strftime');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var axios = require('axios');
var app = express();
var config = require('./config.json');

if (!config) {
  console.error('Config not found!');
  return;
}

app.use(cors());
app.use(bodyParser.json());

app.put(config.routeName, function(req, res) {
  if (!req.body.length) return;

  req.body.forEach(logEntry => {
    axios
      .post(config.logstashUrl, {
        ...logEntry,
        type: config.type,
        index: strftime(config.index)
      })
      .then(() => {
        res.send('');
      })
      .catch(error => {
        console.error('Error connecting to logstash.', error.toString());
        res.status(500).send('');
      });
  });
});

app.listen(config.listenPort, function() {
  console.log('recordatus listening on port ' + config.listenPort);
});

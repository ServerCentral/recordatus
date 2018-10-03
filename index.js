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

function handleRequest(req, res) {
  if (!req.body) return;

  let body = req.body;

  // If an individual JSON object is passed in, put into an
  // array ("batch of one")
  if (!Array.isArray(req.body)) {
    body = [req.body];
  }

  let requests = [];

  body.forEach(logEntry => {
    let request = axios.post(config.logstashUrl, {
      ...logEntry,
      type: config.type,
      index: strftime(config.index)
    });

    requests.push(request);
  });

  axios
    .all(requests)
    .then(() => {
      res.send('');
    })
    .catch(error => {
      console.error('Error connecting to logstash.', error.toString());
      res.status(500).send('');
    });
}

// Some logging tools like StackTrace.js POST entries to an endpoint
app.post(config.routeName, handleRequest);

// Others, like bunyan will PUT log entries
app.put(config.routeName, handleRequest);

app.listen(config.listenPort, function() {
  console.log('recordatus listening on port ' + config.listenPort);
});

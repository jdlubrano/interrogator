'use strict';

function verifySlackRequestTimestamp(event) {
  var nowTs = Date.now() / 1000;
  var requestTs = +event.headers['X-Slack-Request-Timestamp'];
  var fiveMinutes = 5 * 60;

  if ((nowTs - requestTs) > fiveMinutes) {
    throw new Error('This request appears to be more than 5 minutes old and may be a replay attack');
  }
}

function verifySlackRequestSignature(event) {
  const crypto = require('crypto');

  var secret = '<secret>';

  var body = event.body;
  var requestTs = event.headers['X-Slack-Request-Timestamp'];
  var message = `v0:${requestTs}:${body}`;

  const hash = 'v0=' + crypto.createHmac('sha256', secret)
                             .update(message)
                             .digest('hex');

  if (hash !== event.headers['X-Slack-Signature']) {
    throw new Error(`Slack request signature validation failed (hash: ${hash})`);
  }
}

module.exports.challenge = (event, context, callback) => {
  console.log(event);
  console.log(JSON.parse(event.body));

  const response = {
    statusCode: 200,
    body: JSON.stringify({ challenge: JSON.parse(event.body).challenge })
  };

  callback(null, response);
};

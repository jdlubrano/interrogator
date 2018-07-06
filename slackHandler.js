'use strict';

const path = require('path');
const SlackEventHandler = require(path.join(__dirname, 'src', 'SlackEventHandler'));
const SlackRequestVerifier = require(path.join(__dirname, 'src', 'SlackRequestVerifier'));

module.exports.handleChallenge = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ challenge: JSON.parse(event.body).challenge })
  };

  callback(null, response);
};

module.exports.handleEvent = (event, context, callback) => {
  let requestVerifier = new SlackRequestVerifier();
  requestVerifier.verifyRequest(event);

  let eventHandler = new SlackEventHandler(event);

  callback(null, eventHandler.response());
};

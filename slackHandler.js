'use strict';

module.exports.challenge = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ challenge: JSON.parse(event).challenge })
  };
};

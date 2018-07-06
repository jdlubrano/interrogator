const config = require('config');
const crypto = require('crypto');

class SlackRequestVerifier {
  constructor() {
    this.secretKey = config.get('Slack.secretKey');
  }

  verifyRequest(request) {
    this.verifyTimestamp(request);
    this.verifySignature(request);
  }

  verifyTimestamp(request) {
    var nowTs = Date.now() / 1000;
    var requestTs = this._extractTimestamp(request);
    var fiveMinutes = 5 * 60;

    if ((nowTs - requestTs) > fiveMinutes) {
      throw new Error('This request appears to be more than 5 minutes old and may be a replay attack');
    }
  }

  verifySignature(request) {
    const requestTs = this._extractTimestamp(request);
    const message = `v0:${requestTs}:${request.body}`;
    const hash = `v0=${crypto.createHmac('sha256', this.secretKey).update(message).digest('hex')}`;

    if (hash !== request.headers['X-Slack-Signature']) {
      throw new Error(`Slack request signature validation failed (hash: ${hash})`);
    }
  }

  _extractTimestamp(request) {
    return +request.headers['X-Slack-Request-Timestamp'];
  }
}

module.exports = SlackRequestVerifier;

const assert = require('assert');
const config = require('config');
const sinon = require('sinon');

const SlackRequestVerifier = require('../src/SlackRequestVerifier');

describe('SlackRequestVerifier', () => {
  describe('constructor', () => {
    it('initializes the secret key', () => {
      let verifier = new SlackRequestVerifier();

      assert(!!verifier.secretKey);
      assert.strictEqual(verifier.secretKey, config.get('Slack.secretKey'));
    });
  });

  describe('verifyRequest', () => {
    function nowTs() {
      return Date.now() / 1000;
    }

    it('throws an error if the request timestamp is more than 5 minutes old', () => {
      let verifier = new SlackRequestVerifier();

      const request = {
        headers: { 'X-Slack-Request-Timestamp': nowTs() - (5 * 60 + 1) }
      };

      assert.throws(() => verifier.verifyRequest(request), /more than 5 minutes/);
    });

    it('throws an error if the request signature is not authentic', () => {
      let verifier = new SlackRequestVerifier();

      const request = {
        body: 'blah blah blah',
        headers: {
          'X-Slack-Request-Timestamp': nowTs(),
          'X-Slack-Signature': 'some phony hash'
        }
      };

      assert.throws(() => verifier.verifyRequest(request), /signature validation failed/);
    });

    it('does not throw an error if the signature and timestamps are valid', () => {
      let clock = sinon.useFakeTimers();
      let verifier = new SlackRequestVerifier();

      const request = {
        body: 'the request body',
        headers: {
          'X-Slack-Request-Timestamp': nowTs(),
          'X-Slack-Signature': 'v0=c413505c2439b7435c4efebbfd09f1788139d9f70fa71026f6fb84de87adb0cd'
        }
      };

      assert.doesNotThrow(() => verifier.verifyRequest(request));
      clock.restore();
    });
  });
});

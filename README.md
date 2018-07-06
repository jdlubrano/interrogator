# Interrogator

A modest Slack app

## Dependencies

- AWS CLI
- NodeJS 8
- [Serverless](https://serverless.com)

## Development Setup

You may need access to the Interrogator S3 bucket in order to download the
secrets file.  Once you have credentials, you can run `bin/get_secrets` to
download the secrets file.

## Tests

You can run the test suite using `npm test`.
See the `package.json` file for more test commands.

## Deployment

You can deploy using the following commands:

```
# Deploy the entire stack (to the dev stage)
sls deploy

# Deploy the entire stack (to prod)
sls deploy --stage prod

# Deploy a specific function
sls deploy function --function slackEvent
```

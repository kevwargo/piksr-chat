# Serverless chat application

Created using AWS Lambda, S3 and DynamoDB.

## Testing

1. Visit: http://piksr-chat.s3-website.eu-central-1.amazonaws.com
2. Choose your username
3. Visit http://piksr-chat.s3-website.eu-central-1.amazonaws.com in another tab
4. Choose different username
5. Join a channel with the same name in both tabs
6. Write some test messages


## Notes

* Lambda was created and attached to API endpoint from web interface
* S3 web hosting was created from web interface
* DynamoDB table was created using `aws dynamodb create-table --cli-input-json file://dynamodb-table.json`
* For Lambda code and static website content updating `deploy.sh` script was used

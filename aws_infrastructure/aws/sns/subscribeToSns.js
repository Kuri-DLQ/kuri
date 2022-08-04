import AWS from "aws-sdk"
import dotenv from 'dotenv'
dotenv.config({path:'./.env'})
const sns = new AWS.SNS({ apiVersion: '2010-03-31', region: process.env.REGION })
import { getAccountId } from '../lambda/awsAccountId';

const dynamoParams = {
  Protocol: 'lambda',
  TopicArn: process.env.SNS_ARN,
  Endpoint: `arn:aws:lambda:${process.env.REGION}:${getAccountId()}:function:writeToDynamoLambda`,
  ReturnSubscriptionArn: true || false
};
sns.subscribe(dynamoSubscription, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  // else     console.log('success' ,data);           // successful response
});

const slackParams = {
  Protocol: 'lambda',
  TopicArn: process.env.SNS_ARN,
  Endpoint: `arn:aws:lambda:${process.env.REGION}:${getAccountId()}:function:writeToDynamoLambda`,
  ReturnSubscriptionArn: true || false
};
sns.subscribe(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  // else     console.log('success' ,data);           // successful response
});
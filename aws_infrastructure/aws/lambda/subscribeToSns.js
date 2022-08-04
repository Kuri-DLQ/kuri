import AWS from 'aws-sdk';
import dotenv from 'dotenv'
dotenv.config({path:'../../../.env'})
import { getAccountId } from './awsAccountId.js';

export const subscribeToSns = (region, snsArn) => {
  const sns = new AWS.SNS({ apiVersion: '2015-03-31', region })
  
  return new Promise(async (resolve, reject) => {
    const dynamoParams = {
      Protocol: 'lambda',
      TopicArn: snsArn,
      Endpoint: `arn:aws:lambda:${region}:${getAccountId()}:function:writeToDynamoLambda`,
      ReturnSubscriptionArn: true || false
    };
    
    await sns.subscribe(dynamoParams, function(err, data) {
      if (err) reject(err) //console.log(err, err.stack);
      // else     console.log('success', data);
    });
    
    const slackParams = {
      Protocol: 'lambda',
      TopicArn: snsArn,
      Endpoint: `arn:aws:lambda:${region}:${getAccountId()}:function:postToSlackLambda`,
      ReturnSubscriptionArn: true || false
    };
    
    await sns.subscribe(slackParams, function(err, data) {
      if (err) reject(err) //console.log(err, err.stack);
      // else     console.log('success', data);
    });
    resolve();  
  });  
}
import { lambdaClient } from '../clients/lambdaClient.js'
import dotenv from 'dotenv'
dotenv.config({path:'../../../.env'})

import { CreateFunctionCommand } from "@aws-sdk/client-lambda";

import AWS from 'aws-sdk'

export async function createLambda(args) {
  var params = {
    Code: {
      S3Bucket: 'kuri-dlq-bucket-arjun',
      S3Key: 'publishToSnsLambda.js.zip',
    },
    FunctionName: 'publishToSnsLambda',
    Role: `${process.env.ROLE_ARN}`,
    EphemeralStorage: {
      Size: '512'
    },
    Environment: {
      Variables: {
        'REGION': process.env.REGION,
        'SNS_ARN': process.env.SNS_ARN
      }
    },
    Handler: 'publishToSnsLambda.handler',
    Runtime: "nodejs12.x"
};
  
  const run = async () => {
  try {
    let lambda = new AWS.Lambda({apiVersion: '2015-03-31', region: process.env.REGION});
    await lambda.createFunction(params, (err, data) => {
      console.log('success', data)
      if (err) {
        console.log('error', err.stack)
      }
    })
  } catch (err) {
    console.log("Error", err);
  }
  };
  run();
}
createLambda()

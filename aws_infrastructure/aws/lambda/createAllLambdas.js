import { lambdaClient } from '../clients/lambdaClient.js'
import dotenv from 'dotenv'
dotenv.config({path:'../../../.env'})
import { CreateFunctionCommand } from "@aws-sdk/client-lambda";
import AWS from 'aws-sdk'

function createParams(lambdaFile, bucketName, roleArn) {
  const params = {
    Code: {
      S3Bucket: bucketName,
      S3Key: `${lambdaFile}.js.zip`,
    },
    FunctionName: lambdaFile,
    Role: roleArn,
    EphemeralStorage: {
      Size: '512'
    },
    Handler: `${lambdaFile}.handler`,
    Runtime: "nodejs12.x"
  };
  return params;
}

const lambdaFunctions = [
  'publishToSnsLambda',
  'postToSlackLambda',
  'writeToDynamoLambda'
]

const retry = false
export const createLambdas = async (bucketName, region, roleArn) => {
  return new Promise(async (resolve, reject) => {
    lambdaFunctions.forEach(async lambdaFunction => {
      try {
        let lambda = new AWS.Lambda({apiVersion: '2015-03-31', region });
        await lambda.createFunction(createParams(lambdaFunction, bucketName, roleArn), (err, data) => {
          if (err) {
            console.log('error', err.stack)
            reject(err);
          }
        })
      } catch (err) {
        // console.log("Error", err);
        // reject(err)
        retry = true
        while (retry) {
          let lambda = new AWS.Lambda({ apiVersion: '2015-03-31', region });
          await lambda.createFunction(createParams(lambdaFunction), (err, data) => {
            if (err) {
              console.log('error', err.stack)
              reject('error from createAllLambdas', err);
            }
          })
        }
      }
    });

    setTimeout(() => resolve(), 10000);
  });  
};

// createLambdas();
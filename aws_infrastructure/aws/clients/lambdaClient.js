import dotenv from 'dotenv'
dotenv.config({path:'../../../.env'})

import { LambdaClient } from "@aws-sdk/client-lambda";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient }  from "@aws-sdk/client-cognito-identity";

const REGION = process.env.REGION

// const IDENTITY_POOL_ID = "eu-west-1:dc7d706a-1f07-4fa5-baa7-edfabc05f293";
// Create an AWS Lambda client service object that initializes the Amazon Cognito credentials provider.
const lambdaClient = new LambdaClient({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    // identityPoolId: IDENTITY_POOL_ID
  }),
});

export { lambdaClient }
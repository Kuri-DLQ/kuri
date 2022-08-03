import dotenv from 'dotenv'
dotenv.config({path:'.//../../.env'})

import  { SQSClient } from "@aws-sdk/client-sqs";
const sqsClient = new SQSClient({ region: process.env.REGION });
export  { sqsClient };
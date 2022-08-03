import { SQSClient } from "@aws-sdk/client-sqs";
import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' })
const REGION = process.env.REGION;
const sqsClient = new SQSClient({ region: REGION });
export { sqsClient };
import { IAMClient } from "@aws-sdk/client-iam";
import dotenv from 'dotenv'
dotenv.config({path:'../../../.env'})
// Set the AWS Region.
const REGION = process.env.REGION; // For example, "us-east-1".
// Create an IAM service client object.
const iamClient = new IAMClient({ region: REGION });
export { iamClient };
// snippet-end:[iam.JavaScript.createclientv3]
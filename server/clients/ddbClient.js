import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' })
const REGION = process.env.REGION;
const ddbClient = new DynamoDBClient({ region: REGION });
export { ddbClient }

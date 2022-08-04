import {
  IAMClient,
  CreateRoleCommand,
  AttachRolePolicyCommand,
  CreatePolicyCommand
} from "@aws-sdk/client-iam";
import dotenv from 'dotenv'
dotenv.config({path:'./.env'})
import fs from 'fs-extra'

const REGION = process.env.REGION

const iam = new IAMClient({ region: REGION });

const ROLE = "KuriRole";
const myPolicy = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: {
        Service: "lambda.amazonaws.com",
      },
      Action: "sts:AssumeRole",
    },
  ],
};

const createParams = {
  AssumeRolePolicyDocument: JSON.stringify(myPolicy),
  RoleName: ROLE,
};

const lambdaPolicyParams = {
  PolicyArn: "arn:aws:iam::aws:policy/AWSLambda_FullAccess",
  RoleName: ROLE,
};

const dynamoPolicyParams = {
  PolicyArn: "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess",
  RoleName: ROLE,
};

const s3PolicyParams = {
  PolicyArn: "arn:aws:iam::aws:policy/AmazonS3FullAccess",
  RoleName: ROLE,
};

const snsPolicyParams = {
  PolicyArn: "arn:aws:iam::aws:policy/AmazonSNSFullAccess",
  RoleName: ROLE,
};

const sqsPolicyParams = {
  PolicyArn: "arn:aws:iam::aws:policy/AmazonSQSFullAccess",
  RoleName: ROLE,
};

export const createRole = async () => {
  return new Promise(async (resolve, reject) => {
    let data;
    try {
      data = await iam.send(new CreateRoleCommand(createParams));
      fs.appendFileSync('./.env', `\nROLE_ARN="${data.Role.Arn}"\n`)
    } catch (err) {
      console.log("Error when creating role.");
      throw err;
    }
    try {
      await iam.send(new AttachRolePolicyCommand(lambdaPolicyParams));
    } catch (err) {
      console.log("Error when attaching Lambda policy to role.");
      throw err;
    }
    try {
      await iam.send(new AttachRolePolicyCommand(dynamoPolicyParams));
    } catch (err) {
      console.log("Error when attaching dynamodb policy to role.");
      throw err;
    }
    try {
      await iam.send(new AttachRolePolicyCommand(s3PolicyParams));
    } catch (err) {
      console.log("Error when attaching s3 policy to role.");
      throw err;
    }
    try {
      await iam.send(new AttachRolePolicyCommand(snsPolicyParams));
    } catch (err) {
      console.log("Error when attaching S3 policy to role.");
      throw err;
    }
    try {
      await iam.send(new AttachRolePolicyCommand(sqsPolicyParams));
    } catch (err) {
      console.log("Error when attaching dynamodb policy to role.");
      throw err;
    }

    setTimeout(() => resolve(data.Role.Arn), 10000);
  })
};

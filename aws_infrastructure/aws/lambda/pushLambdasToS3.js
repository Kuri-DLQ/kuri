import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../clients/s3Client.js";
import path from "path";
import fs from "fs";
import dotenv from 'dotenv'
dotenv.config({path:'./.env'})
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const pushLambdasToS3 = async (bucketName) => {

  return new Promise(async (resolve, reject) => {
    const publishLambda = __dirname + "/handlers/publishToSnsLambda.js.zip";
    const pusblishLambdaFileStream = fs.createReadStream(publishLambda);

    const writeToDynamo = __dirname + "/handlers/writeToDynamoLambda.js.zip";
    const writeToDynamoFileStream = fs.createReadStream(writeToDynamo);

    const postToSlack = __dirname + "/handlers/postToSlackLambda.js.zip";
    const postToSlackFileStream = fs.createReadStream(postToSlack);


    const publishSnsParams = {
      Bucket: bucketName,
      Key: path.basename(publishLambda),
      Body: pusblishLambdaFileStream,
    };

    const writeDynamoParams = {
      Bucket: bucketName,
      Key: path.basename(writeToDynamo),
      Body: writeToDynamoFileStream,
    };

    const postSlackParams = {
      Bucket: bucketName,
      Key: path.basename(postToSlack),
      Body: postToSlackFileStream,
    };

    try {
      const data = await s3Client.send(new PutObjectCommand(publishSnsParams));
      const data1 = await s3Client.send(new PutObjectCommand(writeDynamoParams));
      const data2 = await s3Client.send(new PutObjectCommand(postSlackParams));
      setTimeout(() => resolve(), 10000);
    } catch (err) {
      console.log("Error", err);
      reject(err)
    }
  });
};
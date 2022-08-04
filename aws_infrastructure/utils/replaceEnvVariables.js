import {readFile, writeFile, writeFileSync, promises as fsPromises} from 'fs';
import dotenv from 'dotenv'
dotenv.config({path:'./.env'})
import { getQueueName } from '../aws/sqs/queueName.js'

export const setEnvVariables = (region, slack_path, mainQueueUrl) => {
  return new Promise((resolve, reject) => {
    async function replaceInFile(filename, regex, replacement) {
      try {
        const contents = await fsPromises.readFile(filename, 'utf-8');
        const replaced = contents.replace(regex, replacement);
    
        await fsPromises.writeFile(filename, replaced);
      } catch (err) {
        reject(err)
      }
    }
    
    const regionRegex = new RegExp(/KURI_REGION/);
    const snsArnRegex = new RegExp(/KURI_SNS_ARN/);
    const slackPathRegex = new RegExp(/KURI_SLACK_PATH/);
    const queueNameRegex = new RegExp(/KURI_QUEUE_NAME/);
  
    (async () => {
      await replaceInFile('./aws_infrastructure/aws/lambda/handlers/publishToSnsLambda.js', regionRegex, region);
      await replaceInFile('./aws_infrastructure/aws/lambda/handlers/writeToDynamoLambda.js', regionRegex, region);
      await replaceInFile('./aws_infrastructure/aws/lambda/handlers/publishToSnsLambda.js', snsArnRegex, process.env.SNS_ARN);
      await replaceInFile('./aws_infrastructure/aws/lambda/handlers/postToSlackLambda.js', slackPathRegex, slack_path);
      await replaceInFile('./aws_infrastructure/aws/lambda/handlers/postToSlackLambda.js', queueNameRegex, getQueueName(mainQueueUrl));
    })()

    resolve()
  })
}

// setEnvVariables();


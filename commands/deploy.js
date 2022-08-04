import { createRole } from '../aws_infrastructure/aws/IAM/createRole.js'
import { createMainQueue } from "../aws_infrastructure/aws/sqs/createMainQueue.js"
import { createDLQ } from "../aws_infrastructure/aws/sqs/createDLQ.js"
import { joinDlqMain } from "../aws_infrastructure/aws/sqs/join-dlq-main.js"
import { createTopic } from "../aws_infrastructure/aws/sns/createTopic.js"
import { createTable } from "../aws_infrastructure/aws/dynamodb/createDynamoTable.js"
import { createBucket } from "../aws_infrastructure/aws/s3/createBucket.js"
import { setEnvVariables } from "../aws_infrastructure/utils/replaceEnvVariables.js"
import { createZipFiles } from "../aws_infrastructure/aws/lambda/createZipFile.js"
import { pushLambdasToS3 } from "../aws_infrastructure/aws/lambda/pushLambdasToS3.js"
import { createLambdas } from "../aws_infrastructure/aws/lambda/createAllLambdas.js"
import { setEventSourceMapping } from "../aws_infrastructure/aws/lambda/lambdaEventSourceMapping.js"
import { subscribeToSns } from "../aws_infrastructure/aws/lambda/subscribeToSns.js"
import { addPermissions } from "../aws_infrastructure/aws/lambda/addPermissions.js"
import inquirer from 'inquirer';
import { execFile } from 'child_process';
import { getQueueName } from '../aws_infrastructure/aws/sqs/queueName.js';
import prependFile from 'prepend-file';

import { v4 as uuidv4 } from 'uuid'
const bucketName = `kuri-dlq-bucket-${uuidv4()}`

import log from '../utils/logger.js'
import dotenv from 'dotenv'
dotenv.config({path:'./.env'})

const kuriLogo = "\n" +
"██╗  ██╗██╗   ██╗██████╗ ██╗\n" +
"██║ ██╔╝██║   ██║██╔══██╗██║\n" +
"█████╔╝ ██║   ██║██████╔╝██║\n" +
"██╔═██╗ ██║   ██║██╔══██╗██║\n" +
"██║  ██╗╚██████╔╝██║  ██║██║\n" +
"╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝\n"

export const deploy = async () => {
  let stackChoice = await inquirer.prompt([{
    name: 'stack',
    message: 'Choose a starting template',
    type: 'list',
    choices: [{name: 'Main Queue and DLQ'}, {name: 'DLQ only'}],
  }])
  stackChoice = stackChoice.stack
  
  let mainQueueUrl;
  if (stackChoice === 'DLQ only') {
    mainQueueUrl = await inquirer.prompt([{
      name: 'mainQueueUrl',
      message: 'Please provide your main queue url:',
      type: 'input'
    }])
    mainQueueUrl = mainQueueUrl.mainQueueUrl
  }

  let awsRegion = await inquirer.prompt([{
    name: 'region',
    type: 'input',
    message: 'What is your AWS region?',
  }])
  awsRegion = awsRegion.region;

  let slackPath = false
    const useSlack = await inquirer.prompt([{
      name: 'slack',
      type: 'confirm',
      message: 'Would you like to see DLQ notifications in Slack?',
    }])

    if (useSlack.slack === true) {
      slackPath = await inquirer.prompt([{
        name: 'slack_path',
        type: 'input',
        message: 'What is your slack path?'
      }])
      slackPath = slackPath.slack_path
    }

    let envFile = `STACK="${stackChoice}"\nREGION="${awsRegion}"\nSLACK_PATH="${slackPath}"\n`

    if (mainQueueUrl) envFile += `MAIN_QUEUE_URL="${mainQueueUrl}"\nMAIN_QUEUE_NAME="${getQueueName(mainQueueUrl)}"\n`

    const confirmation = await inquirer.prompt([{
      name: 'confirmation',
      type: 'confirm',
      message: `You entered:\n${envFile}\n Please confirm these selections (y/n)`,
    }])

    if (confirmation) {
      exec("touch .env");
      execFile("./installNestedDependencies.js");
      await prependFile('.env', envFile);
    }

  let spinner;

  try {
    spinner = log.spin('Creating IAM Role...')
    let roleArn;
    await createRole().then((role) => {
      roleArn = role
    })
    spinner.succeed();

    if (stackChoice === 'Main Queue and DLQ') {
      spinner = log.spin('Creating Main Queue...')
      await createMainQueue().then(async (queueUrl) => {
        spinner.succeed();
        mainQueueUrl = queueUrl
      })
    }  

    let dlqArn;
    spinner = log.spin('Creating DLQ...')
    await createDLQ().then((dlq_arn) => {
      dlqArn = dlq_arn
    })
    spinner.succeed();

    spinner = log.spin('Joining Main Queue and DLQ...')
    await joinDlqMain(mainQueueUrl, dlqArn)
    spinner.succeed();

    let snsArn;
    spinner = log.spin('Creating SNS Topic...')
    await createTopic().then((sns_arn) => {
      snsArn = sns_arn
    })
    spinner.succeed();

    spinner = log.spin('Creating Dynamo Table...')
    await createTable()
    spinner.succeed();

    spinner = log.spin('Creating S3 Bucket...')
    await createBucket(bucketName)
    spinner.succeed()

    spinner = log.spin('Replacing env variables...')
    await setEnvVariables(awsRegion, slackPath, mainQueueUrl)
    spinner.succeed()

    spinner = log.spin('Creating Zip Files...')
    await createZipFiles()
    spinner.succeed()

    spinner = log.spin('Pushing Lambda Handlers to S3 Bucket...')
    await pushLambdasToS3(bucketName)
    spinner.succeed()

    spinner = log.spin('Creating all Lambdas...')
    await createLambdas(bucketName, awsRegion, roleArn)
    spinner.succeed()

    spinner = log.spin('Setting Event Source Mapping for publishing to SNS...')
    await setEventSourceMapping(awsRegion, dlqArn)
    spinner.succeed()

    spinner = log.spin('Subscribing Lambdas to SNS...')
    await subscribeToSns(awsRegion, snsArn, dlqArn)
    spinner.succeed();;

    spinner = log.spin('Adding permissions for SNS...')
    await addPermissions(awsRegion, snsArn, dlqArn)
    spinner.succeed();
  } catch (err) {
    spinner.fail()
    console.log(err)
  } finally {
    console.log(kuriLogo)
  }
};
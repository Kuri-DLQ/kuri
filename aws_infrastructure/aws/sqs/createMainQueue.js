import { CreateQueueCommand } from  "@aws-sdk/client-sqs";
import { sqsClient } from  "../clients/sqsClient.js";
import fs from 'fs-extra'
import { getQueueName } from "./queueName.js"

const params = {
  QueueName: "KuriMainQueue",
};

export const createMainQueue = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const mainQueue = await sqsClient.send(new CreateQueueCommand(params));
      fs.appendFileSync('./.env', `MAIN_QUEUE_URL="${mainQueue.QueueUrl}"\nMAIN_QUEUE_NAME="KuriMainQueue"\n`);
      resolve(mainQueue.QueueUrl)
    } catch (err) {
      reject(err)
    }
  })
};

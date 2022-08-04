import { SetQueueAttributesCommand } from  "@aws-sdk/client-sqs";
import { sqsClient } from  "../clients/sqsClient.js";
import dotenv from 'dotenv'
dotenv.config({path:'./.env'})

export const joinDlqMain = async (mainQueueUrl, dlqArn) => {
  const params = {
    Attributes: {
      RedrivePolicy:
        `{"deadLetterTargetArn":"${dlqArn}",` +
        '"maxReceiveCount":"3"}',
    },
    QueueUrl: mainQueueUrl,
  };

  return new Promise(async (resolve, reject) => {
    try {
      const data = await sqsClient.send(new SetQueueAttributesCommand(params));
      resolve()
    } catch (err) {
      reject(err)
    }
  })
};

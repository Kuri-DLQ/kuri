import { SetQueueAttributesCommand } from  "@aws-sdk/client-sqs";
import { sqsClient } from  "../clients/sqsClient.js";
import dotenv from 'dotenv'
dotenv.config({path:'../../../.env'})

export const joinDlqMain = async (mainQueueUrl) => {
  const params = {
    Attributes: {
      RedrivePolicy:
        `{"deadLetterTargetArn":"${process.env.DLQ_ARN}",` +
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

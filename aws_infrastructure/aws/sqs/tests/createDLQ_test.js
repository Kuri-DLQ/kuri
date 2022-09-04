import { SetQueueAttributesCommand } from  "@aws-sdk/client-sqs";
import { sqsClient } from  "../../clients/sqsClient.js";

var params = {
  Attributes: {
    RedrivePolicy:
      '{"deadLetterTargetArn":"arn:aws:sqs:us-east-1:250801424874:KuriDeadLetterQueue",' +
      '"maxReceiveCount":"10"}',
  },
  QueueUrl: "KuriMainQueue",
};

const run = async () => {
  try {
    const data = await sqsClient.send(new SetQueueAttributesCommand(params));
    console.log("Success", data);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

run();

module.exports ={run, params};

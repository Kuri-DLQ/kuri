import { CreateQueueCommand } from  "@aws-sdk/client-sqs";
import { sqsClient } from  "../../clients/sqsClient.js";

const params = {
  QueueName: "KuriMainQueue",
  Attributes: {
    DelaySeconds: "60",
    MessageRetentionPeriod: "86400",
  },
};

const run = async () => {
  try {
    const data = await sqsClient.send(new CreateQueueCommand(params));
    console.log("Success", data);
    return data; 
  } catch (err) {
    console.log("Error", err);
  }
};

run();

module.exports ={run, params};
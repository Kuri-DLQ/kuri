import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from  "../../clients/sqsClient.js";

const params = {
  DelaySeconds: 10,
  MessageAttributes: {
    "quantity":
      { "DataType": "Number", "StringValue": "1285" },
    "customerId":
      { "DataType": "Number", "StringValue": "128" },
    "SKU":
      { "DataType": "String", "StringValue": "426H2!H" },
  },
  MessageBody:
    "Order",
  QueueUrl: "https://sqs.us-east-1.amazonaws.com/250801424874/KuriMainQueue"
};

const run = async () => {
  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    console.log("Success, message sent. MessageID:", data.MessageId);
    return data; 
  } catch (err) {
    console.log("Error", err);
  }
};

run();

module.exports ={run, params};
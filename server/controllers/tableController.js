import { ScanCommand, PutItemCommand, GetItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "../clients/ddbClient.js";
import { sqsClient } from "../clients/sqsClient.js";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import dotenv from 'dotenv'
dotenv.config({ path:'../../.env'})
const tableName = 'Kuri-DLQ-table'
const getAllMessages = async () => {
  const params = {
    TableName: tableName,
  };

  try {
    const data = await ddbClient.send(new ScanCommand(params));
    return data.Items.map(message => unmarshall(message));
  } catch (err) {
    console.log("Error", err);
  }
}

const getMessage = async (messageID) => {
  const params = {
    TableName: tableName,
    Key: {
      id: { S: messageID },
    }
  };
  try {
    const data = await ddbClient.send(new GetItemCommand(params))
    return unmarshall(data.Item);
  } catch (err) {
    console.log("Error", err);
  }
}

const updateMessage = async (messageID, updatedMessage) => {
  const params = {
    TableName: tableName,
    Item: {
      id: { S: messageID },
      Message: { S: updatedMessage.Message },
      Attributes: { S: JSON.stringify(updatedMessage.Attributes) },
      Timestamp: { S: updatedMessage.Timestamp }
    }
  };

  try {
    await ddbClient.send(new PutItemCommand(params));
    const newMessage = await getMessage(messageID);
    return newMessage;
  } catch (err) {
    console.log("Error", err);
  }
}

const convertMessageAtts = (attributes) => {
  const result = {};
  for (const key in attributes) {
    result[key] = {
      "DataType": `${attributes[key]["Type"]}`,
      "StringValue": `${attributes[key]["Value"]}`
    }
  }

  return result;
}

const resendMessage = async (message) => {
  const params = {
    MessageAttributes: convertMessageAtts(JSON.parse(message.Attributes)),
    MessageBody: message.Message,
    QueueUrl: process.env.MAIN_QUEUE_URL
  }

  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    return data;
  } catch (err) {
    console.log("Error", err);
  }
}

const deleteMessage = async (messageID) => {
  const params = {
    TableName: tableName,
    Key: {
      id: { S: messageID },
    },
  };

  try {
    const data = await ddbClient.send(new DeleteItemCommand(params));
    // console.log("Success, message deleted", data);
  } catch (err) {
    console.log("Error", err);
  }
}

export { getAllMessages, updateMessage, resendMessage, getMessage, deleteMessage };


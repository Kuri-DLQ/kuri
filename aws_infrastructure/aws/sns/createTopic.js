import { CreateTopicCommand } from "@aws-sdk/client-sns";
import { snsClient } from "../clients/snsClient.js";
import fs from 'fs-extra';

const params = { Name: "KuriTopic" };

export const createTopic = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const topic = await snsClient.send(new CreateTopicCommand(params));
      await fs.appendFile('../../../.env', `SNS_ARN="${topic.TopicArn}"\n`);
      resolve(topic.TopicArn);
    } catch (err) {
      reject(err);
    }
  });
};

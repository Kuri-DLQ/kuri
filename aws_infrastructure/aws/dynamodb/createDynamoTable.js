import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "../clients/ddbClient.js";

export const params = {
  TableName: "Kuri-DLQ-table",
  AttributeDefinitions: [
    {
      AttributeName: "id",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "id",
      KeyType: "HASH",
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  StreamSpecification: {
    StreamEnabled: false,
  },
};

export const createTable = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await ddbClient.send(new CreateTableCommand(params));
      resolve()
    } catch (err) {
      reject(err)
    }
  })
};

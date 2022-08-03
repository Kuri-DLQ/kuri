const aws = require('aws-sdk');
aws.config.update({ region: 'KURI_REGION'})
const dynamodb = new aws.DynamoDB();

const handleAttributeType = (attributes) => {
  for (const key in attributes) {
    let stringValue = attributes[key]["Value"]
    if (stringValue.endsWith('99999')) {
      attributes[key]['Type'] = 'Number'
      attributes[key]["Value"] = stringValue.slice(0, -5)
    } else {
      let splitAttr = stringValue.split('--')
      const type = splitAttr[splitAttr.length - 1]
      splitAttr.pop()
      splitAttr = splitAttr.join('--')

      attributes[key]['Type'] = type
      attributes[key]["Value"] = splitAttr
    }
  }

  return attributes
}

const getDayMonthYear = (date) => {
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  return `${year}-` +
`${String(month).length === 1 ? '0' + month : month}-` +
`${String(day).length === 1 ? '0' + day : day} ` +
`${String(hours).length === 1 ? '0' + hours : hours}:` +
`${String(minutes).length === 1 ? '0' + minutes : minutes}:` +
`${String(seconds).length === 1 ? '0' + seconds : seconds}`
}


exports.handler = (event) => {
  for (const record of event.Records) {
    const params = {
      TableName: 'Kuri-DLQ-table',
      Item: {
        "id": { S: record.Sns.MessageId },
        "Message": { S: record.Sns.Message },
        "Attributes": { S: JSON.stringify(handleAttributeType(record.Sns.MessageAttributes)) },
        "Timestamp": { S: getDayMonthYear(new Date(record.Sns.Timestamp))}
      }
    }

    const run = async () => {
      try {
        const data = await dynamodb.putItem(params).promise();
        console.log("Success - item added or updated", data);
        return data;
      } catch (err) {
        console.log("Error", err);
      }
    };

    run();
  }
}
const https = require('https');
const util = require('util');

const POST_OPTIONS = {
  hostname: 'hooks.slack.com',
  path: 'KURI_SLACK_PATH',
  method: 'POST',
};

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

const reformatAttributes = (attributes) => {
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

  return attributes;
}

exports.handler = (event, context) => {
  for (const record of event.Records) {
    const message = {
      blocks:[
        {
          type: "section",
          text: {
            type: 'mrkdwn',
            text: "From Kuri:\n\n>A message has failed to be processed and was added to the DLQ\n>Please visit the Kuri dashboard to make modifications and resend"
          },
          "accessory": {
            "type": "image",
            "image_url": "https://i.postimg.cc/v8PGLdXz/app-icon.png",
            "alt_text": "kuri logo"
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Main Queue:*\nKURI_QUEUE_NAME`
            },
            {
              type: 'mrkdwn',
              text: '*Timestamp (UTC):*\n' + getDayMonthYear(new Date(record.Sns.Timestamp))
            },
          ]
        },
        {
          type: "divider"
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Message Body:*\n${record.Sns.Message}`
            },
            {
              type: 'mrkdwn',
              text: '*Message Attributes:*\n' + JSON.stringify(reformatAttributes(record.Sns.MessageAttributes))
            }
          ]
        },
        {
          type: "divider"
        },
      ]
    };

    const req = https.request(POST_OPTIONS, res => {
      res.setEncoding('utf8');
      res.on('data', data => {
        context.succeed(`Message Sent: ${data}`);
      });
    }).on('error', e => {
      context.fail(`Failed: ${e}`);
    });

    req.write(util.format("%j", message));
    req.end();
  }
};
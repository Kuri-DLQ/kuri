![kuri](dashboard/public/logo_color.png)

## Dead-Letter Queue-as-a-Service
Kuri is a Dead-Letter Queue-as-a-Service for Amazon Web Services (AWS)-Based Microservices Architectures. It provides the user with the ability to edit, redrive and delete messages from their Dead-Letter Queue (DLQ). Kuri creates an AWS infrastructure to construct a DLQ with increased functionality and observability for the user. Kuri can be used when building a brand new project or added on to an existing project that uses a message queue.


# Prerequisites
1. Install the AWS Command Line Interface -- must be up-to-date and configured. 
   To install the AWS CLI see instructions: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html. 
   To configure the AWS credentials:
```console
$ aws configure
AWS Access Key ID [****************UUPR]: <enter access key id>
AWS Secret Key ID [****************UUPR]: <enter secret key id>
Region: <enter aws region>
```
2. Install NodeJS version 12 or greater -- see the NodeJS documentation for instructions: https://nodejs.org/en/download/

# Usage
To install Kuri, run the following command globally:
```console
$ npm install kuri -g
```
To view the Kuri help commands, run the kuri command:
```console
$ kuri
Usage: kuri <command>

Welcome to Kuri DLQ-as-a-Service! See the commands below or the documentation at https://kuri-dlq.github.io/

Commands:
  deploy  -- Deploy Kuri Infrastructure
  view    -- View Kuri Dashboard
```

To deploy the Kuri DLQ service, run the `kuri deploy` command and you will be prompted with the following initializing questions.
1. `Choose a starting template` -- you can either choose for Kuri to create a "Main Queue and DLQ" for a brand new project or if you want to add Kuri to an existing project that already has a main queue select the "DLQ Only" option. If you choose "DLQ Only", you will be prompted to provide your existing main queue url.
2. `What is your AWS region?` -- provide your AWS Region. This needs to be the same region that your project is deployed in and your AWS CLI is configured to.
3. `Would you like to see notifications from Kuri in Slack?` -- if you choose to receive a Slack notification when a message appears in your Kuri dead-letter queue, provide your Slack API Webhook Path. For more details see: https://api.slack.com/apps

```console
$ kuri deploy
? Choose a starting template Main Queue and DLQ
? What is your AWS region? us-east-1
? Would you like to see notifications from Kuri in Slack? Yes
? What is your slack path? (hooks.slack.com</your-slack-path>) /example_slack_path
? You entered:
STACK="Main Queue and DLQ"
REGION="us-east-1"
SLACK_PATH="/example_slack_path"

 Please confirm these selections (y/n) Yes
✔ Creating IAM Role...
✔ Creating Main Queue...
✔ Creating DLQ...
✔ Joining Main Queue and DLQ...
✔ Creating SNS Topic...
✔ Creating Dynamo Table...
✔ Creating S3 Bucket...
✔ Replacing env variables...
✔ Creating Zip Files...
✔ Pushing Lambda Handlers to S3 Bucket...
✔ Creating all Lambdas...
✔ Setting Event Source Mapping for publishing to SNS...
✔ Subscribing Lambdas to SNS...
✔ Adding permissions for SNS...

██╗  ██╗██╗   ██╗██████╗ ██╗
██║ ██╔╝██║   ██║██╔══██╗██║
█████╔╝ ██║   ██║██████╔╝██║
██╔═██╗ ██║   ██║██╔══██╗██║
██║  ██╗╚██████╔╝██║  ██║██║
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝
```

Once the Kuri DLQ has been deployed, you can run `kuri view` to launch the Kuri Dashboard. Once run, the dashboard should pop open within a minute. Note: sometimes launching the dashboard can take up to a few minutes.
```console
$ kuri view
💻 Kuri Dashboard is starting...

❎ Press "ctrl + c" to close the dashboard
```
# Team
## Kris Ingva
[Github](https://github.com/krisingva)
## Anna Kolliakou
[Github](https://github.com/akolliakou)
## Tony Beere
[Github](https://github.com/AJBeere)
## Arjun Rasodha
[Github](https://github.com/ARasodha)

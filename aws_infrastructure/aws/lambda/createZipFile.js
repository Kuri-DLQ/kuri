import JSZip from 'jszip';
import fs from 'fs';

const publishToSnsLambdaZip = new JSZip();
const writeToDynamoLambdaZip = new JSZip();
const postToSlackLambdaZip = new JSZip();

export const createZipFiles = async () => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      try {
        const publishToSnsLambda = fs.readFileSync('./aws_infrastructure/aws/lambda/handlers/publishToSnsLambda.js');  
        publishToSnsLambdaZip.file("publishToSnsLambda.js", publishToSnsLambda);
        const zippedSnsLambda = await publishToSnsLambdaZip.generateAsync({ type: 'nodebuffer', streamFiles: true });
        fs.writeFileSync('./aws_infrastructure/aws/lambda/handlers/publishToSnsLambda.js.zip', zippedSnsLambda);
  
        const writeToDynamoLambda = fs.readFileSync('./aws_infrastructure/aws/lambda/handlers/writeToDynamoLambda.js');
        writeToDynamoLambdaZip.file("writeToDynamoLambda.js", writeToDynamoLambda);
        const zippedDynamoLambda = await writeToDynamoLambdaZip.generateAsync({ type: 'nodebuffer', streamFiles: true });
        fs.writeFileSync('./aws_infrastructure/aws/lambda/handlers/writeToDynamoLambda.js.zip', zippedDynamoLambda);
  
        const postToSlackLambda = fs.readFileSync('./aws_infrastructure/aws/lambda/handlers/postToSlackLambda.js');
        postToSlackLambdaZip.file("postToSlackLambda.js", postToSlackLambda);
        const zippedSlackLambda = await postToSlackLambdaZip.generateAsync({ type: 'nodebuffer', streamFiles: true });
        fs.writeFileSync('./aws_infrastructure/aws/lambda/handlers/postToSlackLambda.js.zip', zippedSlackLambda);

        resolve()
      } catch (err) {
          reject(err);
      }
    }, 10000)
  });  
}
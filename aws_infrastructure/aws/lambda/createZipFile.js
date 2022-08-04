import JSZip from 'jszip';
import fs from 'fs';

const publishToSnsLambdaZip = new JSZip();
const writeToDynamoLambdaZip = new JSZip();
const postToSlackLambdaZip = new JSZip();
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const createZipFiles = async () => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      try {
        const publishToSnsLambda = fs.readFileSync(__dirname + '/handlers/publishToSnsLambda.js');
        publishToSnsLambdaZip.file("publishToSnsLambda.js", publishToSnsLambda);
        const zippedSnsLambda = await publishToSnsLambdaZip.generateAsync({ type: 'nodebuffer', streamFiles: true });
        fs.writeFileSync(__dirname + '/handlers/publishToSnsLambda.js.zip', zippedSnsLambda);

        const writeToDynamoLambda = fs.readFileSync(__dirname + '/handlers/writeToDynamoLambda.js');
        writeToDynamoLambdaZip.file("writeToDynamoLambda.js", writeToDynamoLambda);
        const zippedDynamoLambda = await writeToDynamoLambdaZip.generateAsync({ type: 'nodebuffer', streamFiles: true });
        fs.writeFileSync(__dirname + '/handlers/writeToDynamoLambda.js.zip', zippedDynamoLambda);

        const postToSlackLambda = fs.readFileSync(__dirname + '/handlers/postToSlackLambda.js');
        postToSlackLambdaZip.file("postToSlackLambda.js", postToSlackLambda);
        const zippedSlackLambda = await postToSlackLambdaZip.generateAsync({ type: 'nodebuffer', streamFiles: true });
        fs.writeFileSync(__dirname + '/handlers/postToSlackLambda.js.zip', zippedSlackLambda);

        resolve()
      } catch (err) {
          reject(err);
      }
    }, 10000)
  });
}
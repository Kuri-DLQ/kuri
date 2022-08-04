import dotenv from 'dotenv'
dotenv.config({path:'./.env'})

const accountRegex = new RegExp(/\d{12}/);

export const getAccountId = () => {
  const DLQArn = process.env.DLQ_ARN;
  const accountId = accountRegex.exec(DLQArn)[0];
  return accountId;  
}

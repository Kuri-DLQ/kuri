import dotenv from 'dotenv'
dotenv.config({path:'./.env'})

const accountRegex = new RegExp(/\d{12}/);

export const getAccountId = (dlqArn) => {
  const DLQArn = dlqArn;
  const accountId = accountRegex.exec(DLQArn)[0];
  return accountId;  
}

export const getQueueName = (queueUrl) => {
  if (queueUrl.length === 0) {
    throw new Error('Invalid queue URL passed to getQueueName')
  }

  const urlSections = queueUrl.split('/')
  return urlSections[urlSections.length - 1]
}
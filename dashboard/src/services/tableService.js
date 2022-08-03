import axios from 'axios'

const url = 'http://localhost:5874';

const getAllMessages = async () => {
  try {
    const data = await axios.get(url + '/table/allMessages');
    return data;
  } catch (err) {
    console.error(err);
  }
}

const deleteAllMessages = async () => {
  try {
    await axios.delete(url + '/table/deleteAllMessages');
  } catch (err) {
    console.error(err);
  }
}

const resendAllMessages = async () => {
  try {
    await axios.post(url + '/table/resendAllMessages');
  } catch (err) {
    console.error(err);
  }
}

const tableService = {
  getAllMessages,
  deleteAllMessages,
  resendAllMessages,
}

export default tableService;
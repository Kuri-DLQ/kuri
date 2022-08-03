import axios from 'axios'

const url = 'http://localhost:5874';

const viewMessage = async (id) => {
  try {
    const data = await axios.get(url + `/table/viewMessage/${id}`);
    return data;
  } catch (err) {
    console.error(err);
  }
}

const updateMessage = async (id, message) => {
  try {
    const data = await axios.put(url + `/table/updateMessage/${id}`, message);
    return data;
  } catch (err) {
    console.error(err);
  }
}

const deleteMessage = async (id) => {
  try {
    await axios.delete(url + `/table/deleteMessage/${id}`);
  } catch (err) {
    console.error(err);
  }
 }

const resendMessage = async (message) => {
  try {
    await axios.post(url + `/table/resendMessage`, message);
  } catch (err) {
    console.error(err);
  }
 }

const messageService = {
  deleteMessage,
  resendMessage,
  viewMessage,
  updateMessage,
}

export default messageService;
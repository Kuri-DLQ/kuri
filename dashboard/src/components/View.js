import { useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import ModalForm from './ModalForm'

const View = ({ message, messages, setMessages, onResend }) => {
  const [selectedMessage, setSelectedMessage] = useState([message])
  const [showModalForm, setShowModalForm] = useState(false);

  const handleShowModalForm = () => {
    setShowModalForm(!showModalForm);
  }

  const handleShowModal = (id) => {
    const clickedMessage = messages.find(msg => msg.id === id)
    handleShowModalForm();
    setSelectedMessage(clickedMessage);
  }

  return (
    <div>
    <Dropdown.Item className='dropdown-item' onClick={() => handleShowModal(message.id)}>View details</Dropdown.Item>
      {showModalForm && (<ModalForm
        selectedMessage={selectedMessage}
        setSelectedMessage={setSelectedMessage}
        messages={messages}
        setMessages={setMessages}
        onResend={onResend}
        showModalForm={showModalForm}
        handleShowModalForm={handleShowModalForm} />)}
    </div>
  )
}

export default View
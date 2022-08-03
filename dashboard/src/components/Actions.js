import Dropdown from 'react-bootstrap/Dropdown'
import View from './View'
import Delete from './Delete'
import Redrive from './Redrive'

const Actions = ({ message, messages, setMessages, onResend, onDelete }) => {
  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle size='sm' className='dropdown-toggle' variant='primary'></Dropdown.Toggle>
        <Dropdown.Menu>
          <View
            message={message}
            messages={messages}
            setMessages={setMessages}
            onDelete={onDelete}
            onResend={onResend} />
          <Delete
            message={message}
            onDelete={onDelete} />
          < Redrive
            message={message}
            onResend={onResend} />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default Actions;
import Actions from './Actions'

const Row = ({ message, messages, setMessages, onDelete, onResend }) => {
  return (
    <tr className='table-row'>
      <td className='cell'>{message.id}</td>
      <td className='cell'>{message.Timestamp}</td>
      <td className='cell message-body'>{message.Message}</td>
      <td className='cell'>
        <Actions
          message={message}
          messages={messages}
          setMessages={setMessages}
          onDelete={onDelete}
          onResend={onResend}
        />        
      </td>
    </tr>
  )
}

export default Row;
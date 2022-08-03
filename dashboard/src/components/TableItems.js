import Table from 'react-bootstrap/Table';
import Row from './Row';

const TableItems = ({ messages, setMessages, currentMessages, ascending, onDelete, onResend, onSort, setSortFactor, setAscending}) => {
  return (
    <div className='message-table'>
    <Table className='table-items'>
      <thead>
          <tr className='header-row'>
            <th>
              Message ID
            </th>
            <th>
              Message Timestamp

              <i className="arrow up" onClick={() => {
                  setSortFactor('Timestamp');
                  setAscending(true);
                  setMessages(onSort(messages));
                  }
                  }></i>
              <i className="arrow down" onClick={() => {
                  setSortFactor('Timestamp');
                  setAscending(false);
                  setMessages(onSort(messages));
                  }
                  }></i>
            </th>
            <th>
              Message Body

              <i className="arrow up" onClick={() => {
                  setSortFactor('Message');
                  setAscending(true);
                  setMessages(onSort(messages));
                  }
                  }></i>
              <i className="arrow down" onClick={() => {
                  setSortFactor('Message');
                  setAscending(false);
                  setMessages(onSort(messages));
                  }
                  }></i>
            </th>
            <th>Action</th>
        </tr>
      </thead>
        <tbody>
          {currentMessages.map(message => {
            return <Row
              key={message.id}
              message={message}
              messages={messages}
              setMessages={setMessages}
              onDelete={onDelete}
              onResend={onResend} />
          })}
      </tbody>
      </Table>
    </div>
  )
}

export default TableItems;


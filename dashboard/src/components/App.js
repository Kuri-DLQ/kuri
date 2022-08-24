import { useEffect, useState } from 'react';
import tableService from '../services/tableService';
import messageService from '../services/messageService';
import TableItems from './TableItems';
import Header from './Header';
import Footer from './Footer';
import TableInfo from './TableInfo';
import TablePagination from './Pagination';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [sortFactor, setSortFactor] = useState('');
  const [ascending, setAscending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const baseUrl = 'http://localhost:5874';


  const messageCount = messages.length;

  const handleSortMessages = (mess) => {
    let copyOfMessages = [...mess];
    if (sortFactor === '') {
      return copyOfMessages;
    }

    const sortedMessages = copyOfMessages.sort((a, b) => {
      if (a[sortFactor] < b[sortFactor]) {
        return ascending ? -1 : 1;
      }
      if (a[sortFactor] > b[sortFactor]) {
        return ascending ? 1 : -1;
      }
      return 0;
    });
    return sortedMessages;
  }


  const sortedMessages = handleSortMessages(messages);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentMessages = sortedMessages.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(messages.length / recordsPerPage)


  useEffect(() => {
    const run = async () => {
      try {
        const result = await tableService.getAllMessages();
        setMessages(result.data);
      } catch (err) {
        console.error(err);
      }
    }

    run();
  }, [])

  useEffect(() => {
    const eventSource = new EventSource(`${baseUrl}/table/sse`);
    eventSource.onmessage = (e) => {
      let results = JSON.parse(e.data);
      setMessages(results);
    }
    return () => {
      eventSource.close();
    };
  }, [])


  const filterMessages = (id) => {
    const updatedMessageList = messages.filter(message => {
      return message.id !== id;
    })

    return updatedMessageList;
  }

  const handleDelete = async (id) => {
    await messageService.deleteMessage(id);

    const updatedMessageList = filterMessages(id)
    setMessages(updatedMessageList);
  }

  const handleResend = async (messageToResend) => {
    await messageService.resendMessage(messageToResend);
    await handleDelete(messageToResend.id);

    const updatedMessageList = filterMessages(messageToResend.id);
    setMessages(updatedMessageList);
  }

  const handleDeleteAll = async () => {
    await tableService.deleteAllMessages();
    setMessages([]);
  }

  const handleResendAll = async () => {
    await tableService.resendAllMessages();
    setMessages([]);
  }

  return (
    <div>
      <Header />
      <TableInfo
        messageCount={messageCount}
        onDeleteAll={handleDeleteAll}
        onResendAll={handleResendAll}
      />
      <TableItems
        messages={sortedMessages}
        currentMessages={currentMessages}
        ascending={ascending}
        setMessages={setMessages}
        onDelete={handleDelete}
        onResend={handleResend}
        onSort={handleSortMessages}
        setSortFactor={setSortFactor}
        setAscending={setAscending}
      />
      <TablePagination
        nPages={nPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <Footer />
    </div>
  );
}

export default App;

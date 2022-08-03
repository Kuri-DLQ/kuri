const TablePagination = ({ nPages, currentPage, setCurrentPage }) => {
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1)
    
  const nextPage = () => {
    if (currentPage !== nPages) {
      return setCurrentPage(currentPage + 1)
    }
  }
  const prevPage = () => {
    if (currentPage !== 1) {
      return setCurrentPage(currentPage - 1)
    }
  }
  
  return (
    <nav>
      <ul className='pagination justify-content-center'>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a className='page-link' 
            onClick={prevPage} 
            href='/#'>
            Previous
          </a>
        </li>
        {pageNumbers.map(pgNumber => (
          <li key={pgNumber} className= {`page-item ${currentPage === pgNumber ? 'active' : ''} `} >
            <a onClick={() => setCurrentPage(pgNumber)}  
              className='page-link' 
              href='/#'>
              {pgNumber}
            </a>
          </li>
        ))}
        <li className={`page-item ${currentPage === nPages ? 'disabled' : ''}`}>
          <a className='page-link' 
            onClick={nextPage}
            href='/#'> 
            Next
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default TablePagination
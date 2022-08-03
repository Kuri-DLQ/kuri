import React from 'react';
import Button from 'react-bootstrap/Button';
import kuriLogo from '../assets/SVG/color/graphic_gradient.svg';

const TableInfo = ({ messageCount, onDeleteAll, onResendAll }) => {
  return (
    <div className='table-info'>
      <div className='kuri-icon'>
        <a href='#/'>
          <img className='kuri-img' src={kuriLogo} alt='Kuri' />
        </a>
      </div>
      <div className='table-info-text'>
        <p>Number of messages in the DLQ:
          <span className='count'> {`${messageCount}`}</span>
        </p>
      </div>
      <div className='table-info-button'>
        <Button size='sm' className='redrive' variant='primary' onClick={onResendAll}>Redrive All</Button>
        <Button size='sm' className='delete' variant='primary' onClick={onDeleteAll}>Delete All</Button>
      </div>
    </div>
  )
}


export default TableInfo;
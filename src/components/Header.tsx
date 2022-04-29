import React from 'react';
import '../styles/Header.css';

export const Header: React.FunctionComponent = () => {
  return (
    <div className='header'>
      <h1 className='display header_end'>D</h1>
      <div className='underline'>
        <h1 className='display header_main'>
          ECK NAME EDITO
        </h1>
      </div>
      <h1 className='display header_end'>R</h1>
    </div>
  );
};

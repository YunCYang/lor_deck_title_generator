import React from 'react';
// import './styles/general.css';
import '../styles/Header.css';

export class Header extends React.Component {
  render() {
    return (
      <div className='header'>
        <h1 className='display'>
          Colorfy your deck title
        </h1>
      </div>
    );
  }
}

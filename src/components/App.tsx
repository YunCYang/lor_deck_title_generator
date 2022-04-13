import React from 'react';
import '../styles/App.css';

import { Header } from './Header';
import { Content } from './Content';
import { Footer } from './Footer';

export class App extends React.Component {
  render() {
    return (
      <div className='app'>
        <Header />
        <Content />
        <Footer />
      </div>
    );
  }
}

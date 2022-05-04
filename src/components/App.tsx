import React from 'react';
import '../styles/App.css';

import { Header } from './Header';
import { Content } from './Content';
import { Footer } from './Footer';

export const App: React.FunctionComponent = () => {
  return (
    <div className='app'>
      <Header />
      <Content />
      <Footer />
    </div>
  );
};

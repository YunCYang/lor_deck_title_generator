import React from 'react';
// import './styles/general.css';
import '../styles/Content.css';

export class Content extends React.Component {
  render() {
    return (
      <div className='content'>
        <textarea name="" id="" cols={30} rows={10}></textarea>
        <div className='buttons_container'>
          <button>b</button>
          <button>i</button>
          <button>u</button>
          <button>su</button>
          <button>sd</button>
          <button>m</button>
          <button>sprite</button>
          <button>color</button>
          <button>gradient</button>
          <button>copy</button>
          <button>?</button>
        </div>
        <div className='result_display'>
          Display
        </div>
      </div>
    );
  }
}

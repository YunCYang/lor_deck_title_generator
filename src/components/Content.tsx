import React from 'react';
// import './styles/general.css';
import '../styles/Content.css';

export class Content extends React.Component {
  render() {
    return (
      <div className='content'>
        <div className='content_wrapper'>
            <textarea name="" id="" cols={30} rows={10}></textarea>
          <div className='buttons_container'>
            <div className='text_buttons_container'>
              <button className='bold'>B</button>
              <button className='italic'>I</button>
              <button className='underline'>U</button>
              <button className='strike'>S</button>
              <button className='sup'>X<sup>2</sup></button>
              <button className='sub'>X<sub>2</sub></button>
              <button className='marked'><mark>M</mark></button>
            </div>
            <div className='sprite_button_container'>
              <button className='sprite'>Sprite</button>
            </div>
            <div className='color_button_container'>
              <button className='color'>Color</button>
              <button className='gradient'>Gradient</button>
            </div>
          </div>
          <div className='text_container'>
            <img
              src={require('../images/corner.png')} alt="border corner"
              className='corner_c c1'
            />
            <img
              src={require('../images/corner.png')} alt="border corner"
              className='corner_c c2'
            />
            <img
              src={require('../images/corner.png')} alt="border corner"
              className='corner_c c3'
            />
            <img
              src={require('../images/corner.png')} alt="border corner"
              className='corner_c c4'
            />
          </div>
          <div className='actions_container'>
            <button className='copy'>Copy</button>
            <button className='help'>?</button>
          </div>
        </div>
      </div>
    );
  }
}

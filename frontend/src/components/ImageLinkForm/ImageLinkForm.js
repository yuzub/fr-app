import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit: onPictureSubmit }) => {
  return (
    <div>
      <p className='f3'>
        {'This App will detect faces in pictures. Try it.'}
      </p>
      <p>
        {`For example, copy this URL and paste it below:
        http://brainlink.dp.ua/img/5.jpg
        `}
      </p>
      <div className='canter'>
        <div className='pa4 br3 shadow-5 center form'>
          <input className='f4 pa2 w-60' type='text' onChange={onInputChange} />
          <button className='f4 w-40 link grow ph3 pv2 dib white bg-light-purple' onClick={onPictureSubmit}>
            Detect
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageLinkForm;
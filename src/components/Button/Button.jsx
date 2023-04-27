import React from 'react';
import './Button.css';

const Button = ({ text }) => {

  console.log(text)

  function handleStorage() {
    if (text !== null) {
      localStorage.setItem('Text', JSON.stringify(text));
    }
    alert("Data Saved")
  }

  return (
    <div className='button'>
      <button onClick={handleStorage}>Save</button>
    </div>
  );
};

export default Button;

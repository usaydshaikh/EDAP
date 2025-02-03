// StartPage.js
import React from 'react';
import './StartPage.css';

const StartPage = ({ onEnter }) => {
  return (
    <div className="start-page">
      <div className="content">
        <h1>Welcome to Maxx Energy Portal</h1>
        <p>Your gateway to enterprise-level energy insights.</p>
        <button onClick={onEnter}>Enter Portal</button>
      </div>
    </div>
  );
};

export default StartPage;

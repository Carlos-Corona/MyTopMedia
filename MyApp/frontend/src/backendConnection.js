import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BackendMessage = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3000/api')
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h2>Message from backend:</h2>
      <p>{message}</p>
    </div>
  );
};

export default BackendMessage;

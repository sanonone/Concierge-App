// src/sendNotification.js
export const sendNotification = async ({ title, body, token, image }) => {
    const endpoint = 'https://europe-west1-fir-autenticazione-d201f.cloudfunctions.net/api/sendNotification';
  
    const payload = {
      title,
      body,
      token,
      image,
    };
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Result:', data ?? 'No data came back');
      return data !== null;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  };
  
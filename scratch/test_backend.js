const axios = require('axios');

async function testConnection() {
  try {
    const response = await axios.get('http://127.0.0.1:5000/api/health');
    console.log('Backend is reachable via 127.0.0.1:5000');
    console.log('Status:', response.data.status);
  } catch (error) {
    console.error('Failed to reach backend via 127.0.0.1:5000');
    console.error('Error:', error.message);
  }

  try {
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('Backend is reachable via localhost:5000');
    console.log('Status:', response.data.status);
  } catch (error) {
    console.error('Failed to reach backend via localhost:5000');
    console.error('Error:', error.message);
  }
}

testConnection();

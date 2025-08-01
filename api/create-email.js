const axios = require('axios');

const AUTH_TOKEN = 'web-test-20250801i2f2W';
const API_URL = `https://dropmail.me/api/graphql/${AUTH_TOKEN}`;

module.exports = async function (req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // hoặc thay * bằng domain cụ thể
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // CORS preflight request
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST method allowed' });
    return;
  }

  const { domainId = 'RG9tYWluOjI=' } = req.body;

  const query = `
    mutation {
      introduceSession(input: {
        withAddress: true,
        domainId: "${domainId}"
      }) {
        id
        addresses {
          address
        }
      }
    }
  `;

  try {
    const response = await axios.post(API_URL, { query });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

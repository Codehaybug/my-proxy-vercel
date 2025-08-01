const axios = require('axios');

module.exports = async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST method allowed' });
    return;
  }

  // Lấy authToken và domainId từ body của request
  const { authToken, domainId = 'RG9tYWluOjI=' } = req.body;

  if (!authToken) {
    return res.status(400).json({ error: 'authToken is required' });
  }

  const API_URL = `https://dropmail.me/api/graphql/${authToken}`;
  const query = `
    mutation {
      introduceSession(input: {
        withAddress: true,
        domainId: "${domainId}"
      }) {
        id
        expiresAt
        addresses {
          address
          restoreKey
        }
      }
    }
  `;

  try {
    const response = await axios.post(API_URL, { query }, {
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Lỗi API create-email:', error.message);
    res.status(500).json({ error: error.message });
  }
};

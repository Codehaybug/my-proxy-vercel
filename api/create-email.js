const axios = require('axios');

const AUTH_TOKEN = 'web-test-20250801i2f2W';
const API_URL = `https://dropmail.me/api/graphql/${AUTH_TOKEN}`;

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Only POST method allowed' });
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

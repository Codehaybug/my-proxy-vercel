const axios = require('axios');

const AUTH_TOKEN = 'web-test-20250801i2f2W';
const API_URL = `https://dropmail.me/api/graphql/${AUTH_TOKEN}`;

module.exports = async function (req, res) {
  // Đảm bảo headers CORS được gửi ngay từ đầu
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // Ngăn cache

  if (req.method === 'OPTIONS') {
    console.log('📋 Nhận yêu cầu OPTIONS cho check-email');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    console.error('❌ Yêu cầu không phải POST:', req.method);
    res.status(405).json({ error: 'Only POST method allowed' });
    return;
  }

  const { sessionId } = req.body;

  if (!sessionId) {
    console.error('❌ Thiếu sessionId trong yêu cầu');
    res.status(400).json({ error: 'sessionId is required' });
    return;
  }

  const query = `
    query {
      session(id: "${sessionId}") {
        id
        expiresAt
        mails {
          id
          fromAddr
          toAddr
          headerSubject
          text
          receivedAt
        }
      }
    }
  `;

  try {
    const response = await axios.post(API_URL, { query }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache' // Ngăn cache
      }
    });
    console.log('📡 Phản hồi DropMail check-email:', JSON.stringify(response.data, null, 2));
    res.status(200).json(response.data);
  } catch (error) {
    console.error('❌ Lỗi API check-email:', error.message);
    res.status(500).json({ error: error.message });
  }
};

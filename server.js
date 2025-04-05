// server.js
const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const app = express();

dotenv.config();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Meta 전환 API 리드 전송 서버 실행 중!');
});

app.post('/meta/lead', async (req, res) => {
  const { phone } = req.body;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.PIXEL_ID}/events?access_token=${process.env.ACCESS_TOKEN}`,
      {
        data: [
          {
            event_name: "Lead",
            event_time: Math.floor(Date.now() / 1000),
            user_data: {
              ph: phone
            },
            action_source: "website"
          }
        ]
      }
    );

    res.status(200).json({ message: '전환 API 호출 완료', data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: '전환 API 호출 실패', error: error.response?.data });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행 중 👉 http://localhost:${PORT}`);
});

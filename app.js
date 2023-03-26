const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const openai = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || '<your_api_key>';

app.use(express.json());
app.use(cors());

// 设置 OpenAI API Key
openai.apiKey = API_KEY;

// 接收第三方客户端发送的消息
app.post('/message', async (req, res) => {
  const message = req.body.message;

  try {
    // 调用 OpenAI API 处理消息
    const response = await openai.completions.create({
      engine: 'davinci',
      prompt: message,
      temperature: 0.5,
      maxTokens: 50,
      n: 1,
      stop: '\n'
    });

    const processedMessage = response.data.choices[0].text;

    // 将处理后的消息返回给第三方客户端
    res.send(processedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => console.log(`中转站已启动，监听端口 ${PORT}`));



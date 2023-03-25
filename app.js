const express = require('express');
const cors = require('cors');
const axios = require('axios');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const API_KEY = process.env.API_KEY || '<your_api_key>';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// 使用 cookie-parser 中间件，解析并处理 Cookie
app.use(cookieParser());

// 声明一个中间件，用于检查 API 秘钥是否存在
function checkApiKey(req, res, next) {
  if (!API_KEY) {
    res.status(500).send('API Key is not set');
  } else {
    next();
  }
}

// 中间件，检查是否存在 API 秘钥
app.use(checkApiKey);

// 接收第三方客户端发送的消息
app.post('/message', (req, res) => {
  const message = req.body.message;

  // 调用 chatgpt 的 API 处理消息，携带 API 秘钥
  axios.post('https://api.openai.com/v1/chat/completions ', {
    message: message,
    api_key: API_KEY
  })
  .then(response => {
    const processedMessage = response.data.processedMessage;

    // 将处理后的消息返回给第三方客户端
    res.send(processedMessage);
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Server Error');
  });
});

app.listen(3000, () => console.log('中转站已启动，监听端口 3000'));

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const csrf = require('csurf');
const helmet = require('helmet');
const dotenv = require('dotenv');

// 从 .env 文件中读取 API 秘钥
dotenv.config();
const API_KEY = process.env.API_KEY;

const app = express();

// 添加中间件
app.use(express.json());
// Add CORS headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(csrf());

// 接收第三方客户端发送的消息
app.post('/message', (req, res) => {
  const message = req.body.message;

  // 调用 chatgpt 的 API 处理消息，携带 API 秘钥
  axios.post('http://chatgpt-api.com/process', {
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

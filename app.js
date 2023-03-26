const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const openai = require('openai');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || '<your_api_key>';

// 设置 OpenAI API Key
openai.apiKey = API_KEY;

// 中间件
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));

// 设置速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟内最多 100 次请求
  max: 100
});
app.use('/message', limiter);

// 处理消息的路由
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

    // 将处理后的消息返回给客户端
    res.send(processedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).send('服务器错误');
  }
});

// 监听端口
app.listen(PORT, () => console.log(`中转站已启动，监听端口 ${PORT}`));

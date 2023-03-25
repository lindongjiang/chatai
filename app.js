const express = require('express');
const cors = require('cors');
const axios = require('axios');
const csrf = require('csurf');
const helmet = require('helmet');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();
const API_KEY = process.env.API_KEY;

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cookieParser());

// 将 csrf 中间件添加到所有路由的顶部，以确保对所有 POST，PUT 和 DELETE 请求进行 CSRF 验证
// 但是，要注意，由于 GET 请求不会更改应用程序状态，因此不需要进行 CSRF 验证
app.use(csrf());

// 在所有路由中向模板添加 CSRF 令牌
// 除了 GET 请求之外的所有请求都需要通过模板传递令牌
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.post('/message', (req, res) => {
  const message = req.body.message;

  axios.post('http://chatgpt-api.com/process', {
    message: message,
    api_key: API_KEY
  })
  .then(response => {
    const processedMessage = response.data.processedMessage;
    res.send(processedMessage);
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Server Error');
  });
});

app.listen(3000, () => console.log('Server is running on port 3000'));

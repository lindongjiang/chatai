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
app.use((req, res, next) => {
  const csrfProtection = csrf({ cookie: true });
  csrfProtection(req, res, err => {
    if (err) {
      return res.status(500).send('CSRF token generation failed');
    }
    next();
  });
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
